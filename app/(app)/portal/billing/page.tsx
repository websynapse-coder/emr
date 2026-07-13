'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  DollarSign,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  getPatientBillItems,
  getPatientBalance,
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
/*  Patient billing page                                               */
/* ------------------------------------------------------------------ */

export default function PortalBillingPage() {
  const patientId = 'pt-001';
  const billItems = getPatientBillItems(patientId);
  const balance = getPatientBalance(patientId);

  const owedItems = billItems.filter(
    (i) => i.status === 'balance-due' || i.status === 'denied'
  );
  const paidItems = billItems.filter((i) => i.status === 'paid');

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      {/* Back link */}
      <Link
        href="/portal"
        className={cn(
          'flex items-center gap-1.5 text-body-sm text-text-muted',
          'transition-colors hover:text-text-primary'
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to portal
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Billing &amp; Balance</h1>
        <p className="text-body text-text-secondary">
          Your charges, insurance payments, and outstanding balance.
        </p>
      </div>

      {/* Balance summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryTile
          icon={Wallet}
          label="Amount owed"
          value={formatCents(balance.totalOwedCents)}
          tone={balance.totalOwedCents > 0 ? 'warning' : 'success'}
        />
        <SummaryTile
          icon={CheckCircle2}
          label="Amount paid"
          value={formatCents(balance.totalPaidCents)}
          tone="success"
        />
        <SummaryTile
          icon={DollarSign}
          label="Total billed"
          value={formatCents(balance.totalBilledCents)}
          tone="info"
        />
      </div>

      {/* What's owed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Clock className="h-5 w-5 text-warning" aria-hidden="true" />
            Amount owed
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {owedItems.length} item{owedItems.length !== 1 ? 's' : ''} with an outstanding balance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {owedItems.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
              <p className="text-body-sm text-text-secondary">
                You are all caught up — no outstanding balance.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead className="text-right">Billed</TableHead>
                  <TableHead className="text-right">Insurance</TableHead>
                  <TableHead className="text-right">Your share</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owedItems.map((item) => (
                  <BillRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* What's been paid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
            Payment history
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {paidItems.length} paid item{paidItems.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {paidItems.length === 0 ? (
            <p className="px-6 py-8 text-center text-body-sm text-text-muted">
              No payment history yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead className="text-right">Billed</TableHead>
                  <TableHead className="text-right">Insurance</TableHead>
                  <TableHead className="text-right">You paid</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paidItems.map((item) => (
                  <BillRow key={item.id} item={item} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Bill row                                                            */
/* ------------------------------------------------------------------ */

function BillRow({ item }: { item: ReturnType<typeof getPatientBillItems>[number] }) {
  const statusMap: Record<string, { label: string; class: string }> = {
    paid: { label: 'Paid', class: 'border-success/30 bg-success/10 text-success' },
    'balance-due': { label: 'Balance Due', class: 'border-warning/40 bg-warning/10 text-warning' },
    denied: { label: 'Denied', class: 'border-danger/30 bg-danger/10 text-danger' },
    pending: { label: 'Pending', class: 'border-info/30 bg-info/10 text-info' },
  };
  const status = statusMap[item.status];

  return (
    <TableRow>
      <TableCell>
        <span className="text-body-sm font-medium text-text-primary">
          {item.description}
        </span>
      </TableCell>
      <TableCell>
        <span className="text-caption text-text-muted">{item.serviceDate}</span>
      </TableCell>
      <TableCell>
        <span className="text-body-sm text-text-secondary">{item.payerName}</span>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-body-sm text-text-secondary">
          {formatCents(item.billedCents)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-body-sm text-success">
          {formatCents(item.insurancePaidCents)}
        </span>
      </TableCell>
      <TableCell className="text-right">
        <span className="text-body-sm font-medium text-text-primary">
          {formatCents(item.patientResponsibilityCents)}
        </span>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={cn('text-caption font-semibold', status.class)}>
          {status.label}
        </Badge>
      </TableCell>
    </TableRow>
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
  icon: typeof Wallet;
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
