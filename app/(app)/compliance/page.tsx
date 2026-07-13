'use client';

import { ShieldCheck } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function CompliancePage() {
  return (
    <PlaceholderPage
      title="Compliance"
      description="HIPAA, 42 CFR Part 2, and regulatory compliance monitoring"
      icon={ShieldCheck}
      features={[
        'Track HIPAA training completion across staff',
        'Manage Business Associate Agreements (BAAs)',
        'View compliance audit logs and incident reports',
        'Configure data retention and privacy policies',
      ]}
      mockRows={[
        { label: 'HIPAA training', value: '44 of 47 staff', badge: '94% complete', badgeTone: 'success' },
        { label: 'BAAs on file', value: '12 active agreements', badge: 'Current', badgeTone: 'success' },
        { label: 'Audit log retention', value: '7 years', badge: 'Compliant', badgeTone: 'success' },
        { label: 'Incident reports (30d)', value: '0 open incidents', badge: 'Clear', badgeTone: 'success' },
      ]}
    />
  );
}
