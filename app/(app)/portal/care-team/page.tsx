'use client';

import { Users } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function CareTeamPage() {
  return (
    <PlaceholderPage
      title="My Care Team"
      description="View your providers and care team members"
      icon={Users}
      features={[
        'View your assigned providers and their specialties',
        'See contact information and office hours',
        'Message your care team directly',
        'View care team credentials and licensing',
      ]}
      mockRows={[
        { label: 'Dr. Priya Nair, PsyD', value: 'Primary therapist', badge: 'Active', badgeTone: 'success' },
        { label: 'Dr. Eli Brennan, MD', value: 'Psychiatrist', badge: 'Active', badgeTone: 'success' },
        { label: 'Sarah Chen', value: 'Care coordinator', badge: 'Active', badgeTone: 'success' },
      ]}
    />
  );
}
