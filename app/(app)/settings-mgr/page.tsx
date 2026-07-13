'use client';

import { Settings } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function SettingsMgrPage() {
  return (
    <PlaceholderPage
      title="Practice Settings"
      description="Configure practice-level preferences, services, and workflows"
      icon={Settings}
      features={[
        'Manage practice profile and location settings',
        'Configure appointment types and session durations',
        'Set provider schedules and availability',
        'Customize clinical note templates',
      ]}
      mockRows={[
        { label: 'Session types', value: '6 configured', badge: 'Active', badgeTone: 'success' },
        { label: 'Default duration', value: '50 minutes', badge: 'Standard', badgeTone: 'info' },
        { label: 'Telehealth platform', value: 'Integrated video', badge: 'Connected', badgeTone: 'success' },
        { label: 'Reminder cadence', value: '24h + 1h before', badge: 'Active', badgeTone: 'success' },
      ]}
    />
  );
}
