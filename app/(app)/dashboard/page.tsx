'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Activity,
  CalendarClock,
  Users,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Stethoscope,
  Receipt,
  ListTodo,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { useRole } from '@/lib/role-context';
import {
  ROLE_LABELS,
  orgStats,
  plans,
  users,
  type User,
} from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

/* ------------------------------------------------------------------ */
/*  Patient redirect                                                    */
/* ------------------------------------------------------------------ */

function PatientRedirect() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace('/portal');
  }, [router]);
  return (
    <div className="flex items-center justify-center py-12">
      <p className="text-body-sm text-text-muted">Redirecting to patient portal...</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard page (role-aware)                                        */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { role, roleLabel, user, organization } = useRole();

  // Patients go to the portal, not the org dashboard
  if (role === 'patient') {
    return <PatientRedirect />;
  }

  // Admin / org-owner gets the org dashboard; everyone else gets the
  // placeholder proving the theme + role switcher.
  if (role === 'org-owner' || role === 'practice-manager') {
    return <OrgDashboard />;
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div
        className={cn(
          'flex flex-col gap-2 rounded-lg border border-border',
          'bg-surface-raised p-5'
        )}
      >
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={cn(
              'border-brand-primary/30 bg-brand-primary/10',
              'text-caption font-semibold text-brand-primary'
            )}
          >
            {organization.shortName}
          </Badge>
          <Badge
            variant="outline"
            className={cn(
              'border-warning/40 bg-warning/10',
              'text-caption font-semibold text-warning'
            )}
          >
            Demo Mode
          </Badge>
        </div>
        <h1 className="text-display font-bold text-text-primary">
          Welcome back, {user?.name?.split(' ')[0] ?? 'there'}
        </h1>
        <p className="text-body text-text-secondary">
          You are viewing Moonaria as a{' '}
          <strong className="text-text-primary">{roleLabel}</strong>. This is a
          placeholder dashboard proving the theme system and role switcher — real
          screens arrive in the next steps.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={CalendarClock} label="Today's Appointments" value="14" trend="+2 vs. yesterday" tone="info" />
        <StatTile icon={Users} label="Active Patients" value="1,284" trend="+38 this month" tone="success" />
        <StatTile icon={FileText} label="Notes Pending" value="7" trend="Due by 5pm" tone="warning" />
        <StatTile icon={AlertCircle} label="Claims Needing Action" value="3" trend="2 denials" tone="danger" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Org dashboard (admin home)                                         */
/* ------------------------------------------------------------------ */

function OrgDashboard() {
  const { organization } = useRole();
  const plan = plans.find((p) => p.id === organization.plan);
  const teamMembers = users.filter((u) => u.orgId === organization.id && u.role !== 'patient');

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      {/* Page header */}
      <div
        className={cn(
          'flex flex-col gap-3 rounded-lg border border-border',
          'bg-surface-raised p-5'
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-display font-bold text-text-primary">
              {organization.name}
            </h1>
            <p className="text-body text-text-secondary">
              {organization.tagline}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/onboarding">
              <Button variant="outline" className="gap-1.5">
                <Plus className="h-4 w-4" aria-hidden="true" />
                New org
              </Button>
            </Link>
            <Link href="/team">
              <Button className="gap-1.5">
                Manage team
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Org summary + quick stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-h4 text-text-primary">Organization</CardTitle>
            <CardDescription className="text-body-sm text-text-muted">
              Summary of your subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <SummaryRow label="Legal name" value={organization.name} />
            <SummaryRow label="Plan" value={plan?.name ?? '—'} />
            <SummaryRow
              label="Monthly cost"
              value={plan && plan.pricePerMonth > 0 ? `$${plan.pricePerMonth}/mo` : 'Custom'}
            />
            <SummaryRow label="Providers" value={String(organization.providerCount)} />
            <SummaryRow label="Team members" value={String(teamMembers.length)} />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-2">
          <StatTile
            icon={Stethoscope}
            label="Active Providers"
            value={String(orgStats.activeProviders)}
            trend="2 pending invites"
            tone="success"
          />
          <StatTile
            icon={CalendarClock}
            label="Sessions This Month"
            value={String(orgStats.sessionsThisMonth)}
            trend="+12% vs. last month"
            tone="info"
          />
          <StatTile
            icon={Receipt}
            label="Claims Pending"
            value={String(orgStats.claimsPending)}
            trend="3 need attention"
            tone="warning"
          />
          <StatTile
            icon={ListTodo}
            label="Open Tasks"
            value={String(orgStats.openTasks)}
            trend="Due this week"
            tone="danger"
          />
        </div>
      </div>

      {/* Team preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-h3 text-text-primary">Team</CardTitle>
              <CardDescription className="text-body-sm text-text-muted">
                Recent team members in {organization.shortName}
              </CardDescription>
            </div>
            <Link href="/team">
              <Button variant="ghost" className="gap-1 text-brand-primary">
                View all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {teamMembers.slice(0, 6).map((m) => (
            <TeamRow key={m.id} member={m} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2 last:border-0 last:pb-0">
      <span className="text-body-sm text-text-muted">{label}</span>
      <span className="text-body-sm font-medium text-text-primary">{value}</span>
    </div>
  );
}

function TeamRow({ member }: { member: User }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border border-border',
        'bg-surface px-3 py-2.5'
      )}
    >
      <Avatar className="h-9 w-9">
        <AvatarFallback className="bg-brand-primary/15 text-caption font-semibold text-brand-primary">
          {member.initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-medium text-text-primary">
          {member.name}
        </p>
        <p className="truncate text-caption text-text-muted">{member.title}</p>
      </div>
      <Badge
        variant="outline"
        className={cn(
          'border-success/30 bg-success/10 text-caption font-semibold text-success'
        )}
      >
        Active
      </Badge>
    </div>
  );
}

type Tone = 'info' | 'success' | 'warning' | 'danger';

const toneMap: Record<Tone, { iconBg: string; iconText: string; trend: string }> = {
  info: { iconBg: 'bg-info/12', iconText: 'text-info', trend: 'text-text-muted' },
  success: { iconBg: 'bg-success/12', iconText: 'text-success', trend: 'text-text-muted' },
  warning: { iconBg: 'bg-warning/15', iconText: 'text-warning', trend: 'text-text-muted' },
  danger: { iconBg: 'bg-danger/12', iconText: 'text-danger', trend: 'text-text-muted' },
};

function StatTile({
  icon: Icon,
  label,
  value,
  trend,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  trend: string;
  tone: Tone;
}) {
  const t = toneMap[tone];
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="flex items-start gap-3 p-4">
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-md',
            t.iconBg
          )}
        >
          <Icon className={cn('h-5 w-5', t.iconText)} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-caption text-text-muted">{label}</p>
          <p className="text-h3 font-semibold text-text-primary">{value}</p>
          <p className={cn('flex items-center gap-1 text-caption', t.trend)}>
            <TrendingUp className="h-3 w-3" aria-hidden="true" />
            {trend}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
