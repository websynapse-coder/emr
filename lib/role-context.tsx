'use client';

import * as React from 'react';

import {
  type Organization,
  type Role,
  type User,
  ROLE_ORDER,
  ROLE_LABELS,
  getDefaultUserForRole,
  getOrg,
  organizations,
} from '@/lib/mockData';

/* ------------------------------------------------------------------ */
/*  Context shape                                                      */
/* ------------------------------------------------------------------ */

interface RoleContextValue {
  /** The currently active role (drives nav items + screen access). */
  role: Role;
  /** Human label for the active role, e.g. "Practice Manager". */
  roleLabel: string;
  /** The mock user currently associated with the active role. */
  user: User | undefined;
  /** The currently active organization. */
  organization: Organization;
  /** All organizations (for the org switcher). */
  organizations: Organization[];
  /** Switch the demo role. Updates the active user to the first match. */
  setRole: (role: Role) => void;
  /** Switch the active organization. */
  setOrganization: (orgId: string) => void;
  /** All roles in display order. */
  roles: Role[];
  /** Label lookup for any role. */
  roleLabels: Record<Role, string>;
}

const RoleContext = React.createContext<RoleContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

const DEFAULT_ROLE: Role = 'provider';

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<Role>(DEFAULT_ROLE);
  const [orgId, setOrgId] = React.useState<string>(organizations[0].id);

  const setRole = React.useCallback((next: Role) => {
    setRoleState(next);
  }, []);

  const setOrganization = React.useCallback((id: string) => {
    setOrgId(id);
  }, []);

  const user = React.useMemo(() => getDefaultUserForRole(role), [role]);
  const organization = React.useMemo(
    () => getOrg(orgId) ?? organizations[0],
    [orgId]
  );

  const value = React.useMemo<RoleContextValue>(
    () => ({
      role,
      roleLabel: ROLE_LABELS[role],
      user,
      organization,
      organizations,
      setRole,
      setOrganization,
      roles: ROLE_ORDER,
      roleLabels: ROLE_LABELS,
    }),
    [role, user, organization, setRole, setOrganization]
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useRole(): RoleContextValue {
  const ctx = React.useContext(RoleContext);
  if (!ctx) {
    throw new Error('useRole must be used within a <RoleProvider>.');
  }
  return ctx;
}
