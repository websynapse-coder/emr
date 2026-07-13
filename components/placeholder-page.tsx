'use client';

import * as React from 'react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/* ------------------------------------------------------------------ */
/*  Placeholder page shell                                             */
/* ------------------------------------------------------------------ */

/**
 * Shared shell for pages that are part of the prototype's information
 * architecture but don't yet have full functionality. Renders a
 * polished, on-brand "coming soon" state with a description and
 * optional mock content rows so the page doesn't feel empty.
 */
export function PlaceholderPage({
  title,
  description,
  icon: Icon,
  features,
  mockRows,
}: {
  title: string;
  description: string;
  icon: LucideIcon;
  features?: string[];
  mockRows?: { label: string; value: string; badge?: string; badgeTone?: 'info' | 'success' | 'warning' | 'danger' }[];
}) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
          <Icon className="h-6 w-6 text-brand-primary" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-h1 font-bold text-text-primary">{title}</h1>
          <p className="text-body text-text-secondary">{description}</p>
        </div>
      </div>

      {/* Prototype notice */}
      <div
        className={cn(
          'flex items-start gap-2.5 rounded-md border border-info/30 bg-info/5 p-3',
          'text-body-sm text-text-secondary'
        )}
      >
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-info" aria-hidden="true" />
        <p>
          This module is part of the Moonaria prototype. The information architecture
          and navigation are fully wired; interactive functionality will be added
          in a future iteration.
        </p>
      </div>

      {/* Feature list */}
      {features && features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-h4 text-text-primary">Planned capabilities</CardTitle>
            <CardDescription className="text-body-sm text-text-muted">
              What this section will include when fully built out
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-body-sm text-text-secondary">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Mock rows */}
      {mockRows && mockRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-h4 text-text-primary">Preview</CardTitle>
            <CardDescription className="text-body-sm text-text-muted">
              Mock data for demonstration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockRows.map((row, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-center justify-between rounded-md border border-border',
                  'bg-surface px-4 py-2.5'
                )}
              >
                <span className="text-body-sm font-medium text-text-primary">
                  {row.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-body-sm text-text-secondary">{row.value}</span>
                  {row.badge && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-caption font-semibold',
                        row.badgeTone === 'success' && 'border-success/30 bg-success/10 text-success',
                        row.badgeTone === 'warning' && 'border-warning/40 bg-warning/10 text-warning',
                        row.badgeTone === 'danger' && 'border-danger/30 bg-danger/10 text-danger',
                        row.badgeTone === 'info' && 'border-info/30 bg-info/10 text-info',
                        !row.badgeTone && 'border-border bg-surface-sunken text-text-muted'
                      )}
                    >
                      {row.badge}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
