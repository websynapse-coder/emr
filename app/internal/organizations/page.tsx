'use client';

import { Building2 } from 'lucide-react';

import { organizations } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';

export default function InternalOrganizationsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4">
        <h1 className="text-h2 font-semibold text-text-primary">Organizations</h1>
        <p className="text-body-sm text-text-muted">Internal visibility into organizations on the platform.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-surface-sunken">
                  <th className="h-10 px-4 text-left text-caption font-medium text-text-muted">Organization</th>
                  <th className="h-10 px-4 text-left text-caption font-medium text-text-muted">Plan</th>
                  <th className="h-10 px-4 text-left text-caption font-medium text-text-muted">Providers</th>
                  <th className="h-10 px-4 text-left text-caption font-medium text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org.id} className="border-b border-border transition-colors hover:bg-surface-sunken">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-primary/10 text-brand-primary">
                          <Building2 className="h-4 w-4" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-body-sm font-medium text-text-primary">{org.name}</p>
                          <p className="text-caption text-text-muted">{org.shortName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-body-sm capitalize text-text-secondary">{org.plan}</span>
                    </td>
                    <td className="px-4 py-2.5 text-body-sm text-text-secondary">
                      {org.providerCount}
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
                        Active
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
