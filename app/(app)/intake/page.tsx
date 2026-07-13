'use client';

import { UserCheck } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function IntakePage() {
  return (
    <PlaceholderPage
      title="Intake"
      description="Manage new patient intake forms and onboarding workflows"
      icon={UserCheck}
      features={[
        'Send digital intake forms to new patients',
        'Review and approve completed intake packets',
        'Collect insurance and demographic information',
        'Match patients to appropriate providers',
      ]}
      mockRows={[
        { label: 'Liam Foster', value: 'Submitted Jul 10', badge: 'Pending review', badgeTone: 'warning' },
        { label: 'Olivia Martinez', value: 'Submitted Jul 9', badge: 'Approved', badgeTone: 'success' },
        { label: 'Ethan Nakamura', value: 'Sent Jul 8', badge: 'Awaiting patient', badgeTone: 'info' },
        { label: 'Sophia Patel', value: 'Submitted Jul 7', badge: 'Approved', badgeTone: 'success' },
      ]}
    />
  );
}
