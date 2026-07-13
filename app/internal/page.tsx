'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Building2, Mail, Phone, Users, Calendar, ArrowLeft, CircleCheck as CheckCircle2, ArrowRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { salesLeads, type SalesLead, type LeadStatus } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const statusTone: Record<LeadStatus, string> = {
  New: 'bg-info/10 text-info border-info/30',
  Contacted: 'bg-warning/10 text-warning-foreground border-warning/30',
  Converted: 'bg-success/10 text-success border-success/30',
};

export default function InternalLeadsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedId, setSelectedId] = React.useState<string | null>(
    searchParams.get('lead') ?? null
  );

  const selected = selectedId ? salesLeads.find((l) => l.id === selectedId) : null;

  const handleConvert = (lead: SalesLead) => {
    setSelectedId(null);
    router.push(`/onboarding?lead=${lead.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <h1 className="text-h2 font-semibold text-text-primary">Leads Inbox</h1>
        <p className="text-body-sm text-text-muted">Contact Sales submissions from the public site.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-sunken">
                  <th className="h-10 px-4 text-left text-caption font-medium text-text-muted">Organization</th>
                  <th className="h-10 px-4 text-left text-caption font-medium text-text-muted">Contact</th>
                  <th className="h-10 px-4 text-left text-caption font-medium text-text-muted">Providers</th>
                  <th className="h-10 px-4 text-left text-caption font-medium text-text-muted">Submitted</th>
                  <th className="h-10 px-4 text-left text-caption font-medium text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {salesLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedId(lead.id)}
                    className={cn(
                      'cursor-pointer border-b border-border transition-colors hover:bg-surface-sunken',
                      selectedId === lead.id && 'bg-accent/40'
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <p className="text-body-sm font-medium text-text-primary">{lead.organizationName}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="text-body-sm text-text-primary">{lead.contactName}</p>
                      <p className="text-caption text-text-muted">{lead.contactEmail}</p>
                    </td>
                    <td className="px-4 py-2.5 text-body-sm text-text-secondary">{lead.providerCount}</td>
                    <td className="px-4 py-2.5 text-body-sm text-text-muted">
                      {new Date(lead.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-caption font-medium', statusTone[lead.status])}>
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {salesLeads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-body-sm text-text-muted">
                      No leads yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail panel */}
      {selected && (
        <LeadDetailPanel
          lead={selected}
          onClose={() => setSelectedId(null)}
          onMarkContacted={() => {
            selected.status = 'Contacted';
            setSelectedId(null);
          }}
          onConvert={() => handleConvert(selected)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Lead detail panel                                                   */
/* ------------------------------------------------------------------ */

function LeadDetailPanel({
  lead,
  onClose,
  onMarkContacted,
  onConvert,
}: {
  lead: SalesLead;
  onClose: () => void;
  onMarkContacted: () => void;
  onConvert: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black/20 p-4 md:items-center md:justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-h4 text-text-primary">Lead Details</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-h4 font-semibold text-text-primary">{lead.organizationName}</h3>
            <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-caption font-medium', statusTone[lead.status])}>
              {lead.status}
            </span>
          </div>

          <div className="grid gap-2.5">
            <DetailRow icon={Users} label="Contact" value={lead.contactName} />
            <DetailRow icon={Mail} label="Email" value={lead.contactEmail} />
            <DetailRow icon={Phone} label="Phone" value={lead.contactPhone} />
            <DetailRow icon={Building2} label="Providers" value={lead.providerCount} />
            <DetailRow icon={Calendar} label="Submitted" value={new Date(lead.submittedAt).toLocaleString('en-US')} />
            {lead.currentSystem && (
              <DetailRow icon={Building2} label="Current system" value={lead.currentSystem} />
            )}
            {lead.message && (
              <div className="rounded-md border border-border bg-surface-sunken p-3">
                <p className="text-caption text-text-muted">Message</p>
                <p className="mt-1 text-body-sm text-text-secondary">{lead.message}</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              className="gap-1.5"
              onClick={onMarkContacted}
              disabled={lead.status !== 'New'}
            >
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Mark as Contacted
            </Button>
            <Button
              className="gap-1.5"
              onClick={onConvert}
              disabled={lead.status === 'Converted'}
            >
              Convert to Organization
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
      <span className="text-caption text-text-muted w-24">{label}</span>
      <span className="text-body-sm text-text-primary">{value}</span>
    </div>
  );
}
