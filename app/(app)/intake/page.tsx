'use client';

import * as React from 'react';
import { UserCheck, FileText, CircleCheck as CheckCircle2, Clock, CircleAlert as AlertCircle, Search, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRole } from '@/lib/role-context';
import {
  patients as initialPatients,
  users,
  type Patient,
} from '@/lib/mockData';
import mockData from '@/lib/mock-data.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/*  Types + helpers                                                     */
/* ------------------------------------------------------------------ */

interface IntakeFormTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  required: boolean;
  estimatedMinutes: number;
}

const FORM_TEMPLATES = (mockData.intakeFormTemplates as IntakeFormTemplate[]);

function getInitials(name: string): string {
  return name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

function getProviderName(providerId?: string): string {
  if (!providerId) return 'Unassigned';
  return users.find((u) => u.id === providerId)?.name ?? 'Unknown';
}

const CAN_ADMIT: string[] = ['provider', 'front-desk', 'practice-manager'];

/* ------------------------------------------------------------------ */
/*  Main page                                                           */
/* ------------------------------------------------------------------ */

export default function IntakePage() {
  const { organization, role } = useRole();
  const [patientList, setPatientList] = React.useState<Patient[]>(initialPatients);
  const [search, setSearch] = React.useState('');
  const [admitPatient, setAdmitPatient] = React.useState<Patient | null>(null);

  const canAdmit = CAN_ADMIT.includes(role);

  const preAdmission = React.useMemo(
    () =>
      patientList.filter(
        (p) =>
          p.status === 'pre-admission' &&
          p.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [patientList, search]
  );

  const admitted = React.useMemo(
    () =>
      patientList.filter(
        (p) =>
          (p.status === 'admitted' || p.status === 'active') &&
          p.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [patientList, search]
  );

  const handleAdmit = (patient: Patient) => {
    setPatientList((prev) =>
      prev.map((p) =>
        p.id === patient.id
          ? { ...p, status: 'admitted', admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'] }
          : p
      )
    );
    setAdmitPatient(null);
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
          <UserCheck className="h-6 w-6 text-brand-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Intake</h1>
          <p className="text-body text-text-secondary">
            Pre-admission queue, intake form tracking, and patient admission
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-warning" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">Pre-Admission</span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">{preAdmission.length}</p>
            <p className="text-body-sm text-text-secondary">awaiting intake</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">Admitted</span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">{admitted.length}</p>
            <p className="text-body-sm text-text-secondary">active patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-primary" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">Form Templates</span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">{FORM_TEMPLATES.length}</p>
            <p className="text-body-sm text-text-secondary">{FORM_TEMPLATES.filter((f) => f.required).length} required</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search patients in intake…" className="h-9 pl-8" />
      </div>

      {/* Pre-admission queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Clock className="h-5 w-5 text-warning" />
            Pre-Admission Queue
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Patients awaiting intake form completion before admission
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {preAdmission.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success" />
              <p className="text-body-sm text-text-muted">No patients in pre-admission. All intake is complete.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Intake Forms</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {preAdmission.map((p) => {
                  const submitted = p.submittedFormIds ?? [];
                  const required = FORM_TEMPLATES.filter((f) => f.required);
                  const done = required.filter((f) => submitted.includes(f.id));
                  const allDone = done.length === required.length;

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
                            {p.email && <p className="text-caption text-text-muted">{p.email}</p>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-body-sm text-text-secondary">{getProviderName(p.assignedProviderId)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {required.map((f) => {
                            const isDone = submitted.includes(f.id);
                            return (
                              <div key={f.id} className="flex items-center gap-1.5">
                                {isDone ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Clock className="h-3.5 w-3.5 text-text-muted" />}
                                <span className={cn('text-caption', isDone ? 'text-text-secondary' : 'text-text-muted')}>{f.name}</span>
                              </div>
                            );
                          })}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-surface-sunken">
                            <div
                              className={cn('h-full rounded-full', allDone ? 'bg-success' : 'bg-warning')}
                              style={{ width: `${Math.round((done.length / required.length) * 100)}%` }}
                            />
                          </div>
                          <span className="text-caption text-text-muted">{done.length}/{required.length}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {canAdmit ? (
                          <Button size="sm" variant={allDone ? 'default' : 'outline'} onClick={() => setAdmitPatient(p)} className="gap-1">
                            {allDone ? <><CheckCircle2 className="h-3.5 w-3.5" /> Admit</> : <><ChevronRight className="h-3.5 w-3.5" /> Review</>}
                          </Button>
                        ) : (
                          <Badge variant="outline" className="border-border bg-surface-sunken text-caption text-text-muted">View only</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form templates reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <FileText className="h-5 w-5 text-brand-primary" />
            Intake Form Templates
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Forms sent to patients during pre-admission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {FORM_TEMPLATES.map((form) => (
              <div key={form.id} className="flex items-start gap-3 rounded-lg border border-border bg-surface-sunken p-3">
                <FileText className="mt-0.5 h-5 w-5 shrink-0 text-brand-primary" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-medium text-text-primary">{form.name}</span>
                    {form.required ? (
                      <Badge variant="outline" className="border-warning/40 bg-warning/10 text-caption text-warning">Required</Badge>
                    ) : (
                      <Badge variant="outline" className="border-border bg-surface text-caption text-text-muted">Optional</Badge>
                    )}
                  </div>
                  <p className="text-caption text-text-muted">{form.description}</p>
                  <p className="text-caption text-text-muted">~{form.estimatedMinutes} min</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Admit dialog */}
      {admitPatient && (
        <AdmitDialog patient={admitPatient} onClose={() => setAdmitPatient(null)} onAdmit={handleAdmit} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Admit Dialog                                                        */
/* ------------------------------------------------------------------ */

function AdmitDialog({
  patient,
  onClose,
  onAdmit,
}: {
  patient: Patient;
  onClose: () => void;
  onAdmit: (p: Patient) => void;
}) {
  const submitted = patient.submittedFormIds ?? [];
  const required = FORM_TEMPLATES.filter((f) => f.required);
  const requiredDone = required.filter((f) => submitted.includes(f.id));
  const allDone = requiredDone.length === required.length;
  const optional = FORM_TEMPLATES.filter((f) => !f.required);

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <UserCheck className="h-5 w-5 text-brand-primary" />
            Admit Patient
          </DialogTitle>
          <DialogDescription className="text-body-sm text-text-muted">
            Review intake forms for {patient.name} before admitting
          </DialogDescription>
        </DialogHeader>

        {/* Patient info */}
        <div className="flex items-center gap-3 rounded-lg border border-border bg-surface-sunken p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-brand-primary/15 text-caption font-semibold text-brand-primary">
              {getInitials(patient.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-body-sm font-medium text-text-primary">{patient.name}</p>
            <p className="text-caption text-text-muted">DOB {patient.dateOfBirth} · Provider {getProviderName(patient.assignedProviderId)}</p>
          </div>
        </div>

        {/* Required forms */}
        <div>
          <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-text-muted">Required Forms</p>
          <div className="space-y-2">
            {required.map((f) => {
              const done = submitted.includes(f.id);
              return (
                <div key={f.id} className={cn('flex items-center gap-2.5 rounded-md border p-2.5', done ? 'border-success/30 bg-success/5' : 'border-warning/40 bg-warning/5')}>
                  {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <AlertCircle className="h-4 w-4 text-warning" />}
                  <span className="flex-1 text-body-sm text-text-primary">{f.name}</span>
                  {done ? (
                    <Badge variant="outline" className="border-success/30 bg-success/10 text-caption text-success">Submitted</Badge>
                  ) : (
                    <Badge variant="outline" className="border-warning/40 bg-warning/10 text-caption text-warning">Pending</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional forms */}
        {optional.length > 0 && (
          <div>
            <p className="mb-2 text-caption font-semibold uppercase tracking-wide text-text-muted">Optional Forms</p>
            <div className="space-y-2">
              {optional.map((f) => {
                const done = submitted.includes(f.id);
                return (
                  <div key={f.id} className="flex items-center gap-2.5 rounded-md border border-border p-2.5">
                    {done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Clock className="h-4 w-4 text-text-muted" />}
                    <span className="flex-1 text-body-sm text-text-primary">{f.name}</span>
                    <Badge variant="outline" className="border-border bg-surface-sunken text-caption text-text-muted">{done ? 'Submitted' : 'Not sent'}</Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!allDone && (
          <div className="flex items-start gap-2.5 rounded-md border border-warning/40 bg-warning/5 p-3 text-body-sm text-text-secondary">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p>Not all required forms have been submitted. You can still admit the patient, but missing forms should be collected before the first session.</p>
          </div>
        )}

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onAdmit(patient)} className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Admit Patient
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
