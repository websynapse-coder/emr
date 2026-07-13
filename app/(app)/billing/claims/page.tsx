'use client';

import * as React from 'react';
import {
  FileCheck2,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  claims as allClaims,
  CLAIM_STATUS_LABELS,
  type Claim,
  type ClaimStatus,
} from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/* ------------------------------------------------------------------ */
/*  Claims page                                                        */
/* ------------------------------------------------------------------ */

export default function ClaimsPage() {
  const [claims] = React.useState<Claim[]>(allClaims);

  const counts = {
    submitted: claims.filter((c) => c.status === 'submitted').length,
    adjudicated: claims.filter((c) => c.status === 'adjudicated').length,
    paid: claims.filter((c) => c.status === 'paid').length,
    denied: claims.filter((c) => c.status === 'denied').length,
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Claims</h1>
        <p className="text-body text-text-secondary">
          Track claims through submission, adjudication, and resolution.
        </p>
      </div>

      {/* Status summary tiles */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SummaryTile icon={Send} label="Submitted" value={counts.submitted} tone="info" />
        <SummaryTile icon={Clock} label="Adjudicated" value={counts.adjudicated} tone="warning" />
        <SummaryTile icon={CheckCircle2} label="Paid" value={counts.paid} tone="success" />
        <SummaryTile icon={XCircle} label="Denied" value={counts.denied} tone="danger" />
      </div>

      {/* Claims table with steppers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <FileCheck2 className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            All claims
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {claims.length} claim{claims.length !== 1 ? 's' : ''} across all statuses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {claims.map((claim) => (
            <ClaimRow key={claim.id} claim={claim} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Claim row with status stepper                                       */
/* ------------------------------------------------------------------ */

function ClaimRow({ claim }: { claim: Claim }) {
  return (
    <div
      className={cn(
        'rounded-md border border-border bg-surface p-4',
        claim.status === 'denied' && 'border-danger/30 bg-danger/5'
      )}
    >
      {/* Top row: claim info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-body-sm font-medium text-text-primary">
              {claim.patientName}
            </span>
            <Badge variant="outline" className="border-border bg-surface-sunken text-caption font-medium text-text-muted">
              {claim.id}
            </Badge>
          </div>
          <p className="text-caption text-text-muted">
            {claim.providerName} · {claim.serviceDate} · {claim.payerName}
          </p>
          <p className="text-caption text-text-muted">
            CPT {claim.cptCode} · ICD-10 {claim.icdCode}
          </p>
        </div>
        <div className="text-right">
          <p className="text-h4 font-semibold text-text-primary">
            {formatCents(claim.amountCents)}
          </p>
          {claim.paidAmountCents !== undefined && (
            <p className="text-caption text-success">
              Paid: {formatCents(claim.paidAmountCents)}
            </p>
          )}
          {claim.patientResponsibilityCents !== undefined && (
            <p className="text-caption text-text-muted">
              Patient: {formatCents(claim.patientResponsibilityCents)}
            </p>
          )}
        </div>
      </div>

      {/* Status stepper */}
      <div className="mt-4">
        <StatusStepper status={claim.status} />
      </div>

      {/* Denial reason */}
      {claim.status === 'denied' && claim.denialReason && (
        <div
          className={cn(
            'mt-3 flex items-start gap-2.5 rounded-md border border-danger/30',
            'bg-danger/10 p-3'
          )}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
          <div>
            <p className="text-body-sm font-semibold text-danger">
              Denial reason
            </p>
            <p className="text-body-sm text-text-secondary">
              {claim.denialReason}
            </p>
          </div>
        </div>
      )}

      {/* Timestamps */}
      <div className="mt-3 flex flex-wrap gap-4 text-caption text-text-muted">
        <span>Submitted: {claim.submittedAt}</span>
        {claim.adjudicatedAt && <span>Adjudicated: {claim.adjudicatedAt}</span>}
        {claim.resolvedAt && (
          <span>
            {claim.status === 'denied' ? 'Denied' : 'Paid'}: {claim.resolvedAt}
          </span>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status stepper                                                      */
/* ------------------------------------------------------------------ */

function StatusStepper({ status }: { status: ClaimStatus }) {
  const steps: { id: ClaimStatus; label: string; icon: typeof Send }[] = [
    { id: 'submitted', label: 'Submitted', icon: Send },
    { id: 'adjudicated', label: 'Adjudicated', icon: Clock },
    { id: 'paid', label: 'Paid', icon: CheckCircle2 },
  ];

  // For denied claims, show submitted -> adjudicated -> denied
  const isDenied = status === 'denied';
  const currentIdx = isDenied
    ? 2 // denied is at the "resolution" step
    : steps.findIndex((s) => s.id === status);

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx && !isDenied;
        const isDeniedStep = isDenied && i === 2;
        const Icon = step.icon;

        return (
          <React.Fragment key={step.id}>
            <div className="flex items-center gap-1.5">
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors',
                  isDeniedStep
                    ? 'border-danger bg-danger text-danger-foreground'
                    : done
                      ? 'border-success bg-success text-success-foreground'
                      : active
                        ? 'border-brand-primary bg-brand-primary text-brand-primary-foreground'
                        : 'border-border bg-surface text-text-muted'
                )}
              >
                {isDeniedStep ? (
                  <XCircle className="h-4 w-4" aria-hidden="true" />
                ) : done ? (
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </div>
              <span
                className={cn(
                  'text-caption font-medium',
                  isDeniedStep
                    ? 'text-danger'
                    : done
                      ? 'text-success'
                      : active
                        ? 'text-brand-primary'
                        : 'text-text-muted'
                )}
              >
                {isDeniedStep ? 'Denied' : step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-px flex-1',
                  i < currentIdx ? 'bg-success' : 'bg-border'
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary tile                                                        */
/* ------------------------------------------------------------------ */

type Tone = 'info' | 'success' | 'warning' | 'danger';

const toneMap: Record<Tone, { bg: string; text: string }> = {
  info: { bg: 'bg-info/12', text: 'text-info' },
  success: { bg: 'bg-success/12', text: 'text-success' },
  warning: { bg: 'bg-warning/15', text: 'text-warning' },
  danger: { bg: 'bg-danger/12', text: 'text-danger' },
};

function SummaryTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Send;
  label: string;
  value: number;
  tone: Tone;
}) {
  const t = toneMap[tone];
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-md', t.bg)}>
          <Icon className={cn('h-5 w-5', t.text)} aria-hidden="true" />
        </div>
        <div>
          <p className="text-caption text-text-muted">{label}</p>
          <p className="text-h3 font-semibold text-text-primary">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
