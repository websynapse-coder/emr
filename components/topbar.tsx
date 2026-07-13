'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Check, ChevronsUpDown, Building2, Eye } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRole } from '@/lib/role-context';
import { ROLE_LABELS } from '@/lib/mockData';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

/* ------------------------------------------------------------------ */
/*  Route → page title map                                             */
/* ------------------------------------------------------------------ */

const ROUTE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Organization overview' },
  '/team': { title: 'Team', subtitle: 'Invite and manage teammates' },
  '/providers': { title: 'Providers', subtitle: 'Credentialing & profiles' },
  '/schedule': { title: 'Schedule', subtitle: 'Week view of appointments' },
  '/notes-review': { title: 'Notes to Review', subtitle: 'Cosign queue for supervisors' },
  '/billing/charges': { title: 'Charges', subtitle: 'Review charges and submit claims' },
  '/billing/claims': { title: 'Claims', subtitle: 'Track claim status and adjudication' },
  '/billing/remittance': { title: 'Remittance & Payout', subtitle: 'Payer remittances and org payouts' },
  '/portal': { title: 'Patient Portal', subtitle: 'Your appointments, consents, and messages' },
  '/portal/billing': { title: 'Billing & Balance', subtitle: 'Your charges and payment history' },
  '/portal/appointments': { title: 'My Appointments', subtitle: 'Upcoming and past sessions' },
  '/portal/care-team': { title: 'My Care Team', subtitle: 'Your providers and care team' },
  '/portal/documents': { title: 'Documents', subtitle: 'Clinical documents and forms' },
  '/portal/messages': { title: 'Messages', subtitle: 'Secure messaging with your care team' },
  '/financials': { title: 'Financial Dashboard', subtitle: 'Revenue, denials, and claim metrics' },
  '/orgs': { title: 'Organizations', subtitle: 'Multi-organization structure' },
  '/practices': { title: 'Practices', subtitle: 'Practice locations and configurations' },
  '/users': { title: 'Users & Roles', subtitle: 'Accounts, roles, and permissions' },
  '/billing-org': { title: 'Organization Billing', subtitle: 'Subscription and invoicing' },
  '/compliance': { title: 'Compliance', subtitle: 'HIPAA and regulatory monitoring' },
  '/reports': { title: 'Reports', subtitle: 'Operational and clinical reporting' },
  '/settings-org': { title: 'Organization Settings', subtitle: 'Org-wide preferences and policies' },
  '/patients': { title: 'Patients', subtitle: 'Patient roster and demographics' },
  '/intake': { title: 'Intake', subtitle: 'New patient onboarding workflows' },
  '/billing-mgr': { title: 'Billing', subtitle: 'Practice-level billing overview' },
  '/settings-mgr': { title: 'Practice Settings', subtitle: 'Practice-level preferences' },
  '/notes': { title: 'Clinical Notes', subtitle: 'View and manage documentation' },
  '/treatment': { title: 'Treatment Plans', subtitle: 'Evidence-based care plans' },
  '/e-prescribe': { title: 'e-Prescribe', subtitle: 'Electronic prescribing' },
  '/tasks': { title: 'Tasks', subtitle: 'Clinical and administrative tasks' },
  '/messages': { title: 'Messages', subtitle: 'Secure team and patient messaging' },
  '/supervision': { title: 'Supervision', subtitle: 'Associate supervision tracking' },
  '/cases': { title: 'Case Review', subtitle: 'Complex case management' },
  '/trainees': { title: 'Trainees', subtitle: 'Associate providers under supervision' },
  '/denials': { title: 'Denials', subtitle: 'Denied claims and appeals' },
  '/eligibility': { title: 'Eligibility', subtitle: 'Insurance verification' },
  '/statements': { title: 'Statements', subtitle: 'Patient statement generation' },
  '/check-in': { title: 'Check-In', subtitle: 'Front desk check-in workflow' },
};

function usePageTitle() {
  const pathname = usePathname();

  return React.useMemo(() => {
    if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
    if (pathname.startsWith('/providers/') && pathname.endsWith('/profile')) {
      return { title: 'Provider Profile', subtitle: 'Credentialing & compliance' };
    }
    if (pathname.startsWith('/encounter/')) {
      return { title: 'Patient Encounter', subtitle: 'Session recording & clinical note' };
    }
    return { title: 'Dashboard', subtitle: 'Organization overview' };
  }, [pathname]);
}

/* ------------------------------------------------------------------ */
/*  Top bar                                                            */
/* ------------------------------------------------------------------ */

export function TopBar() {
  const { title, subtitle } = usePageTitle();

  return (
    <header
      className={cn(
        'flex h-16 shrink-0 items-center gap-4 border-b border-border',
        'bg-surface px-4 md:px-6'
      )}
    >
      <div className="flex-1">
        <h1 className="text-h3 font-semibold text-text-primary">{title}</h1>
        <p className="text-caption text-text-muted">{subtitle}</p>
      </div>

      <OrgSwitcher />
      <RoleSwitcher />
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Org switcher                                                       */
/* ------------------------------------------------------------------ */

function OrgSwitcher() {
  const { organization, organizations, setOrganization } = useRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center gap-2 rounded-md border border-border',
          'bg-surface px-3 py-1.5 text-body-sm text-text-primary',
          'transition-colors hover:bg-surface-sunken'
        )}
      >
        <Building2 className="h-4 w-4 text-text-secondary" aria-hidden="true" />
        <span className="hidden max-w-32 truncate md:inline">
          {organization.shortName}
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Organization</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={organization.id}
          onValueChange={setOrganization}
        >
          {organizations.map((org) => (
            <DropdownMenuRadioItem key={org.id} value={org.id}>
              <div className="flex flex-col">
                <span>{org.shortName}</span>
                <span className="text-caption text-text-muted">
                  {org.tagline}
                </span>
              </div>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------------------------------------------ */
/*  Role switcher (Demo Mode)                                          */
/* ------------------------------------------------------------------ */

function RoleSwitcher() {
  const { role, roleLabel, user, roles, roleLabels, setRole } = useRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'flex items-center gap-2.5 rounded-md border border-warning/40',
          'bg-warning/10 px-3 py-1.5 text-body-sm text-warning-foreground',
          'transition-colors hover:bg-warning/20'
        )}
      >
        <Eye className="h-4 w-4 text-warning" aria-hidden="true" />
        <span className="hidden text-caption font-semibold uppercase tracking-wide text-warning sm:inline">
          Demo Mode
        </span>
        <span className="hidden text-body-sm text-text-primary md:inline">
          Viewing as: {roleLabel}
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 text-text-muted" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-warning" aria-hidden="true" />
          Viewing as: {roleLabel}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={role}
          onValueChange={(v) => setRole(v as typeof role)}
        >
          {roles.map((r) => (
            <DropdownMenuRadioItem key={r} value={r}>
              {roleLabels[r]}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        {user && (
          <div className="flex items-center gap-2.5 px-2 py-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-brand-primary/15 text-caption font-semibold text-brand-primary">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-body-sm font-medium text-text-primary">
                {user.name}
              </p>
              <p className="truncate text-caption text-text-muted">
                {user.title}
              </p>
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
