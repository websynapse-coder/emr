'use client';

import { GraduationCap } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function SupervisionPage() {
  return (
    <PlaceholderPage
      title="Supervision"
      description="Track associate supervision hours, meetings, and progress"
      icon={GraduationCap}
      features={[
        'Log supervision hours toward licensure requirements',
        'Schedule and document supervision meetings',
        'Track associate progress and milestones',
        'Review supervision notes and feedback',
      ]}
      mockRows={[
        { label: 'Maya Castellanos', value: '1,420 / 3,000 hrs', badge: '47% complete', badgeTone: 'info' },
        { label: 'Last supervision meeting', value: 'Jul 8, 2026', badge: 'Completed', badgeTone: 'success' },
        { label: 'Next supervision meeting', value: 'Jul 15, 2026', badge: 'Scheduled', badgeTone: 'info' },
        { label: 'Notes to cosign', value: '1 pending', badge: 'Action needed', badgeTone: 'warning' },
      ]}
    />
  );
}
