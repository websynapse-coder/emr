'use client';

import { Hospital } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function PracticesPage() {
  return (
    <PlaceholderPage
      title="Practices"
      description="Manage practice locations and site configurations"
      icon={Hospital}
      features={[
        'Add and edit practice locations',
        'Configure telehealth vs in-person availability per site',
        'Manage site-specific service lines and payers',
        'View per-practice utilization metrics',
      ]}
      mockRows={[
        { label: 'Harborline — Oakland', value: '1,247 visits/mo', badge: 'Active', badgeTone: 'success' },
        { label: 'Harborline — Berkeley', value: '892 visits/mo', badge: 'Active', badgeTone: 'success' },
        { label: 'Harborline — Telehealth', value: '2,103 visits/mo', badge: 'Active', badgeTone: 'success' },
        { label: 'Bay Area — SF Mission', value: '634 visits/mo', badge: 'Active', badgeTone: 'success' },
      ]}
    />
  );
}
