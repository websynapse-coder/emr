'use client';

import { AlertTriangle } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function DenialsPage() {
  return (
    <PlaceholderPage
      title="Denials"
      description="Manage denied claims, appeals, and rebilling workflows"
      icon={AlertTriangle}
      features={[
        'View and triage denied claims by reason code',
        'Initiate appeals with supporting documentation',
        'Track appeal status and payer responses',
        'Identify denial patterns for process improvement',
      ]}
      mockRows={[
        { label: 'Maria Sato — CPT 90834', value: 'CO-97: Bundled service', badge: 'Appeal needed', badgeTone: 'danger' },
        { label: 'Aaliyah Johnson — CPT 90832', value: 'CO-16: Missing info', badge: 'Rebill', badgeTone: 'warning' },
        { label: 'Marcus Cole — CPT 90837', value: 'CO-50: Non-covered', badge: 'Under review', badgeTone: 'warning' },
      ]}
    />
  );
}
