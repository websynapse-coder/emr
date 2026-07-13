'use client';

import * as React from 'react';
import { Moon, CalendarClock, Video, FileText, ShieldCheck, Receipt, Users, ArrowRight, X, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { salesLeads, type SalesLead } from '@/lib/mockData';

const features = [
  {
    icon: CalendarClock,
    title: 'Unified Scheduling',
    description: 'Book telehealth and in-person sessions on one calendar with conflict detection and room management.',
  },
  {
    icon: Video,
    title: 'Session Recording & Consent',
    description: 'Per-participant consent capture built for individual, couple, and family therapy sessions.',
  },
  {
    icon: FileText,
    title: 'AI-Assisted Documentation',
    description: 'Auto-generated transcripts and SOAP notes, reviewed and signed by the provider before entering the chart.',
  },
  {
    icon: ShieldCheck,
    title: 'Credentialing-Aware Scheduling',
    description: 'Per-payer credentialing status tracking so scheduling reflects what a provider can actually bill.',
  },
  {
    icon: Receipt,
    title: 'Claims & Billing Engine',
    description: 'Charge generation, claim submission, and remittance tracking — from session to payment in one system.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Admin, provider, supervisor, biller, front desk, and patient portal — every function scoped to the right role.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [salesOpen, setSalesOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-primary text-brand-primary-foreground">
              <Moon className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="text-body font-semibold">Moonaria</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/login')}
              className="text-body-sm text-text-muted transition-colors hover:text-text-primary"
            >
              Log In
            </button>
            <Button size="sm" onClick={() => setSalesOpen(true)}>
              Contact Sales
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/40 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-caption text-text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            Built for behavioral health organizations
          </div>
          <h1 className="mt-5 text-h1 font-semibold tracking-tight text-text-primary md:text-[2.5rem]">
            The behavioral health EMR for
            <br className="hidden md:block" /> telehealth and in-person care
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-body text-text-secondary">
            AI-assisted documentation, credentialing-aware scheduling, and a full claims engine —
            in one platform built for organizations, not solo practices.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <Button size="lg" onClick={() => setSalesOpen(true)} className="gap-1.5">
              Contact Sales
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
          <p className="mt-3 text-caption text-text-muted">
            No credit card. No self-serve signup. We'll scope your needs together.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:px-6 md:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-h2 font-semibold text-text-primary">What Moonaria Does</h2>
          <p className="mt-1.5 text-body text-text-secondary">
            Everything a behavioral health organization needs, in one platform.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-lg border border-border bg-surface p-5 transition-colors hover:border-border-strong"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-body font-semibold text-text-primary">{f.title}</h3>
                <p className="mt-1 text-body-sm text-text-secondary leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA band */}
      <section className="border-t border-border bg-surface-sunken">
        <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16 text-center">
          <h2 className="text-h2 font-semibold text-text-primary">Ready to see Moonaria?</h2>
          <p className="mt-2 text-body text-text-secondary">
            Tell us about your organization and our team will reach out within one business day.
          </p>
          <Button size="lg" className="mt-5" onClick={() => setSalesOpen(true)}>
            Contact Sales
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand-primary text-brand-primary-foreground">
              <Moon className="h-3 w-3" aria-hidden="true" />
            </div>
            <span className="text-body-sm font-medium text-text-primary">Moonaria</span>
          </div>
          <p className="text-caption text-text-muted">Behavioral Health EMR — Prototype</p>
        </div>
      </footer>

      <ContactSalesDialog open={salesOpen} onOpenChange={setSalesOpen} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact Sales dialog                                               */
/* ------------------------------------------------------------------ */

function ContactSalesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({
    organizationName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    providerCount: '',
    currentSystem: '',
    message: '',
  });

  const reset = () => {
    setForm({
      organizationName: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      providerCount: '',
      currentSystem: '',
      message: '',
    });
    setSubmitted(false);
  };

  const valid =
    form.organizationName.trim() &&
    form.contactName.trim() &&
    form.contactEmail.trim() &&
    form.contactPhone.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const lead: SalesLead = {
      id: `lead-${String(salesLeads.length + 1).padStart(3, '0')}`,
      organizationName: form.organizationName,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
      providerCount: form.providerCount || '—',
      currentSystem: form.currentSystem || undefined,
      message: form.message || undefined,
      submittedAt: new Date().toISOString(),
      status: 'New',
    };
    salesLeads.push(lead);
    setSubmitted(true);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) setTimeout(reset, 200);
      }}
    >
      <DialogContent className="max-w-lg">
        {submitted ? (
          <div className="py-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <Check className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="mt-4 text-h4 font-semibold text-text-primary">Thanks — we'll be in touch</h3>
            <p className="mt-1.5 text-body-sm text-text-secondary">
              Our team will reach out within 1 business day.
            </p>
            <Button className="mt-5" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Contact Sales</DialogTitle>
              <DialogDescription>
                Tell us about your organization and we'll reach out within one business day.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-body-sm text-text-primary">
                    Organization name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    value={form.organizationName}
                    onChange={(e) => setForm((f) => ({ ...f, organizationName: e.target.value }))}
                    placeholder="Harborline Behavioral Health"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-body-sm text-text-primary">
                    Contact name <span className="text-danger">*</span>
                  </Label>
                  <Input
                    value={form.contactName}
                    onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))}
                    placeholder="Dana Whitlock"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-body-sm text-text-primary">
                    Contact email <span className="text-danger">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))}
                    placeholder="dana@harborline.org"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-body-sm text-text-primary">
                    Contact phone <span className="text-danger">*</span>
                  </Label>
                  <Input
                    value={form.contactPhone}
                    onChange={(e) => setForm((f) => ({ ...f, contactPhone: e.target.value }))}
                    placeholder="(503) 555-0100"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label className="text-body-sm text-text-primary">Approx. number of providers</Label>
                  <Input
                    value={form.providerCount}
                    onChange={(e) => setForm((f) => ({ ...f, providerCount: e.target.value }))}
                    placeholder="e.g. 12"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-body-sm text-text-primary">Current EMR / system (optional)</Label>
                  <Input
                    value={form.currentSystem}
                    onChange={(e) => setForm((f) => ({ ...f, currentSystem: e.target.value }))}
                    placeholder="e.g. SimplePractice"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-body-sm text-text-primary">Message / notes (optional)</Label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us about your needs..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!valid}>
                  Submit
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
