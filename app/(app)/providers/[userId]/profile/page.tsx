'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Stethoscope,
  ShieldCheck,
  GraduationCap,
  Save,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  users,
  providerProfiles,
  samplePayers,
  getLicensedProviders,
  CREDENTIALING_STATUS_LABELS,
  type CredentialingStatus,
  type PayerCredential,
  type User,
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* ------------------------------------------------------------------ */
/*  Provider profile completion page                                   */
/* ------------------------------------------------------------------ */

export default function ProviderProfilePage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();

  const user = users.find((u) => u.id === params.userId);
  const existingProfile = providerProfiles.find((p) => p.userId === params.userId);

  const [npi, setNpi] = React.useState(existingProfile?.npi ?? '');
  const [licenseNumber, setLicenseNumber] = React.useState(
    existingProfile?.licenseNumber ?? ''
  );
  const [licenseState, setLicenseState] = React.useState(
    existingProfile?.licenseState ?? ''
  );
  const [taxonomyCode, setTaxonomyCode] = React.useState(
    existingProfile?.taxonomyCode ?? ''
  );
  const [isAssociate, setIsAssociate] = React.useState(
    existingProfile?.isAssociate ?? false
  );
  const [supervisorId, setSupervisorId] = React.useState<string>(
    existingProfile?.supervisorId ?? ''
  );
  const [credentials, setCredentials] = React.useState<PayerCredential[]>(
    existingProfile?.credentials ??
      samplePayers.map((p) => ({
        payerId: p.id,
        payerName: p.name,
        status: 'not-credentialed' as CredentialingStatus,
      }))
  );

  const licensedProviders = getLicensedProviders().filter(
    (u) => u.id !== params.userId
  );

  const updateCredential = (payerId: string, status: CredentialingStatus) => {
    setCredentials((prev) =>
      prev.map((c) => (c.payerId === payerId ? { ...c, status } : c))
    );
  };

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-body text-text-muted">Provider not found.</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4 gap-1.5">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.back()}
        className={cn(
          'flex items-center gap-1.5 text-body-sm text-text-muted',
          'transition-colors hover:text-text-primary'
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back
      </button>

      {/* Provider header */}
      <div
        className={cn(
          'flex items-center gap-4 rounded-lg border border-border',
          'bg-surface-raised p-5'
        )}
      >
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-brand-primary text-brand-primary-foreground text-h4">
            {user.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-h2 font-bold text-text-primary">{user.name}</h1>
          <p className="text-body text-text-secondary">{user.title}</p>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'border-warning/40 bg-warning/10 text-caption font-semibold text-warning'
          )}
        >
          Profile {existingProfile?.completion ?? 0}% complete
        </Badge>
      </div>

      {/* Professional info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Stethoscope className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Professional information
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Required for claims submission and payer credentialing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="NPI number" required>
              <Input
                value={npi}
                onChange={(e) => setNpi(e.target.value)}
                placeholder="10-digit NPI"
                maxLength={10}
              />
            </Field>
            <Field label="Taxonomy code">
              <Input
                value={taxonomyCode}
                onChange={(e) => setTaxonomyCode(e.target.value)}
                placeholder="e.g. 103T00000X"
              />
            </Field>
            <Field label="License number" required>
              <Input
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. PSY-29381"
              />
            </Field>
            <Field label="License state" required>
              <Input
                value={licenseState}
                onChange={(e) => setLicenseState(e.target.value)}
                placeholder="e.g. OR"
                maxLength={2}
              />
            </Field>
          </div>

          {/* Associate / intern checkbox */}
          <label
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-md border border-border',
              'bg-surface p-3 transition-colors hover:bg-surface-sunken'
            )}
          >
            <Checkbox
              checked={isAssociate}
              onCheckedChange={(v) => {
                setIsAssociate(v === true);
                if (!v) setSupervisorId('');
              }}
              className="mt-0.5"
            />
            <span className="text-body-sm text-text-secondary">
              <strong className="text-text-primary">
                Associate-level / Intern
              </strong>{' '}
              — this provider is practicing under supervision and requires an
              assigned supervisor.
            </span>
          </label>

          {/* Conditional supervisor field */}
          {isAssociate && (
            <div
              className={cn(
                'rounded-md border border-info/30 bg-info/5 p-4',
                'animate-in fade-in-0 slide-in-from-top-2 duration-200'
              )}
            >
              <div className="flex items-center gap-2 text-body-sm font-medium text-info">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                Supervisor assignment
              </div>
              <p className="mt-1 text-caption text-text-muted">
                Select a licensed provider who will supervise this associate.
              </p>
              <div className="mt-3 space-y-1.5">
                <Label className="text-body-sm text-text-primary">
                  Supervising provider
                </Label>
                <Select
                  value={supervisorId}
                  onValueChange={setSupervisorId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a licensed provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {licensedProviders.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} — {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payer credentialing status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <ShieldCheck className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Payer credentialing status
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Update each payer&rsquo;s credentialing status as it progresses.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {credentials.map((cred) => (
            <CredentialRow
              key={cred.payerId}
              credential={cred}
              onChange={(status) => updateCredential(cred.payerId, status)}
            />
          ))}
        </CardContent>
      </Card>

      {/* Save bar */}
      <div
        className={cn(
          'sticky bottom-0 flex items-center justify-end gap-3 rounded-lg border border-border',
          'bg-surface-raised p-4 shadow-sm'
        )}
      >
        <Button variant="ghost">Cancel</Button>
        <Button className="gap-1.5">
          <Save className="h-4 w-4" aria-hidden="true" />
          Save profile
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Credential row with editable status                                */
/* ------------------------------------------------------------------ */

function CredentialRow({
  credential,
  onChange,
}: {
  credential: PayerCredential;
  onChange: (status: CredentialingStatus) => void;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-md border border-border bg-surface px-4 py-3',
        'sm:flex-row sm:items-center sm:justify-between'
      )}
    >
      <div className="flex items-center gap-2.5">
        <StatusIcon status={credential.status} />
        <span className="text-body-sm font-medium text-text-primary">
          {credential.payerName}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={credential.status} />
        <Select
          value={credential.status}
          onValueChange={(v) => onChange(v as CredentialingStatus)}
        >
          <SelectTrigger className="h-8 w-40 text-body-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credentialed">Credentialed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="not-credentialed">Not Credentialed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: CredentialingStatus }) {
  if (status === 'credentialed')
    return <CheckCircle2 className="h-4 w-4 text-success" aria-hidden="true" />;
  if (status === 'pending')
    return <Clock className="h-4 w-4 text-warning" aria-hidden="true" />;
  return <AlertCircle className="h-4 w-4 text-text-muted" aria-hidden="true" />;
}

function StatusBadge({ status }: { status: CredentialingStatus }) {
  const map: Record<CredentialingStatus, string> = {
    credentialed: 'border-success/30 bg-success/10 text-success',
    pending: 'border-warning/40 bg-warning/10 text-warning',
    'not-credentialed': 'border-border bg-surface-sunken text-text-muted',
  };
  return (
    <Badge
      variant="outline"
      className={cn('text-caption font-semibold', map[status])}
    >
      {CREDENTIALING_STATUS_LABELS[status]}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Field helper                                                       */
/* ------------------------------------------------------------------ */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-body-sm text-text-primary">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </Label>
      {children}
    </div>
  );
}
