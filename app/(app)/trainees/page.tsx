'use client';

import { Users } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function TraineesPage() {
  return (
    <PlaceholderPage
      title="Trainees"
      description="Manage associate-level providers under your supervision"
      icon={Users}
      features={[
        'View associate caseloads and progress',
        'Track supervision hours and licensure milestones',
        'Review and cosign clinical notes',
        'Assign training modules and assessments',
      ]}
      mockRows={[
        { label: 'Maya Castellanos', value: '8 active patients · 1,420 hrs', badge: 'On track', badgeTone: 'success' },
        { label: 'James Okafor', value: '5 active patients · 980 hrs', badge: 'On track', badgeTone: 'success' },
        { label: 'Priya Sharma', value: '3 active patients · 410 hrs', badge: 'New', badgeTone: 'info' },
      ]}
    />
  );
}
