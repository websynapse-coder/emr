'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AppShell } from '@/components/app-shell';
import { useAuth } from '@/lib/auth-context';
import { useRole } from '@/lib/role-context';
import { navByRole, type Role } from '@/lib/mockData';

/** Flatten all nav hrefs for a role into a Set for O(1) lookup. */
function getAllowedPaths(role: Role): Set<string> {
  const items = navByRole[role] ?? [];
  return new Set(items.map((i) => i.href ?? `/${i.id}`));
}

/** Routes accessible to every authenticated user regardless of role. */
const COMMON_PATHS = new Set(['/dashboard']);

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { role } = useRole();

  React.useEffect(() => {
    if (loading) return;

    // Not logged in → redirect to login
    if (!user) {
      router.replace('/login');
      return;
    }

    // RBAC check: is this path allowed for the user's role?
    const allowed = getAllowedPaths(role);
    const allowedPrefixes = Array.from(allowed);
    const isAllowed =
      allowed.has(pathname) ||
      COMMON_PATHS.has(pathname) ||
      // Allow nested routes under an allowed prefix (e.g. /providers/[id]/profile)
      allowedPrefixes.some((p) => pathname.startsWith(p + '/'));

    if (!isAllowed) {
      // Redirect to the user's dashboard if they try to access a forbidden page
      router.replace('/dashboard');
    }
  }, [user, loading, role, pathname, router]);

  // Show nothing while loading or redirecting
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-sunken">
        <div className="text-body-sm text-text-muted">Loading…</div>
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
