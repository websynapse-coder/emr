'use client';

import Link from 'next/link';
import { Stethoscope, ArrowRight, AlertCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRole } from '@/lib/role-context';
import { users, providerProfiles } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

/* ------------------------------------------------------------------ */
/*  Providers list page                                                */
/* ------------------------------------------------------------------ */

export default function ProvidersPage() {
  const { organization } = useRole();
  const providers = users.filter(
    (u) => u.orgId === organization.id && u.role === 'provider'
  );

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Providers</h1>
        <p className="text-body text-text-secondary">
          Manage credentialing and profiles for providers in{' '}
          {organization.shortName}.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Stethoscope className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            All providers
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Click a provider to view or complete their profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {providers.map((p) => {
            const profile = providerProfiles.find((pr) => pr.userId === p.id);
            const completion = profile?.completion ?? 0;
            return (
              <Link key={p.id} href={`/providers/${p.id}/profile`}>
                <div
                  className={cn(
                    'flex items-center gap-3 rounded-md border border-border',
                    'bg-surface px-4 py-3 transition-colors hover:bg-surface-sunken'
                  )}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-brand-primary/15 text-caption font-semibold text-brand-primary">
                      {p.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-medium text-text-primary">
                      {p.name}
                    </p>
                    <p className="truncate text-caption text-text-muted">
                      {p.title}
                    </p>
                  </div>
                  {profile?.isAssociate && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'border-info/30 bg-info/10 text-caption font-semibold text-info'
                      )}
                    >
                      Associate
                    </Badge>
                  )}
                  {completion < 100 ? (
                    <Badge
                      variant="outline"
                      className={cn(
                        'border-warning/40 bg-warning/10 text-caption font-semibold text-warning'
                      )}
                    >
                      <AlertCircle className="mr-1 h-3 w-3" aria-hidden="true" />
                      {completion}% complete
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className={cn(
                        'border-success/30 bg-success/10 text-caption font-semibold text-success'
                      )}
                    >
                      Complete
                    </Badge>
                  )}
                  <ArrowRight
                    className="h-4 w-4 text-text-muted"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
