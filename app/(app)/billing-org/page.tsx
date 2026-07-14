'use client';

import * as React from 'react';
import { CreditCard, Download, CircleCheck as CheckCircle2, Clock, Calendar, Users, DollarSign, Receipt } from 'lucide-react';

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
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BillingPlan {
  orgId: string;
  planName: string;
  seatsIncluded: number;
  seatsUsed: number;
  seatPriceCents: number;
  billingCycle: string;
  autoPayEnabled: boolean;
  paymentMethod: string;
  nextInvoiceDate: string;
  nextInvoiceAmountCents: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

interface Invoice {
  id: string;
  orgId: string;
  invoiceNumber: string;
  period: string;
  amountCents: number;
  status: string;
  issuedDate: string;
  paidDate?: string;
  dueDate?: string;
  plan: string;
  seats: number;
  seatPriceCents: number;
  prorationCents: number;
  taxCents: number;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function BillingOrgPage() {
  const { organization } = useRole();

  const orgPlan = mockData.billingPlan as unknown as BillingPlan;
  const invoices = (mockData.billingInvoices as Invoice[]).filter(
    (i) => i.orgId === organization.id
  );

  const seatUsagePct = orgPlan
    ? Math.round((orgPlan.seatsUsed / orgPlan.seatsIncluded) * 100)
    : 0;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
          <CreditCard className="h-6 w-6 text-brand-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Organization Billing</h1>
          <p className="text-body text-text-secondary">
            Subscription plan, invoices, and payment methods for {organization.shortName}
          </p>
        </div>
      </div>

      {/* Plan summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Current plan */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Receipt className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                Current Plan
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">
              {orgPlan?.planName ?? 'Professional'}
            </p>
            <p className="text-body-sm text-text-secondary">
              {orgPlan?.billingCycle ?? 'monthly'} billing
            </p>
          </CardContent>
        </Card>

        {/* Seats */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                Seats
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">
              {orgPlan?.seatsUsed ?? 0}
              <span className="text-body-sm font-normal text-text-muted">
                {' '}/ {orgPlan?.seatsIncluded ?? 0}
              </span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
              <div
                className="h-full rounded-full bg-brand-primary transition-all"
                style={{ width: `${seatUsagePct}%` }}
              />
            </div>
            <p className="mt-1 text-caption text-text-muted">{seatUsagePct}% used</p>
          </CardContent>
        </Card>

        {/* Next invoice */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                Next Invoice
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">
              {orgPlan ? formatCurrency(orgPlan.nextInvoiceAmountCents) : '—'}
            </p>
            <p className="text-body-sm text-text-secondary">
              {orgPlan?.nextInvoiceDate ?? '—'}
            </p>
          </CardContent>
        </Card>

        {/* Payment method */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                Payment
              </span>
            </div>
            <p className="text-body-sm font-semibold text-text-primary">
              {orgPlan?.paymentMethod ?? '—'}
            </p>
            <div className="mt-1 flex items-center gap-1">
              {orgPlan?.autoPayEnabled ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
                  <span className="text-caption text-success">Auto-pay enabled</span>
                </>
              ) : (
                <span className="text-caption text-text-muted">Auto-pay off</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current period */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 text-text-primary">Current Billing Period</CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {orgPlan?.currentPeriodStart} to {orgPlan?.currentPeriodEnd}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatRow label="Plan" value={orgPlan?.planName ?? '—'} />
            <StatRow label="Seats used" value={`${orgPlan?.seatsUsed ?? 0} of ${orgPlan?.seatsIncluded ?? 0}`} />
            <StatRow label="Seat price" value={orgPlan ? formatCurrency(orgPlan.seatPriceCents) + '/seat' : '—'} />
            <StatRow label="Billing cycle" value={orgPlan?.billingCycle ?? '—'} />
          </div>
        </CardContent>
      </Card>

      {/* Invoice history */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 text-text-primary">Invoice History</CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Download past invoices for accounting
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((inv) => (
                <TableRow key={inv.id}>
                  <TableCell>
                    <span className="text-body-sm font-medium text-text-primary">
                      {inv.invoiceNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-caption text-text-muted">{inv.period}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm text-text-secondary">{inv.plan}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm text-text-secondary">{inv.seats}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm font-medium text-text-primary">
                      {formatCurrency(inv.amountCents)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-caption text-text-muted">{inv.issuedDate}</span>
                  </TableCell>
                  <TableCell>
                    {inv.status === 'paid' ? (
                      <Badge
                        variant="outline"
                        className="border-success/30 bg-success/10 text-caption font-semibold text-success"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Paid {inv.paidDate}
                      </Badge>
                    ) : inv.status === 'due' ? (
                      <Badge
                        variant="outline"
                        className="border-warning/40 bg-warning/10 text-caption font-semibold text-warning"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        Due {inv.dueDate}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-border bg-surface-sunken text-caption font-semibold text-text-muted"
                      >
                        {inv.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      className="inline-flex items-center gap-1 rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken hover:text-brand-primary"
                      title={`Download ${inv.invoiceNumber}`}
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
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-0.5 text-caption font-medium uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p className="text-body-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}
