'use client';

import { RoleProvider } from '@/lib/role-context';

/**
 * Client-side providers for the Moonaria app. Currently wraps the tree in the
 * RoleProvider so every screen can read the active demo role / organization.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <RoleProvider>{children}</RoleProvider>;
}
