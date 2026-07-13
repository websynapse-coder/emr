'use client';

import * as React from 'react';
import {
  Receipt,
  FileText,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  AlertCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  charges as allCharges,
  claims as allClaims,
  clinicalNotes,
  cptCodes,
  icdCodes,
  type Charge,
  type Claim,
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function getCptDescription(code: string): string {
  return cptCodes.find((c) => c.code === code)?.description ?? code;
}

function getIcdDescription(code: string): string {
  return icdCodes.find((c) => c.code === code)?.description ?? code;
}

/* ------------------------------------------------------------------ */
/*  Charges page                                                       */
/* ------------------------------------------------------------------ */

export default function ChargesPage() {
  const [charges, setCharges] = React.useState<Charge[]>(allCharges);
  const [claims, setClaims] = React.useState<Claim[]>(allClaims);
  const [reviewCharge, setReviewCharge] = React.useState<Charge | null>(null);

  const billableCharges = charges.filter((c) => {
    const note = clinicalNotes.find((n) => n.id === c.noteId);
    return note && (note.status === 'signed' || note.status === 'cosigned');
  });

  const readyCharges = billableCharges.filter((c) => c.status === 'ready');
  const submittedCharges = billableCharges.filter((c) => c.status === 'submitted');

  const handleSubmitClaim = (charge: Charge, cptCode: string, icdCode: string) => {
    const claimId = `clm-${Date.now()}`;
    const newClaim: Claim = {
      id: claimId,
      chargeId: charge.id,
      patientName: charge.patientName,
      patientId: charge.patientId,
      providerName: charge.providerName,
      serviceDate: charge.serviceDate,
      cptCode,
      icdCode,
      amountCents: charge.amountCents,
      payerName: charge.payerName,
      status: 'submitted',
      submittedAt: new Date().toISOString().slice(0, 10),
    };
    setClaims((prev) => [...prev, newClaim]);
    setCharges((prev) =>
      prev.map((c) => (c.id === charge.id ? { ...c, status: 'submitted', cptCode, icdCode } : c))
    );
    setReviewCharge(null);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Charges</h1>
        <p className="text-body text-text-secondary">
          Charges auto-generated from signed clinical notes. Review and submit claims.
        </p>
      </div>

      {/* Info banner */}
      <div
        className={cn(
          'flex items-start gap-2.5 rounded-md border border-info/30 bg-info/5 p-3',
          'text-body-sm text-text-secondary'
        )}
      >
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
        <p>
          Only notes with a <strong className="text-text-primary">Signed</strong> or{' '}
          <strong className="text-text-primary">Cosigned</strong> status produce billable
          charges. Drafts and notes awaiting cosign are held back automatically.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatTile
          icon={Clock}
          label="Ready to submit"
          value={String(readyCharges.length)}
          tone="warning"
        />
        <StatTile
          icon={ArrowRight}
          label="Submitted"
          value={String(submittedCharges.length)}
          tone="info"
        />
        <StatTile
          icon={Receipt}
          label="Total charges"
          value={formatCents(billableCharges.reduce((sum, c) => sum + c.amountCents, 0))}
          tone="success"
        />
      </div>

      {/* Charges table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Receipt className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Charge queue
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {billableCharges.length} billable charge{billableCharges.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {billableCharges.length === 0 ? (
            <div className="px-6 py-8 text-center text-body-sm text-text-muted">
              No billable charges. Charges appear automatically when clinical notes are signed.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service date</TableHead>
                  <TableHead>CPT</TableHead>
                  <TableHead>ICD-10</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {billableCharges.map((charge) => (
                  <TableRow key={charge.id}>
                    <TableCell>
                      <span className="text-body-sm font-medium text-text-primary">
                        {charge.patientName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-body-sm text-text-secondary">
                        {charge.providerName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-caption text-text-muted">
                        {charge.serviceDate}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-body-sm font-medium text-text-primary">
                          {charge.cptCode}
                        </span>
                        <span className="text-caption text-text-muted">
                          {getCptDescription(charge.cptCode)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-body-sm font-medium text-text-primary">
                          {charge.icdCode}
                        </span>
                        <span className="text-caption text-text-muted">
                          {getIcdDescription(charge.icdCode)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-body-sm font-medium text-text-primary">
                        {formatCents(charge.amountCents)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ChargeStatusBadge status={charge.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {charge.status === 'ready' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setReviewCharge(charge)}
                          className="gap-1"
                        >
                          <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                          Review
                        </Button>
                      ) : (
                        <span className="text-caption text-text-muted">Submitted</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Review dialog */}
      <ChargeReviewDialog
        charge={reviewCharge}
        onClose={() => setReviewCharge(null)}
        onSubmit={handleSubmitClaim}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Charge review dialog                                                */
/* ------------------------------------------------------------------ */

function ChargeReviewDialog({
  charge,
  onClose,
  onSubmit,
}: {
  charge: Charge | null;
  onClose: () => void;
  onSubmit: (charge: Charge, cptCode: string, icdCode: string) => void;
}) {
  const [cptCode, setCptCode] = React.useState('');
  const [icdCode, setIcdCode] = React.useState('');

  React.useEffect(() => {
    if (charge) {
      setCptCode(charge.cptCode);
      setIcdCode(charge.icdCode);
    }
  }, [charge]);

  if (!charge) return null;

  const note = clinicalNotes.find((n) => n.id === charge.noteId);
  const selectedCpt = cptCodes.find((c) => c.code === cptCode);

  return (
    <Dialog open={!!charge} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-h3 text-text-primary">Review charge</DialogTitle>
          <DialogDescription className="text-body-sm text-text-muted">
            Confirm or edit billing codes before submitting the claim.
          </DialogDescription>
        </DialogHeader>

        {/* Charge context */}
        <div className="space-y-2 rounded-md border border-border bg-surface-sunken p-3">
          <div className="flex items-center justify-between">
            <span className="text-caption text-text-muted">Patient</span>
            <span className="text-body-sm font-medium text-text-primary">
              {charge.patientName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-caption text-text-muted">Provider</span>
            <span className="text-body-sm text-text-secondary">
              {charge.providerName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-caption text-text-muted">Service date</span>
            <span className="text-body-sm text-text-secondary">
              {charge.serviceDate}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-caption text-text-muted">Payer</span>
            <span className="text-body-sm text-text-secondary">
              {charge.payerName}
            </span>
          </div>
          {note && (
            <div className="flex items-center justify-between">
              <span className="text-caption text-text-muted">Note status</span>
              <Badge
                variant="outline"
                className={cn(
                  note.status === 'cosigned'
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-success/30 bg-success/10 text-success',
                  'text-caption font-semibold'
                )}
              >
                {note.status === 'cosigned' ? 'Cosigned' : 'Signed'}
              </Badge>
            </div>
          )}
        </div>

        {/* Editable codes */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-body-sm text-text-primary">CPT code</Label>
            <Select value={cptCode} onValueChange={setCptCode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cptCodes.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} — {c.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-body-sm text-text-primary">ICD-10 code</Label>
            <Select value={icdCode} onValueChange={setIcdCode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {icdCodes.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} — {c.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amount */}
        <div className="flex items-center justify-between rounded-md border border-border bg-surface p-3">
          <span className="text-body-sm text-text-secondary">Billed amount</span>
          <span className="text-h4 font-semibold text-text-primary">
            {formatCents(selectedCpt?.amountCents ?? charge.amountCents)}
          </span>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit(charge, cptCode, icdCode)}
            className="gap-1.5"
          >
            Submit Claim
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Status badge + stat tile                                           */
/* ------------------------------------------------------------------ */

function ChargeStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    ready: 'border-warning/40 bg-warning/10 text-warning',
    submitted: 'border-info/30 bg-info/10 text-info',
    hold: 'border-border bg-surface-sunken text-text-muted',
  };
  const labels: Record<string, string> = {
    ready: 'Ready',
    submitted: 'Submitted',
    hold: 'On Hold',
  };
  return (
    <Badge variant="outline" className={cn('text-caption font-semibold', map[status])}>
      {labels[status]}
    </Badge>
  );
}

type Tone = 'info' | 'success' | 'warning' | 'danger';

const toneMap: Record<Tone, { bg: string; text: string }> = {
  info: { bg: 'bg-info/12', text: 'text-info' },
  success: { bg: 'bg-success/12', text: 'text-success' },
  warning: { bg: 'bg-warning/15', text: 'text-warning' },
  danger: { bg: 'bg-danger/12', text: 'text-danger' },
};

function StatTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Receipt;
  label: string;
  value: string;
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
