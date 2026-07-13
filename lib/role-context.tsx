'use client';

import * as React from 'react';

import {
  type Organization,
  type Role,
  type User,
  ROLE_ORDER,
  ROLE_LABELS,
  organizations,
  getOrg,
} from '@/lib/mockData';
import { useAuth } from '@/lib/auth-context';

/* ------------------------------------------------------------------ */
/*  Context shape                                                      */
/* ------------------------------------------------------------------ */

interface RoleContextValue {
  /** The currently active role (drives nav items + screen access). */
  role: Role;
  /** Human label for the active role, e.g. "Practice Manager". */
  roleLabel: string;
  /** The logged-in user. */
  user: User | undefined;
  /** The currently active organization. */
  organization: Organization;
  /** All organizations (for the org switcher). */
  organizations: Organization[];
  /** All roles in display order. */
  roles: Role[];
  /** Label lookup for any role. */
  roleLabels: Record<Role, string>;
}

const RoleContext = React.createContext<RoleContextValue | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();

  const role = authUser?.role ?? 'provider';
  const orgId = authUser?.orgId ?? organizations[0].id;

  const user = React.useMemo<User | undefined>(() => {
    if (!authUser) return undefined;
    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      orgId: authUser.orgId,
      title: authUser.title,
      initials: authUser.initials,
    };
  }, [authUser]);

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
      roles: ROLE_ORDER,
      roleLabels: ROLE_LABELS,
    }),
    [role, user, organization]
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
