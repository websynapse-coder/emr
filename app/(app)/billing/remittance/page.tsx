'use client';

import {
  Wallet,
  Banknote,
  Clock,
  CalendarDays,
  TrendingUp,
  Receipt,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  remittances,
  payoutSummary,
} from '@/lib/mockData';
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
import { Badge } from '@/components/ui/badge';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/* ------------------------------------------------------------------ */
/*  Remittance & payout page                                           */
/* ------------------------------------------------------------------ */

export default function RemittancePage() {
  const totalPaid = remittances.reduce((sum, r) => sum + r.paidAmountCents, 0);
  const totalPatientResp = remittances.reduce(
    (sum, r) => sum + r.patientResponsibilityCents,
    0
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Remittance &amp; Payout</h1>
        <p className="text-body text-text-secondary">
          Track payer remittances and organization-level payouts.
        </p>
      </div>

      {/* Payout summary card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Wallet className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Payout summary
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {payoutSummary.periodLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Paid out */}
            <div
              className={cn(
                'flex flex-col gap-1.5 rounded-lg border border-success/30',
                'bg-success/5 p-4'
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-success/15">
                  <Banknote className="h-5 w-5 text-success" aria-hidden="true" />
                </div>
                <span className="text-caption text-text-muted">Total paid out</span>
              </div>
              <span className="text-h2 font-bold text-text-primary">
                {formatCents(payoutSummary.totalPaidOutCents)}
              </span>
              <span className="flex items-center gap-1 text-caption text-success">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                This period
              </span>
            </div>

            {/* Pending */}
            <div
              className={cn(
                'flex flex-col gap-1.5 rounded-lg border border-warning/40',
                'bg-warning/5 p-4'
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-warning/15">
                  <Clock className="h-5 w-5 text-warning" aria-hidden="true" />
                </div>
                <span className="text-caption text-text-muted">Pending</span>
              </div>
              <span className="text-h2 font-bold text-text-primary">
                {formatCents(payoutSummary.pendingCents)}
              </span>
              <span className="text-caption text-text-muted">
                Awaiting adjudication
              </span>
            </div>

            {/* Next payout */}
            <div
              className={cn(
                'flex flex-col gap-1.5 rounded-lg border border-info/30',
                'bg-info/5 p-4'
              )}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-info/15">
                  <CalendarDays className="h-5 w-5 text-info" aria-hidden="true" />
                </div>
                <span className="text-caption text-text-muted">Next payout</span>
              </div>
              <span className="text-h2 font-bold text-text-primary">
                {new Date(payoutSummary.nextPayoutDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <span className="text-caption text-text-muted">
                {payoutSummary.nextPayoutDate}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Remittance list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Receipt className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Remittances
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {remittances.length} remittance{remittances.length !== 1 ? 's' : ''} posted
            · {formatCents(totalPaid)} paid · {formatCents(totalPatientResp)} patient responsibility
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Payer</TableHead>
                <TableHead className="text-right">Billed</TableHead>
                <TableHead className="text-right">Paid</TableHead>
                <TableHead className="text-right">Patient Resp.</TableHead>
                <TableHead>Posted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {remittances.map((rmt) => (
                <TableRow key={rmt.id}>
                  <TableCell>
                    <span className="font-mono text-caption text-text-muted">
                      {rmt.referenceNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm font-medium text-text-primary">
                      {rmt.patientName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm text-text-secondary">
                      {rmt.payerName}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-body-sm text-text-secondary">
                      {formatCents(rmt.billedAmountCents)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {rmt.paidAmountCents > 0 ? (
                      <span className="text-body-sm font-medium text-success">
                        {formatCents(rmt.paidAmountCents)}
                      </span>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-danger/30 bg-danger/10 text-caption font-semibold text-danger"
                      >
                        Denied
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-body-sm text-text-secondary">
                      {formatCents(rmt.patientResponsibilityCents)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-caption text-text-muted">
                      {rmt.postedDate}
                    </span>
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
