'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Moon, Building2, CreditCard, Signature as FileSignature, UserPlus, Check, ChevronLeft, ChevronRight, ShieldCheck, Lock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { plans, salesLeads, getLead } from '@/lib/mockData';
import { useRole } from '@/lib/role-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

/* ------------------------------------------------------------------ */
/*  Step model                                                         */
/* ------------------------------------------------------------------ */

const STEPS = [
  { id: 1, label: 'Business Info', icon: Building2 },
  { id: 2, label: 'Plan', icon: CreditCard },
  { id: 3, label: 'Sign BAA', icon: FileSignature },
  { id: 4, label: 'Admin Account', icon: UserPlus },
] as const;

type StepId = (typeof STEPS)[number]['id'];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function OnboardingPage() {
  const router = useRouter();
  const { setRole, setOrganization } = useRole();
  const [step, setStep] = React.useState<StepId>(1);

  const [orgForm, setOrgForm] = React.useState({
    name: '',
    taxId: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  });
  const [selectedPlan, setSelectedPlan] = React.useState<string>('professional');
  const [baaSigned, setBaaSigned] = React.useState(false);
  const [adminForm, setAdminForm] = React.useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  // Pre-fill from a converted sales lead (internal admin "Convert to Organization" flow)
  const searchParams = useSearchParams();
  React.useEffect(() => {
    const leadId = searchParams.get('lead');
    if (!leadId) return;
    const lead = getLead(leadId);
    if (!lead) return;
    setOrgForm((f) => ({ ...f, name: lead.organizationName }));
    setAdminForm((f) => ({ ...f, name: lead.contactName, email: lead.contactEmail }));
  }, [searchParams]);

  const goTo = (id: StepId) => setStep(id);
  const next = () => setStep((s) => (s < 4 ? ((s + 1) as StepId) : s));
  const back = () => setStep((s) => (s > 1 ? ((s - 1) as StepId) : s));

  const complete = () => {
    const leadId = searchParams.get('lead');
    if (leadId) {
      const lead = getLead(leadId);
      if (lead) lead.status = 'Converted';
    }
    setRole('org-owner');
    setOrganization('org-harborline');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-sunken">
      {/* Top bar (standalone — no app shell) */}
      <header className="flex h-16 items-center gap-2.5 border-b border-border bg-surface px-4 md:px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-primary text-brand-primary-foreground">
          <Moon className="h-4 w-4" aria-hidden="true" />
        </div>
        <span className="text-h4 font-semibold text-text-primary">Moonaria</span>
        <span className="text-caption text-text-muted">Onboarding</span>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 md:px-6">
        {/* Stepper */}
        <Stepper currentStep={step} />

        <div className="mt-8">
          {step === 1 && (
            <BusinessInfoStep
              form={orgForm}
              setForm={setOrgForm}
              onNext={() => goTo(2)}
            />
          )}
          {step === 2 && (
            <PlanStep
              selected={selectedPlan}
              setSelected={setSelectedPlan}
              onBack={() => goTo(1)}
              onNext={() => goTo(3)}
            />
          )}
          {step === 3 && (
            <BaaStep
              signed={baaSigned}
              setSigned={setBaaSigned}
              onBack={() => goTo(2)}
              onNext={() => goTo(4)}
            />
          )}
          {step === 4 && (
            <AdminStep
              form={adminForm}
              setForm={setAdminForm}
              onBack={() => goTo(3)}
              onComplete={complete}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stepper                                                            */
/* ------------------------------------------------------------------ */

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((s, idx) => {
        const done = currentStep > s.id;
        const active = currentStep === s.id;
        const Icon = s.icon;
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2">
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors',
                done && 'border-success bg-success text-success-foreground',
                active && 'border-brand-primary bg-brand-primary text-brand-primary-foreground',
                !done && !active && 'border-border bg-surface text-text-muted'
              )}
            >
              {done ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Icon className="h-4 w-4" aria-hidden="true" />
              )}
            </div>
            <span
              className={cn(
                'hidden text-body-sm font-medium sm:inline',
                active ? 'text-text-primary' : 'text-text-muted'
              )}
            >
              {s.label}
            </span>
            {idx < STEPS.length - 1 && (
              <div
                className={cn(
                  'mx-1 h-px flex-1',
                  done ? 'bg-success' : 'bg-border'
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1 — Business info                                             */
/* ------------------------------------------------------------------ */

function BusinessInfoStep({
  form,
  setForm,
  onNext,
}: {
  form: {
    name: string;
    taxId: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      taxId: string;
      address1: string;
      address2: string;
      city: string;
      state: string;
      zip: string;
    }>
  >;
  onNext: () => void;
}) {
  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.name.trim() && form.taxId.trim() && form.address1.trim();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3 text-text-primary">Legal business information</CardTitle>
        <CardDescription className="text-body-sm text-text-muted">
          This is the legal entity that will appear on claims and the BAA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Organization name" required>
            <Input
              value={form.name}
              onChange={update('name')}
              placeholder="Harborline Behavioral Health LLC"
            />
          </Field>
          <Field label="Tax ID (EIN)" required>
            <Input
              value={form.taxId}
              onChange={update('taxId')}
              placeholder="12-3456789"
            />
          </Field>
        </div>
        <Field label="Street address" required>
          <Input
            value={form.address1}
            onChange={update('address1')}
            placeholder="1234 Riverside Pkwy"
          />
        </Field>
        <Field label="Suite / unit">
          <Input
            value={form.address2}
            onChange={update('address2')}
            placeholder="Suite 200"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="City">
            <Input value={form.city} onChange={update('city')} placeholder="Portland" />
          </Field>
          <Field label="State">
            <Input value={form.state} onChange={update('state')} placeholder="OR" />
          </Field>
          <Field label="ZIP">
            <Input value={form.zip} onChange={update('zip')} placeholder="97201" />
          </Field>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={onNext} disabled={!valid} className="gap-1.5">
            Continue
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2 — Plan selection                                            */
/* ------------------------------------------------------------------ */

function PlanStep({
  selected,
  setSelected,
  onBack,
  onNext,
}: {
  selected: string;
  setSelected: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 font-semibold text-text-primary">Choose your plan</h2>
        <p className="text-body-sm text-text-muted">
          You can change or cancel at any time during the trial.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan) => {
          const active = selected === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => setSelected(plan.id)}
              className={cn(
                'flex flex-col rounded-lg border bg-surface p-5 text-left transition-all',
                active
                  ? 'border-brand-primary ring-2 ring-brand-primary/30'
                  : 'border-border hover:border-border-strong'
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-h4 font-semibold text-text-primary">
                  {plan.name}
                </span>
                {plan.highlighted && (
                  <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-caption font-semibold text-brand-primary">
                    Popular
                  </span>
                )}
              </div>
              <p className="mt-1 text-caption text-text-muted">{plan.tagline}</p>
              <p className="mt-3 text-h2 font-bold text-text-primary">
                {plan.pricePerMonth > 0 ? `$${plan.pricePerMonth}` : 'Custom'}
                {plan.pricePerMonth > 0 && (
                  <span className="text-body-sm font-normal text-text-muted">/mo</span>
                )}
              </p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-body-sm text-text-secondary">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-success"
                      aria-hidden="true"
                    />
                    {f}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        <Button onClick={onNext} className="gap-1.5">
          Continue
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3 — BAA e-signature                                           */
/* ------------------------------------------------------------------ */

function BaaStep({
  signed,
  setSigned,
  onBack,
  onNext,
}: {
  signed: boolean;
  setSigned: (v: boolean) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-h2 font-semibold text-text-primary">
          Business Associate Agreement
        </h2>
        <p className="text-body-sm text-text-muted">
          HIPAA requires a BAA between you and Moonaria before any PHI is handled.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2 text-body-sm text-text-secondary">
            <ShieldCheck className="h-4 w-4 text-brand-primary" aria-hidden="true" />
            Moonaria BAA — Rev. 2026.04
          </div>
          <div className="max-h-72 overflow-y-auto rounded-md border border-border bg-surface-sunken p-4 text-body-sm leading-relaxed text-text-secondary">
            <p className="mb-3 font-semibold text-text-primary">
              BUSINESS ASSOCIATE AGREEMENT
            </p>
            <p className="mb-3">
              This Business Associate Agreement ("BAA") is entered into between the
              Covered Entity ("CE") and Moonaria Health, Inc. ("BA") as of the date
              of electronic signature below. This Agreement is executed in
              accordance with the Health Insurance Portability and Accountability
              Act of 1996 ("HIPAA") and its implementing regulations at 45 CFR
              Parts 160 and 164.
            </p>
            <p className="mb-3">
              1. <strong>Definitions.</strong> Capitalized terms used but not
              defined herein shall have the same meaning as given to them in
              HIPAA. "Protected Health Information" or "PHI" has the meaning set
              forth in 45 CFR §160.103.
            </p>
            <p className="mb-3">
              2. <strong>Obligations of BA.</strong> BA agrees to (a) not use or
              disclose PHI other than as permitted or required by this Agreement
              or as Required by Law; (b) use appropriate safeguards to prevent use
              or disclosure of PHI other than as provided for by this Agreement;
              (c) report to CE any use or disclosure of PHI not provided for by
              this Agreement of which BA becomes aware.
            </p>
            <p className="mb-3">
              3. <strong>Term and Termination.</strong> This Agreement shall
              terminate upon the earlier of (a) termination of the Services
              Agreement or (b) CE's written notice. Upon termination, BA shall
              return or destroy all PHI received from CE.
            </p>
            <p className="text-text-muted">
              [This is a mock document for prototype demonstration purposes only
              and is not a legally binding agreement.]
            </p>
          </div>

          <label
            className={cn(
              'mt-4 flex cursor-pointer items-start gap-3 rounded-md border border-border',
              'bg-surface p-3 transition-colors hover:bg-surface-sunken'
            )}
          >
            <Checkbox
              checked={signed}
              onCheckedChange={(v) => setSigned(v === true)}
              className="mt-0.5"
            />
            <span className="text-body-sm text-text-secondary">
              I have read the Business Associate Agreement and, by checking this
              box and clicking <strong>Sign &amp; Continue</strong>, I am
              electronically signing it on behalf of the organization.
            </span>
          </label>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-1.5">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!signed} className="gap-1.5">
          <FileSignature className="h-4 w-4" aria-hidden="true" />
          Sign &amp; Continue
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 4 — Admin account                                             */
/* ------------------------------------------------------------------ */

function AdminStep({
  form,
  setForm,
  onBack,
  onComplete,
}: {
  form: { name: string; email: string; password: string; confirm: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ name: string; email: string; password: string; confirm: string }>
  >;
  onBack: () => void;
  onComplete: () => void;
}) {
  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const passwordsMatch = form.password.length > 0 && form.password === form.confirm;
  const valid = form.name.trim() && form.email.trim() && passwordsMatch;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-h3 text-text-primary">Create your admin account</CardTitle>
        <CardDescription className="text-body-sm text-text-muted">
          This will be the first Org Owner / Admin for your organization.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label="Full name" required>
          <Input value={form.name} onChange={update('name')} placeholder="Dana Whitlock" />
        </Field>
        <Field label="Work email" required>
          <Input
            type="email"
            value={form.email}
            onChange={update('email')}
            placeholder="dana@harborline.org"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" required>
            <Input
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
            />
          </Field>
          <Field label="Confirm password" required>
            <Input
              type="password"
              value={form.confirm}
              onChange={update('confirm')}
              placeholder="••••••••"
            />
          </Field>
        </div>
        {form.confirm.length > 0 && !passwordsMatch && (
          <p className="text-caption text-danger">Passwords do not match.</p>
        )}
        <div className="flex items-center gap-2 rounded-md bg-info/10 p-3 text-caption text-info">
          <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
          Your password is stored locally for this prototype only — no real
          authentication is performed.
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button variant="ghost" onClick={onBack} className="gap-1.5">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <Button onClick={onComplete} disabled={!valid} className="gap-1.5">
            Complete setup
            <Check className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Field helper                                                       */
/* ------------------------------------------------------------------ */

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-body-sm text-text-primary">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </Label>
      {children}
    </div>
  );
}
