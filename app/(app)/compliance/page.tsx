'use client';

import * as React from 'react';
import { ShieldCheck, GraduationCap, FileCheck2, TriangleAlert as AlertTriangle, Download, CircleCheck as CheckCircle2, CircleAlert as AlertCircle, Clock, FileText, CalendarClock } from 'lucide-react';

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

interface ComplianceRecord {
  orgId: string;
  hipaaTraining: {
    totalStaff: number;
    completedStaff: number;
    dueDate: string;
    lastUpdated: string;
  };
  baaAgreements: {
    id: string;
    vendorName: string;
    status: string;
    signedDate: string;
    expiryDate: string;
    fileName: string;
  }[];
  auditLogs: {
    retentionPeriod: string;
    status: string;
    lastReviewDate: string;
  };
  incidents: {
    id: string;
    title: string;
    severity: string;
    status: string;
    reportedDate: string;
    resolvedDate?: string;
    description: string;
  }[];
  policies: {
    id: string;
    name: string;
    status: string;
    lastReviewed: string;
    nextReviewDue: string;
  }[];
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CompliancePage() {
  const { organization } = useRole();

  const records = (mockData.complianceRecords as ComplianceRecord[]);
  const record = records.find((r) => r.orgId === organization.id) ?? records[0];

  if (!record) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-body text-text-muted">No compliance data available.</p>
      </div>
    );
  }

  const hipaaPct = Math.round(
    (record.hipaaTraining.completedStaff / record.hipaaTraining.totalStaff) * 100
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
          <ShieldCheck className="h-6 w-6 text-brand-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Compliance</h1>
          <p className="text-body text-text-secondary">
            HIPAA training, BAAs, audit logs, and incident tracking for {organization.shortName}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* HIPAA Training */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                HIPAA Training
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">
              {record.hipaaTraining.completedStaff}
              <span className="text-body-sm font-normal text-text-muted">
                {' '}/ {record.hipaaTraining.totalStaff}
              </span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken">
              <div
                className={cn(
                  'h-full rounded-full transition-all',
                  hipaaPct >= 90 ? 'bg-success' : 'bg-warning'
                )}
                style={{ width: `${hipaaPct}%` }}
              />
            </div>
            <p className="mt-1 text-caption text-text-muted">
              {hipaaPct}% complete · due {record.hipaaTraining.dueDate}
            </p>
          </CardContent>
        </Card>

        {/* BAAs */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                BAAs on File
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">
              {record.baaAgreements.length}
            </p>
            <p className="text-body-sm text-text-secondary">
              {record.baaAgreements.filter((b) => b.status === 'active').length} active
            </p>
            {record.baaAgreements.some((b) => b.status === 'expiring') && (
              <p className="mt-1 text-caption text-warning">
                {record.baaAgreements.filter((b) => b.status === 'expiring').length} expiring soon
              </p>
            )}
          </CardContent>
        </Card>

        {/* Audit logs */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                Audit Log
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">
              {record.auditLogs.retentionPeriod}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              <span className="text-caption text-success">{record.auditLogs.status}</span>
            </div>
            <p className="mt-0.5 text-caption text-text-muted">
              Last reviewed {record.auditLogs.lastReviewDate}
            </p>
          </CardContent>
        </Card>

        {/* Incidents */}
        <Card>
          <CardContent className="p-4">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-brand-primary" aria-hidden="true" />
              <span className="text-caption font-medium uppercase tracking-wide text-text-muted">
                Incidents (30d)
              </span>
            </div>
            <p className="text-h3 font-semibold text-text-primary">
              {record.incidents.length}
            </p>
            <p className="text-body-sm text-text-secondary">
              {record.incidents.filter((i) => i.status === 'resolved').length} resolved
            </p>
            <p className="mt-0.5 text-caption text-text-muted">
              {record.incidents.filter((i) => i.status === 'open').length} open
            </p>
          </CardContent>
        </Card>
      </div>

      {/* BAA Agreements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <FileCheck2 className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Business Associate Agreements
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Signed BAAs with vendors that handle PHI
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Signed</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Document</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {record.baaAgreements.map((baa) => (
                <TableRow key={baa.id}>
                  <TableCell>
                    <span className="text-body-sm font-medium text-text-primary">
                      {baa.vendorName}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-caption text-text-muted">{baa.signedDate}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-caption text-text-muted">{baa.expiryDate}</span>
                  </TableCell>
                  <TableCell>
                    {baa.status === 'active' ? (
                      <Badge
                        variant="outline"
                        className="border-success/30 bg-success/10 text-caption font-semibold text-success"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : baa.status === 'expiring' ? (
                      <Badge
                        variant="outline"
                        className="border-warning/40 bg-warning/10 text-caption font-semibold text-warning"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        Expiring
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-danger/30 bg-danger/10 text-caption font-semibold text-danger"
                      >
                        <AlertCircle className="mr-1 h-3 w-3" />
                        Expired
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <button
                      className="inline-flex items-center gap-1 rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken hover:text-brand-primary"
                      title={`Download ${baa.fileName}`}
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

      {/* Policies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-h4 text-text-primary">Compliance Policies</CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Internal policies and their review status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy</TableHead>
                <TableHead>Last Reviewed</TableHead>
                <TableHead>Next Review Due</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {record.policies.map((pol) => (
                <TableRow key={pol.id}>
                  <TableCell>
                    <span className="text-body-sm font-medium text-text-primary">
                      {pol.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-caption text-text-muted">{pol.lastReviewed}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-caption text-text-muted">{pol.nextReviewDue}</span>
                  </TableCell>
                  <TableCell>
                    {pol.status === 'active' ? (
                      <Badge
                        variant="outline"
                        className="border-success/30 bg-success/10 text-caption font-semibold text-success"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Active
                      </Badge>
                    ) : pol.status === 'review-due' ? (
                      <Badge
                        variant="outline"
                        className="border-warning/40 bg-warning/10 text-caption font-semibold text-warning"
                      >
                        <CalendarClock className="mr-1 h-3 w-3" />
                        Review Due
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-border bg-surface-sunken text-caption font-semibold text-text-muted"
                      >
                        {pol.status}
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Incidents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <AlertTriangle className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Incident Reports
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Security and privacy incidents — all resolved within SLA
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {record.incidents.length === 0 ? (
            <div className="px-6 py-8 text-center">
              <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success" aria-hidden="true" />
              <p className="text-body-sm text-text-muted">
                No incidents reported in the last 30 days.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Incident</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Reported</TableHead>
                  <TableHead>Resolved</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {record.incidents.map((inc) => (
                  <TableRow key={inc.id}>
                    <TableCell>
                      <div>
                        <span className="text-body-sm font-medium text-text-primary">
                          {inc.title}
                        </span>
                        <p className="text-caption text-text-muted">{inc.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-caption font-semibold',
                          inc.severity === 'low'
                            ? 'border-info/30 bg-info/10 text-info'
                            : inc.severity === 'medium'
                              ? 'border-warning/40 bg-warning/10 text-warning'
                              : 'border-danger/30 bg-danger/10 text-danger'
                        )}
                      >
                        {inc.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-caption text-text-muted">{inc.reportedDate}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-caption text-text-muted">
                        {inc.resolvedDate ?? '—'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="border-success/30 bg-success/10 text-caption font-semibold text-success"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Resolved
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
