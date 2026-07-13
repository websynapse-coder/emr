'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Moon, LogOut } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useInternalAuth, InternalAuthProvider } from '@/lib/internal-auth';
import { Button } from '@/components/ui/button';

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  return <InternalAuthProvider><Inner>{children}</Inner></InternalAuthProvider>;
}

function Inner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthed, logout } = useInternalAuth();

  React.useEffect(() => {
    if (!isAuthed && pathname !== '/internal/login') {
      router.replace('/internal/login');
    }
  }, [isAuthed, pathname, router]);

  if (!isAuthed && pathname !== '/internal/login') {
    return null;
  }

  // Login page renders without the internal nav
  if (pathname === '/internal/login') {
    return <>{children}</>;
  }

  const navItems = [
    { href: '/internal', label: 'Leads' },
    { href: '/internal/organizations', label: 'Organizations' },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface-sunken">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-primary text-brand-primary-foreground">
              <Moon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="leading-tight">
              <p className="text-body-sm font-semibold text-text-primary">Moonaria Internal</p>
              <p className="text-caption text-text-muted">Sales &amp; Ops</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-body-sm transition-colors',
                    active
                      ? 'bg-brand-primary/10 text-brand-primary font-medium'
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-sunken'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 text-text-muted"
          onClick={() => {
            logout();
            router.push('/internal/login');
          }}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </Button>
      </header>
      <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
