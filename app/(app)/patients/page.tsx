'use client';

import { Users } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function PatientsPage() {
  return (
    <PlaceholderPage
      title="Patients"
      description="Manage patient roster, demographics, and care history"
      icon={Users}
      features={[
        'Search and filter patient roster',
        'View patient demographics and insurance',
        'Access care history across providers',
        'Manage patient consent and privacy preferences',
      ]}
      mockRows={[
        { label: 'Jordan Avery', value: '3 sessions · Dr. Nair', badge: 'Active', badgeTone: 'success' },
        { label: 'Maria Sato', value: '2 sessions · Maya C.', badge: 'Active', badgeTone: 'success' },
        { label: 'Emma Rios', value: '1 session · Dr. Nair', badge: 'Minor', badgeTone: 'warning' },
        { label: 'Devon Park', value: '1 session · Dr. Brennan', badge: 'No-show', badgeTone: 'danger' },
        { label: 'The Chen Family', value: '2 sessions · Dr. Nair', badge: 'Family', badgeTone: 'info' },
      ]}
    />
  );
}
