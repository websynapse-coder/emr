'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, ChevronRight } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRole } from '@/lib/role-context';
import { navByRole, type NavItem } from '@/lib/mockData';
import { getNavIcon } from '@/components/nav-icons';

/* ------------------------------------------------------------------ */
/*  Sidebar                                                            */
/* ------------------------------------------------------------------ */

export function Sidebar() {
  const { role, organization } = useRole();
  const items = navByRole[role] ?? [];
  const pathname = usePathname();

  const isActive = (item: NavItem): boolean => {
    const href = item.href ?? `/${item.id}`;
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <aside
      className={cn(
        'flex h-full w-60 shrink-0 flex-col',
        'bg-sidebar text-sidebar-foreground',
        'border-r border-sidebar-border'
      )}
    >
      {/* Brand / org block */}
      <div className="flex items-center gap-2.5 px-4 h-14 shrink-0">
        <div
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
            'bg-brand-primary text-brand-primary-foreground'
          )}
        >
          <Moon className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-body-sm font-semibold text-sidebar-foreground leading-tight">Moonaria</p>
          <p className="truncate text-caption text-sidebar-muted leading-tight">
            {organization.shortName}
          </p>
        </div>
      </div>

      <div className="mx-3 h-px bg-sidebar-border" />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2">
        <p className="px-2 pb-1 pt-1 text-caption uppercase tracking-wide text-sidebar-muted">
          {role === 'patient' ? 'Patient Portal' : 'Workspace'}
        </p>
        <ul className="space-y-0.5">
          {items.map((item) => {
            const Icon = getNavIcon(item.icon);
            const active = isActive(item);
            const href = item.href ?? `/${item.id}`;
            return (
              <li key={item.id}>
                <Link
                  href={href}
                  className={cn(
                    'group flex w-full items-center gap-3 rounded-md px-2.5 h-10 text-body-sm transition-colors',
                    active
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 shrink-0',
                      active
                        ? 'text-sidebar-accent-foreground'
                        : 'text-sidebar-muted group-hover:text-sidebar-accent-foreground'
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1 text-left">{item.label}</span>
                  {typeof item.badge === 'number' && (
                    <span
                      className={cn(
                        'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-caption',
                        active
                          ? 'bg-brand-primary text-brand-primary-foreground'
                          : 'bg-sidebar-accent/40 text-sidebar-foreground'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                  {active && (
                    <ChevronRight
                      className="h-4 w-4 text-sidebar-accent-foreground"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border px-4 py-2.5">
        <p className="text-caption text-sidebar-muted leading-tight">
          Behavioral Health EMR
        </p>
        <p className="text-caption text-sidebar-muted leading-tight">Prototype build</p>
      </div>
    </aside>
  );
}
