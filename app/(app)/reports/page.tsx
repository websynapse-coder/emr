'use client';

import * as React from 'react';
import { ChartBar as BarChart3, FileText, Download, Play, Calendar, Clock, TrendingUp, DollarSign, Activity, Stethoscope, Users } from 'lucide-react';

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

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  schedule: string;
  lastRunDate: string;
  nextRunDate: string | null;
  format: string;
  status: string;
}

/* ------------------------------------------------------------------ */
/*  Category icons                                                     */
/* ------------------------------------------------------------------ */

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Operational: Activity,
  Financial: DollarSign,
  Clinical: Stethoscope,
};

const CATEGORY_COLORS: Record<string, string> = {
  Operational: 'border-info/30 bg-info/10 text-info',
  Financial: 'border-success/30 bg-success/10 text-success',
  Clinical: 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary',
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ReportsPage() {
  const { organization } = useRole();

  const reports = (mockData.reportTemplates as ReportTemplate[]);

  const scheduledCount = reports.filter((r) => r.status === 'scheduled').length;
  const onDemandCount = reports.filter((r) => r.status === 'available').length;

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
          <BarChart3 className="h-6 w-6 text-brand-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Reports</h1>
          <p className="text-body text-text-secondary">
            Generate, schedule, and export operational, financial, and clinical reports for {organization.shortName}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                Scheduled
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">{scheduledCount}</p>
            <p className="text-body-sm text-text-secondary">recurring reports</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                On-Demand
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">{onDemandCount}</p>
            <p className="text-body-sm text-text-secondary">available to run now</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                Total Templates
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">{reports.length}</p>
            <p className="text-body-sm text-text-secondary">report templates</p>
          </CardContent>
        </Card>
      </div>

      {/* Report templates table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 text-text-primary">Report Library</CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Pre-built report templates — run on-demand or view scheduled runs
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Format</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((rpt) => {
                const CatIcon = CATEGORY_ICONS[rpt.category] ?? FileText;
                return (
                  <TableRow key={rpt.id}>
                    <TableCell>
                      <div className="flex items-start gap-2.5">
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                            CATEGORY_COLORS[rpt.category] ?? 'border-border bg-surface-sunken text-text-muted'
                          )}
                        >
                          <CatIcon className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="text-body-sm font-medium text-text-primary">
                            {rpt.name}
                          </span>
                          <p className="text-caption text-text-muted">{rpt.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-caption font-semibold',
                          CATEGORY_COLORS[rpt.category] ?? 'border-border bg-surface-sunken text-text-muted'
                        )}
                      >
                        {rpt.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-body-sm text-text-secondary capitalize">
                        {rpt.schedule}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-caption text-text-muted">{rpt.lastRunDate}</span>
                    </TableCell>
                    <TableCell>
                      {rpt.nextRunDate ? (
                        <span className="text-caption text-text-muted">{rpt.nextRunDate}</span>
                      ) : (
                        <span className="text-caption text-text-muted">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-border bg-surface-sunken text-caption font-semibold text-text-secondary"
                      >
                        {rpt.format}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          className="inline-flex items-center gap-1 rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken hover:text-brand-primary"
                          title="Run now"
                        >
                          <Play className="h-4 w-4" aria-hidden="true" />
                        </button>
                        <button
                          className="inline-flex items-center gap-1 rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken hover:text-brand-primary"
                          title="Download last run"
                        >
                          <Download className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Category breakdown */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(['Operational', 'Financial', 'Clinical'] as const).map((cat) => {
          const catReports = reports.filter((r) => r.category === cat);
          const CatIcon = CATEGORY_ICONS[cat] ?? FileText;
          return (
            <Card key={cat}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-md',
                      CATEGORY_COLORS[cat]
                    )}
                  >
                    <CatIcon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span className="text-body-sm font-semibold text-text-primary">{cat}</span>
                </div>
                <ul className="space-y-1">
                  {catReports.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between text-caption text-text-muted"
                    >
                      <span className="truncate">{r.name}</span>
                      <span className="shrink-0 capitalize">{r.schedule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
