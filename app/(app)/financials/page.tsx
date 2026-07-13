'use client';

import {
  TrendingUp,
  Percent,
  Clock,
  DollarSign,
  BarChart3,
  AlertCircle,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  revenueByPayer,
  orgFinancialMetrics,
} from '@/lib/mockData';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/* ------------------------------------------------------------------ */
/*  Org financial dashboard                                            */
/* ------------------------------------------------------------------ */

export default function FinancialsPage() {
  const maxRevenue = Math.max(...revenueByPayer.map((r) => r.amountCents), 1);
  const totalRevenue = revenueByPayer.reduce((sum, r) => sum + r.amountCents, 0);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Financial Dashboard</h1>
        <p className="text-body text-text-secondary">
          {orgFinancialMetrics.periodLabel}
        </p>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={DollarSign}
          label="Total revenue"
          value={formatCents(orgFinancialMetrics.totalRevenueCents)}
          subtitle="Collected this period"
          tone="success"
        />
        <StatCard
          icon={Percent}
          label="Denial rate"
          value={`${orgFinancialMetrics.denialRate.toFixed(1)}%`}
          subtitle={`${orgFinancialMetrics.deniedClaims} of ${orgFinancialMetrics.totalClaims} claims denied`}
          tone="danger"
        />
        <StatCard
          icon={Clock}
          label="Avg claim turnaround"
          value={`${orgFinancialMetrics.avgTurnaroundDays} days`}
          subtitle="Submit to resolution"
          tone="info"
        />
        <StatCard
          icon={TrendingUp}
          label="Claims paid"
          value={`${orgFinancialMetrics.paidClaims}/${orgFinancialMetrics.totalClaims}`}
          subtitle="Resolved successfully"
          tone="success"
        />
      </div>

      {/* Revenue by payer bar chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <BarChart3 className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Revenue by payer
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Total collected: {formatCents(totalRevenue)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {revenueByPayer.map((payer) => {
            const widthPct = (payer.amountCents / maxRevenue) * 100;
            const hasRevenue = payer.amountCents > 0;
            return (
              <div key={payer.payerName} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-medium text-text-primary">
                      {payer.payerName}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-border bg-surface-sunken text-caption text-text-muted"
                    >
                      {payer.claimCount} claim{payer.claimCount !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <span
                    className={cn(
                      'text-body-sm font-medium',
                      hasRevenue ? 'text-text-primary' : 'text-text-muted'
                    )}
                  >
                    {formatCents(payer.amountCents)}
                  </span>
                </div>
                <div className="h-7 w-full overflow-hidden rounded-md bg-surface-sunken">
                  <div
                    className={cn(
                      'flex h-full items-center rounded-md transition-all duration-500',
                      hasRevenue
                        ? 'bg-brand-primary'
                        : 'bg-border'
                    )}
                    style={{ width: `${Math.max(widthPct, 2)}%` }}
                  >
                    {hasRevenue && widthPct > 15 && (
                      <span className="px-2 text-caption font-medium text-brand-primary-foreground">
                        {formatCents(payer.amountCents)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Denial detail */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <AlertCircle className="h-5 w-5 text-danger" aria-hidden="true" />
            Denial breakdown
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Claims denied this period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              'flex items-start gap-3 rounded-md border border-danger/30',
              'bg-danger/5 p-4'
            )}
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-body-sm font-semibold text-danger">
                1 denied claim — Maria Sato (Blue Shield of California)
              </p>
              <p className="text-body-sm text-text-secondary">
                CO-97: The benefit for this service is included in the payment for
                another service. CPT 90834 bundled into E/M code 99213 billed on
                same date of service.
              </p>
              <p className="text-caption text-text-muted">
                Action required: Appeal or rebill with modifier to unbundle the service.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card                                                           */
/* ------------------------------------------------------------------ */

type Tone = 'info' | 'success' | 'warning' | 'danger';

const toneMap: Record<Tone, { bg: string; text: string; border: string }> = {
  info: { bg: 'bg-info/12', text: 'text-info', border: 'border-info/30' },
  success: { bg: 'bg-success/12', text: 'text-success', border: 'border-success/30' },
  warning: { bg: 'bg-warning/15', text: 'text-warning', border: 'border-warning/40' },
  danger: { bg: 'bg-danger/12', text: 'text-danger', border: 'border-danger/30' },
};

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  tone,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  subtitle: string;
  tone: Tone;
}) {
  const t = toneMap[tone];
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-md',
              t.bg
            )}
          >
            <Icon className={cn('h-5 w-5', t.text)} aria-hidden="true" />
          </div>
          <div>
            <p className="text-caption text-text-muted">{label}</p>
            <p className="text-h2 font-bold text-text-primary">{value}</p>
          </div>
        </div>
        <p className="mt-2 text-caption text-text-muted">{subtitle}</p>
      </CardContent>
    </Card>
  );
}
