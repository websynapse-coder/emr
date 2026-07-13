'use client';

import { AuthProvider } from '@/lib/auth-context';
import { RoleProvider } from '@/lib/role-context';

/**
 * Client-side providers for the Moonaria app. Wraps the tree in AuthProvider
 * (session-based auth) then RoleProvider (derives role/org from the logged-in
 * user).
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RoleProvider>{children}</RoleProvider>
    </AuthProvider>
  );
}
