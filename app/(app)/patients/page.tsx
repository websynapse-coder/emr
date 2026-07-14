'use client';

import * as React from 'react';
import { Users, UserPlus, Search, CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle, ShieldCheck, FileText, ChevronRight, ChevronLeft, Loader as Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRole } from '@/lib/role-context';
import {
  patients as initialPatients,
  users,
  type Patient,
  type AdmissionStep,
} from '@/lib/mockData';
import mockData from '@/lib/mock-data.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';

/* ------------------------------------------------------------------ */
/*  Static data                                                         */
/* ------------------------------------------------------------------ */

const PAYERS = [
  { id: 'payer-aetna', name: 'Aetna' },
  { id: 'payer-blueshield', name: 'Blue Shield of California' },
  { id: 'payer-cigna', name: 'Cigna' },
  { id: 'payer-medicaid', name: 'State Medicaid' },
  { id: 'payer-medicare', name: 'Medicare Part B' },
  { id: 'self-pay', name: 'Self-Pay / No Insurance' },
];

interface IntakeFormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  required: boolean;
  estimatedMinutes: number;
}

const FORM_TEMPLATES = (mockData.intakeFormTemplates as IntakeFormTemplate[]);

interface EligibilityResult {
  result: 'verified' | 'action-needed';
  status: string;
  copayCents: number;
  deductibleMetCents: number;
  deductibleTotalCents: number;
  visitsRemaining: number;
  payerName: string;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  'pre-admission': { label: 'Pre-Admission', className: 'border-warning/40 bg-warning/10 text-warning' },
  'admitted': { label: 'Admitted', className: 'border-info/30 bg-info/10 text-info' },
  'active': { label: 'Active', className: 'border-success/30 bg-success/10 text-success' },
  'discharged': { label: 'Discharged', className: 'border-border bg-surface-sunken text-text-muted' },
};

const ADMISSION_STEPS: { key: AdmissionStep; label: string }[] = [
  { key: 'demographics', label: 'Demographics' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'eligibility', label: 'Eligibility' },
  { key: 'intake-forms', label: 'Intake Forms' },
  { key: 'review', label: 'Review' },
];

