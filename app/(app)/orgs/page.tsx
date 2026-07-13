'use client';

import { Building2 } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function OrgsPage() {
  return (
    <PlaceholderPage
      title="Organizations"
      description="Manage multi-organization structure and hierarchies"
      icon={Building2}
      features={[
        'Create and configure organizations',
        'Manage parent/child organization relationships',
        'Set organization-level billing and compliance rules',
        'View cross-organization analytics',
      ]}
      mockRows={[
        { label: 'Harborline Behavioral Health', value: '5 practices · 47 providers', badge: 'Active', badgeTone: 'success' },
        { label: 'Bay Area Counseling Group', value: '3 practices · 22 providers', badge: 'Active', badgeTone: 'success' },
        { label: 'North Coast Mental Health', value: '2 practices · 12 providers', badge: 'Onboarding', badgeTone: 'warning' },
      ]}
    />
  );
}
