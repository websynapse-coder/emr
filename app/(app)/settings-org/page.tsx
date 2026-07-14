'use client';

import * as React from 'react';
import { Building2, FileText, MapPin, Phone, Mail, User, Calendar, Download, Hospital, Lock, CircleCheck as CheckCircle2, CircleAlert as AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRole } from '@/lib/role-context';
import mockData from '@/lib/mock-data.json';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/*  Types from JSON                                                    */
/* ------------------------------------------------------------------ */

interface OnboardingDoc {
  id: string;
  name: string;
  type: string;
  status: string;
  signedBy: string;
  signedDate: string;
  fileName: string;
}

interface OrgOnboarding {
  orgId: string;
  legalName: string;
  dbaName: string;
  taxId: string;
  npi: string;
  address: string;
  billingAddress: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  billingContactName: string;
  billingContactEmail: string;
  billingContactPhone: string;
  statesServed: string[];
  serviceTypes: string[];
  providerCount: number;
  currentSystem: string;
  salesRepName: string;
  salesRepEmail: string;
  dealCloseDate: string;
  onboardingCompletedDate: string;
  documents: OnboardingDoc[];
}

interface Practice {
  id: string;
  orgId: string;
  name: string;
  address: string;
  phone: string;
  timeZone: string;
  serviceLines: string[];
  modalities: string[];
  visitsPerMonth: number;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SettingsOrgPage() {
  const { organization, user } = useRole();

  const onboarding = (mockData.orgOnboarding as OrgOnboarding[]).find(
    (o) => o.orgId === organization.id
  );
  const practices = (mockData.practices as Practice[]).filter(
    (p) => p.orgId === organization.id
  );

  const isOwner = user?.role === 'org-owner';

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
          <Building2 className="h-6 w-6 text-brand-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Organization Settings</h1>
          <p className="text-body text-text-secondary">
            Organization profile, onboarding details, and signed documents
          </p>
        </div>
      </div>

      {/* Read-only notice */}
      <div
        className={cn(
          'flex items-start gap-2.5 rounded-md border border-info/30 bg-info/5 p-3',
          'text-body-sm text-text-secondary'
        )}
      >
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
        <p>
          Organization profile data was collected during onboarding by your sales representative.
          {!isOwner && ' Only the Org Owner can request changes.'}
          {isOwner && ' To change any field, contact your Moonaria account manager.'}
        </p>
      </div>

      {/* Organization profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 text-text-primary">Organization Profile</CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Legal entity information provided during sales onboarding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <ProfileField label="Legal Name" value={onboarding?.legalName ?? organization.name} />
            <ProfileField label="DBA" value={onboarding?.dbaName ?? organization.shortName} />
            <ProfileField label="Tax ID (EIN)" value={onboarding?.taxId ?? '—'} />
            <ProfileField label="NPI" value={onboarding?.npi ?? '—'} />
            <ProfileField
              label="Primary Address"
              value={onboarding?.address ?? '—'}
              icon={MapPin}
            />
            <ProfileField
              label="Billing Address"
              value={onboarding?.billingAddress ?? '—'}
              icon={MapPin}
            />
            <ProfileField
              label="States Served"
              value={onboarding?.statesServed?.join(', ') ?? '—'}
            />
            <ProfileField
              label="Service Types"
              value={onboarding?.serviceTypes?.join(', ') ?? '—'}
            />
            <ProfileField
              label="Previous System"
              value={onboarding?.currentSystem ?? '—'}
            />
            <ProfileField
              label="Provider Count"
              value={String(onboarding?.providerCount ?? organization.providerCount)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 text-text-primary">Contacts</CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Primary and billing contacts on file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Primary contact */}
            <div className="rounded-lg border border-border bg-surface-sunken p-4">
              <div className="mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                <span className="text-body-sm font-semibold text-text-primary">
                  Primary Contact
                </span>
              </div>
              <p className="text-body-sm font-medium text-text-primary">
                {onboarding?.primaryContactName ?? '—'}
              </p>
              <div className="mt-2 space-y-1">
                <ContactRow
                  icon={Mail}
                  value={onboarding?.primaryContactEmail ?? '—'}
                />
                <ContactRow
                  icon={Phone}
                  value={onboarding?.primaryContactPhone ?? '—'}
                />
              </div>
            </div>

            {/* Billing contact */}
            <div className="rounded-lg border border-border bg-surface-sunken p-4">
              <div className="mb-3 flex items-center gap-2">
                <User className="h-4 w-4 text-text-secondary" aria-hidden="true" />
                <span className="text-body-sm font-semibold text-text-primary">
                  Billing Contact
                </span>
              </div>
              <p className="text-body-sm font-medium text-text-primary">
                {onboarding?.billingContactName ?? '—'}
              </p>
              <div className="mt-2 space-y-1">
                <ContactRow
                  icon={Mail}
                  value={onboarding?.billingContactEmail ?? '—'}
                />
                <ContactRow
                  icon={Phone}
                  value={onboarding?.billingContactPhone ?? '—'}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sales / onboarding info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 text-text-primary">Sales & Onboarding</CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Deal details and onboarding timeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <ProfileField
              label="Sales Representative"
              value={onboarding ? `${onboarding.salesRepName} (${onboarding.salesRepEmail})` : '—'}
              icon={User}
            />
            <ProfileField
              label="Deal Close Date"
              value={onboarding?.dealCloseDate ?? '—'}
              icon={Calendar}
            />
            <ProfileField
              label="Onboarding Completed"
              value={onboarding?.onboardingCompletedDate ?? '—'}
              icon={CheckCircle2}
            />
            <ProfileField
              label="Current Plan"
              value={organization.plan === 'enterprise' ? 'Enterprise' : 'Professional'}
            />
          </div>
        </CardContent>
      </Card>

      {/* Signed documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <FileText className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Signed Documents
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Legal agreements executed during onboarding — including BAA
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Signed By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(onboarding?.documents ?? []).map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <span className="text-body-sm font-medium text-text-primary">
                      {doc.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm text-text-secondary">{doc.type}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm text-text-secondary">{doc.signedBy}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-caption text-text-muted">{doc.signedDate}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-success/30 bg-success/10 text-caption font-semibold text-success"
                    >
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Signed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      className="inline-flex items-center gap-1 rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken hover:text-brand-primary"
                      title={`Download ${doc.fileName}`}
                    >
                      <Download className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Hospital className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Practice Locations
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {practices.length} practice sites under {organization.shortName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Practice</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Service Lines</TableHead>
                <TableHead>Modalities</TableHead>
                <TableHead>Visits/Mo</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {practices.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <span className="text-body-sm font-medium text-text-primary">
                      {p.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-caption text-text-muted">{p.address}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm text-text-secondary">
                      {p.serviceLines.join(', ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm text-text-secondary">
                      {p.modalities.join(', ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm font-medium text-text-primary">
                      {p.visitsPerMonth.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="border-success/30 bg-success/10 text-caption font-semibold text-success"
                    >
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function ProfileField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <p className="mb-0.5 text-caption font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <div className="flex items-start gap-1.5">
        {Icon && <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />}
        <p className="text-body-sm text-text-primary">{value}</p>
      </div>
    </div>
  );
}

function ContactRow({
  icon: Icon,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0 text-text-muted" aria-hidden="true" />
      <span className="text-body-sm text-text-secondary">{value}</span>
    </div>
  );
}
