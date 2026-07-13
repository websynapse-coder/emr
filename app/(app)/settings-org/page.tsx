'use client';

import { Settings } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function SettingsOrgPage() {
  return (
    <PlaceholderPage
      title="Organization Settings"
      description="Configure organization-wide preferences and policies"
      icon={Settings}
      features={[
        'Manage organization profile and branding',
        'Configure SSO and authentication settings',
        'Set default clinical templates and workflows',
        'Manage integrations and API keys',
      ]}
      mockRows={[
        { label: 'SSO provider', value: 'Okta SAML 2.0', badge: 'Connected', badgeTone: 'success' },
        { label: 'Default note template', value: 'SOAP (Psychotherapy)', badge: 'Active', badgeTone: 'success' },
        { label: 'EHR integration', value: 'Not configured', badge: 'Setup needed', badgeTone: 'warning' },
        { label: 'Time zone', value: 'America/Los_Angeles', badge: 'Default', badgeTone: 'info' },
      ]}
    />
  );
}
