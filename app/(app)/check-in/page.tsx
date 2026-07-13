'use client';

import { UserCheck } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function CheckInPage() {
  return (
    <PlaceholderPage
      title="Check-In"
      description="Manage front desk check-in and waiting room workflow"
      icon={UserCheck}
      features={[
        'Check in patients for scheduled appointments',
        'Verify insurance and collect copays at check-in',
        'Notify providers when patients arrive',
        'Manage waiting room status and wait times',
      ]}
      mockRows={[
        { label: 'Jordan Avery', value: '9:00 AM — Dr. Nair', badge: 'Checked in', badgeTone: 'success' },
        { label: 'Maria Sato', value: '10:30 AM — Maya C.', badge: 'Waiting', badgeTone: 'warning' },
        { label: 'Devon Park', value: '1:00 PM — Dr. Brennan', badge: 'Not arrived', badgeTone: 'info' },
      ]}
    />
  );
}