const CAN_CREATE_PATIENT: string[] = ['provider', 'front-desk'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatCents(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function getProviderName(providerId?: string): string {
  if (!providerId) return 'Unassigned';
  return users.find((u) => u.id === providerId)?.name ?? 'Unknown';
}

function getPayerName(payerId: string): string {
  return PAYERS.find((p) => p.id === payerId)?.name ?? payerId;
}

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function PatientsPage() {
  const { user, role, organization } = useRole();
  const [patientList, setPatientList] = React.useState<Patient[]>(initialPatients);
  const [search, setSearch] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showNewPatient, setShowNewPatient] = React.useState(false);

  const canCreate = CAN_CREATE_PATIENT.includes(role);

  const filtered = React.useMemo(() => {
    return patientList.filter((p) => {
      const status = p.status ?? 'active';
      if (statusFilter !== 'all' && status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          (p.email ?? '').toLowerCase().includes(q) ||
          (p.phone ?? '').includes(q)
        );
      }
      return true;
    });
  }, [patientList, search, statusFilter]);

  const handlePatientCreated = (patient: Patient) => {
    setPatientList((prev) => [patient, ...prev]);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
            <Users className="h-6 w-6 text-brand-primary" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-h1 font-bold text-text-primary">Patients</h1>
            <p className="text-body text-text-secondary">
              {patientList.length} patients in {organization.shortName}
            </p>
          </div>
        </div>
        {canCreate && (
          <Button onClick={() => setShowNewPatient(true)} className="gap-1.5">
            <UserPlus className="h-4 w-4" aria-hidden="true" />
            New Patient
          </Button>
        )}
      </div>

      {/* Role notice */}
      {!canCreate && (
        <div className="flex items-start gap-2.5 rounded-md border border-info/30 bg-info/5 p-3 text-body-sm text-text-secondary">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
          <p>
            You have view-only access to the patient roster. Only Providers and Front Desk staff can create new patient records.
          </p>
        </div>
      )}

      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone…"
            className="h-9 pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-[160px]">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pre-admission">Pre-Admission</SelectItem>
            <SelectItem value="admitted">Admitted</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="discharged">Discharged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patient table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>DOB</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Admission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-body-sm text-text-muted">
                    No patients found.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((p) => {
                const status = p.status ?? 'active';
                const badge = STATUS_BADGE[status] ?? STATUS_BADGE.active;
                const progress = p.admissionProgress ?? ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'];
                const totalSteps = 6;
                const pct = Math.round((progress.length / totalSteps) * 100);

                return (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-brand-primary/15 text-caption font-semibold text-brand-primary">
                            {getInitials(p.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <span className="text-body-sm font-medium text-text-primary">{p.name}</span>
                          {p.isMinor && <span className="ml-1.5 text-caption text-warning">Minor</span>}
                          {p.email && <p className="text-caption text-text-muted">{p.email}</p>}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-body-sm text-text-secondary">{p.dateOfBirth}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-body-sm text-text-secondary">{getPayerName(p.payerId)}</span>
                      {p.memberId && <p className="text-caption text-text-muted">{p.memberId}</p>}
                    </TableCell>
                    <TableCell>
                      <span className="text-body-sm text-text-secondary">{getProviderName(p.assignedProviderId)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-caption font-semibold', badge.className)}>
                        {badge.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-sunken">
                          <div
                            className={cn('h-full rounded-full', pct === 100 ? 'bg-success' : 'bg-brand-primary')}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-caption text-text-muted">{progress.length}/{totalSteps}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Patient dialog */}
      {showNewPatient && (
        <NewPatientDialog
          onClose={() => setShowNewPatient(false)}
          onCreated={handlePatientCreated}
          currentUserId={user?.id ?? ''}
          orgProviders={users.filter((u) => u.orgId === organization.id && u.role === 'provider')}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  New Patient Dialog — multi-step wizard                             */
/* ------------------------------------------------------------------ */

function NewPatientDialog({
  onClose,
  onCreated,
  currentUserId,
  orgProviders,
}: {
  onClose: () => void;
  onCreated: (p: Patient) => void;
  currentUserId: string;
  orgProviders: { id: string; name: string }[];
}) {
  const [step, setStep] = React.useState(0);

  // Demographics
  const [name, setName] = React.useState('');
  const [dob, setDob] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [isMinor, setIsMinor] = React.useState(false);
  const [guardianName, setGuardianName] = React.useState('');
  const [emergencyName, setEmergencyName] = React.useState('');
  const [emergencyPhone, setEmergencyPhone] = React.useState('');

  // Insurance
  const [payerId, setPayerId] = React.useState('');
  const [memberId, setMemberId] = React.useState('');
  const [groupNumber, setGroupNumber] = React.useState('');

  // Eligibility
  const [eligibility, setEligibility] = React.useState<EligibilityResult | null>(null);
  const [checking, setChecking] = React.useState(false);

  // Intake forms
  const [selectedForms, setSelectedForms] = React.useState<string[]>([]);

  // Assignment
  const [assignedProviderId, setAssignedProviderId] = React.useState(currentUserId);

  const reset = () => {
    setStep(0);
    setName(''); setDob(''); setGender(''); setPhone(''); setEmail(''); setAddress('');
    setIsMinor(false); setGuardianName(''); setEmergencyName(''); setEmergencyPhone('');
    setPayerId(''); setMemberId(''); setGroupNumber('');
    setEligibility(null); setChecking(false);
    setSelectedForms([]);
    setAssignedProviderId(currentUserId);
  };

  const handleClose = () => { reset(); onClose(); };

  const canProceed = (): boolean => {
    switch (step) {
      case 0: return !!(name.trim() && dob.trim() && phone.trim());
      case 1: return !!(payerId && (payerId === 'self-pay' || memberId.trim()));
      case 2: return payerId === 'self-pay' || eligibility !== null;
      case 3: return true;
      case 4: return true;
      default: return false;
    }
  };

  const runEligibility = () => {
    setChecking(true);
    setEligibility(null);
    setTimeout(() => {
      const payer = PAYERS.find((p) => p.id === payerId);
      const verified = Math.random() > 0.2;
      const result: EligibilityResult = verified
        ? {
            result: 'verified', status: 'active',
            copayCents: Math.floor(Math.random() * 5) * 1000,
            deductibleMetCents: Math.floor(Math.random() * 200000),
            deductibleTotalCents: 200000,
            visitsRemaining: Math.floor(Math.random() * 20) + 5,
            payerName: payer?.name ?? payerId,
          }
        : {
            result: 'action-needed', status: 'inactive',
            copayCents: 0, deductibleMetCents: 0, deductibleTotalCents: 0,
            visitsRemaining: 0, payerName: payer?.name ?? payerId,
          };
      setEligibility(result);
      setChecking(false);
    }, 1800);
  };

  const toggleForm = (id: string) => {
    setSelectedForms((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]);
  };

  const handleCreate = () => {
    const requiredIds = FORM_TEMPLATES.filter((f) => f.required).map((f) => f.id);
    const allForms = Array.from(new Set([...requiredIds, ...selectedForms]));

    const newPatient: Patient = {
      id: `pt-${Date.now()}`,
      name: name.trim(),
      dateOfBirth: dob,
      isMinor,
      guardianName: isMinor ? guardianName : undefined,
      payerId,
      memberId: memberId.trim() || 'N/A',
      gender: gender || undefined,
      phone: phone.trim(),
      email: email.trim() || undefined,
      address: address.trim() || undefined,
      emergencyContactName: emergencyName || undefined,
      emergencyContactPhone: emergencyPhone || undefined,
      groupNumber: groupNumber || undefined,
      status: 'pre-admission',
      assignedProviderId,
      admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review'],
      submittedFormIds: allForms,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    onCreated(newPatient);
    reset();
    onClose();
  };

  return (
    <Dialog open onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <UserPlus className="h-5 w-5 text-brand-primary" />
            New Patient
          </DialogTitle>
          <DialogDescription className="text-body-sm text-text-muted">
            Create a patient record and begin the pre-admission workflow
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center gap-1 py-2">
          {ADMISSION_STEPS.map((s, i) => (
            <React.Fragment key={s.key}>
              <div className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1 text-caption font-medium transition-colors',
                i === step ? 'bg-brand-primary text-brand-primary-foreground'
                  : i < step ? 'bg-success/15 text-success'
                  : 'bg-surface-sunken text-text-muted'
              )}>
                {i < step && <CheckCircle2 className="h-3 w-3" />}
                {s.label}
              </div>
              {i < ADMISSION_STEPS.length - 1 && <ChevronRight className="h-3 w-3 text-text-muted" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step content */}
        <div className="min-h-[200px]">
          {/* Step 0: Demographics */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name *"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jordan Avery" /></Field>
                <Field label="Date of Birth *"><Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} /></Field>
                <Field label="Gender">
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-binary">Non-binary</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Phone *"><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(510) 555-0100" /></Field>
                <Field label="Email"><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patient@email.com" /></Field>
                <Field label="Address"><Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Oakland, CA 94601" /></Field>
              </div>
              <div className="flex items-center gap-2 rounded-md border border-border bg-surface-sunken p-3">
                <Checkbox checked={isMinor} onCheckedChange={(v) => setIsMinor(v === true)} />
                <Label className="text-body-sm text-text-primary">Patient is a minor (guardian consent required)</Label>
              </div>
              {isMinor && (
                <Field label="Guardian Name *"><Input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Lucia Rios" /></Field>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Emergency Contact Name"><Input value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} placeholder="Casey Avery" /></Field>
                <Field label="Emergency Contact Phone"><Input value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} placeholder="(510) 555-0101" /></Field>
              </div>
            </div>
          )}

          {/* Step 1: Insurance */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Insurance Payer *">
                  <Select value={payerId} onValueChange={setPayerId}>
                    <SelectTrigger><SelectValue placeholder="Select payer" /></SelectTrigger>
                    <SelectContent>
                      {PAYERS.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Member ID *"><Input value={memberId} onChange={(e) => setMemberId(e.target.value)} placeholder="AET-12-3456" disabled={payerId === 'self-pay'} /></Field>
                <Field label="Group Number"><Input value={groupNumber} onChange={(e) => setGroupNumber(e.target.value)} placeholder="GRP-001" disabled={payerId === 'self-pay'} /></Field>
              </div>
              {payerId === 'self-pay' && (
                <div className="flex items-start gap-2.5 rounded-md border border-info/30 bg-info/5 p-3 text-body-sm text-text-secondary">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                  <p>Self-pay patients don&apos;t require eligibility verification. You can skip the eligibility step.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Eligibility */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-body-sm font-medium text-text-primary">Insurance Eligibility Check</p>
                  <p className="text-caption text-text-muted">
                    Verify coverage with {PAYERS.find((p) => p.id === payerId)?.name}
                  </p>
                </div>
                {payerId !== 'self-pay' && (
                  <Button onClick={runEligibility} disabled={checking} variant="outline" className="gap-1.5">
                    {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    {checking ? 'Checking…' : 'Run Check'}
                  </Button>
                )}
              </div>

              {eligibility && (
                <div className={cn('rounded-lg border p-4', eligibility.result === 'verified' ? 'border-success/30 bg-success/5' : 'border-danger/30 bg-danger/5')}>
                  {eligibility.result === 'verified' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-success" />
                        <span className="text-body-sm font-semibold text-success">Coverage Verified</span>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <EligRow label="Copay" value={formatCents(eligibility.copayCents)} />
                        <EligRow label="Deductible Met" value={formatCents(eligibility.deductibleMetCents)} />
                        <EligRow label="Deductible Total" value={formatCents(eligibility.deductibleTotalCents)} />
                        <EligRow label="Visits Remaining" value={String(eligibility.visitsRemaining)} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-danger" />
                        <span className="text-body-sm font-semibold text-danger">Action Needed</span>
                      </div>
                      <p className="text-body-sm text-text-secondary">
                        Insurance could not be verified. The patient will be flagged for manual follow-up. Front desk will need to collect payment information.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!eligibility && !checking && payerId !== 'self-pay' && (
                <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8">
                  <p className="text-body-sm text-text-muted">Click &ldquo;Run Check&rdquo; to verify insurance coverage in real time.</p>
                </div>
              )}

              {payerId === 'self-pay' && (
                <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8">
                  <p className="text-body-sm text-text-muted">Self-pay — no eligibility check needed.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Intake Forms */}
          {step === 3 && (
            <div className="space-y-3">
              <p className="text-body-sm text-text-secondary">
                Select intake forms to send to the patient. Required forms are auto-included.
              </p>
              <div className="space-y-2">
                {FORM_TEMPLATES.map((form) => {
                  const isReq = form.required;
                  const isSel = selectedForms.includes(form.id) || isReq;
                  return (
                    <div key={form.id} className={cn('flex items-start gap-3 rounded-lg border p-3', isSel ? 'border-brand-primary/30 bg-accent' : 'border-border')}>
                      <Checkbox checked={isSel} onCheckedChange={() => !isReq && toggleForm(form.id)} disabled={isReq} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-text-secondary" />
                          <span className="text-body-sm font-medium text-text-primary">{form.name}</span>
                          {isReq && <Badge variant="outline" className="border-warning/40 bg-warning/10 text-caption text-warning">Required</Badge>}
                        </div>
                        <p className="text-caption text-text-muted">{form.description}</p>
                        <p className="text-caption text-text-muted">~{form.estimatedMinutes} min</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <ReviewSection title="Demographics">
                <ReviewItem label="Name" value={name} />
                <ReviewItem label="DOB" value={dob} />
                <ReviewItem label="Gender" value={gender || '—'} />
                <ReviewItem label="Phone" value={phone} />
                <ReviewItem label="Email" value={email || '—'} />
                <ReviewItem label="Address" value={address || '—'} />
                {isMinor && <ReviewItem label="Guardian" value={guardianName || '—'} />}
                <ReviewItem label="Emergency Contact" value={emergencyName ? `${emergencyName} (${emergencyPhone})` : '—'} />
              </ReviewSection>

              <ReviewSection title="Insurance">
                <ReviewItem label="Payer" value={PAYERS.find((p) => p.id === payerId)?.name ?? '—'} />
                <ReviewItem label="Member ID" value={memberId || '—'} />
                <ReviewItem label="Group Number" value={groupNumber || '—'} />
              </ReviewSection>

              {eligibility && (
                <ReviewSection title="Eligibility">
                  <ReviewItem label="Result" value={eligibility.result === 'verified' ? 'Verified' : 'Action Needed'} />
                  {eligibility.result === 'verified' && (
                    <>
                      <ReviewItem label="Copay" value={formatCents(eligibility.copayCents)} />
                      <ReviewItem label="Visits Remaining" value={String(eligibility.visitsRemaining)} />
                    </>
                  )}
                </ReviewSection>
              )}

              <ReviewSection title="Intake Forms">
                <p className="text-body-sm text-text-secondary">
                  {FORM_TEMPLATES.filter((f) => f.required).length} required + {selectedForms.filter((id) => !FORM_TEMPLATES.find((f) => f.id === id)?.required).length} optional forms selected
                </p>
              </ReviewSection>

              <ReviewSection title="Assignment">
                <Field label="Assigned Provider">
                  <Select value={assignedProviderId} onValueChange={setAssignedProviderId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {orgProviders.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </ReviewSection>

              <div className="flex items-start gap-2.5 rounded-md border border-info/30 bg-info/5 p-3 text-body-sm text-text-secondary">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                <p>
                  The patient will be created in <strong>Pre-Admission</strong> status.
                  Intake forms will be sent to {email || 'the patient'}.
                  Once forms are submitted and reviewed, the patient can be admitted from the Intake page.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleClose}>Cancel</Button>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep((s) => s - 1)} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Back
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleCreate} className="gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> Create Patient
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Small helpers                                                       */
/* ------------------------------------------------------------------ */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-body-sm text-text-primary">{label}</Label>
      {children}
    </div>
  );
}

function EligRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-body-sm text-text-secondary">{label}</span>
      <span className="text-body-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface-sunken p-4">
      <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-text-muted">{title}</p>
      <div className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-caption text-text-muted">{label}</span>
      <p className="text-body-sm text-text-primary">{value}</p>
    </div>
  );
}
