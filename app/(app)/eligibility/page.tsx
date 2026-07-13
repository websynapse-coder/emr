'use client';

import { BadgeCheck } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function EligibilityPage() {
  return (
    <PlaceholderPage
      title="Eligibility"
      description="Verify patient insurance coverage and benefits in real time"
      icon={BadgeCheck}
      features={[
        'Run real-time eligibility checks against payer APIs',
        'View coverage status, copay, and deductible remaining',
        'Batch-check eligibility for upcoming appointments',
        'Log eligibility responses for audit trail',
      ]}
      mockRows={[
        { label: 'Jordan Avery — Aetna', value: 'Active · $0 copay', badge: 'Verified', badgeTone: 'success' },
        { label: 'Maria Sato — Blue Shield', value: 'Active · $30 copay', badge: 'Verified', badgeTone: 'success' },
        { label: 'Devon Park — Cigna', value: 'Active · $45 copay', badge: 'Verified', badgeTone: 'success' },
        { label: 'Noah Williams — Aetna', value: 'Inactive', badge: 'Action needed', badgeTone: 'danger' },
      ]}
    />
  );
}
