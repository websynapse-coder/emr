'use client';

import { Pill } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function EPrescribePage() {
  return (
    <PlaceholderPage
      title="e-Prescribe"
      description="Electronically prescribe medications with pharmacy integration"
      icon={Pill}
      features={[
        'Search and select from full drug formulary',
        'Check drug-drug interactions and allergy alerts',
        'Send prescriptions to patient pharmacy of choice',
        'Track prescription history and refill requests',
      ]}
      mockRows={[
        { label: 'Sertraline 50mg', value: 'Jordan Avery', badge: 'Active', badgeTone: 'success' },
        { label: 'Bupropion XL 150mg', value: 'Maria Sato', badge: 'Refill due', badgeTone: 'warning' },
        { label: 'Lisdexamfetamine 30mg', value: 'Noah Williams', badge: 'Active', badgeTone: 'success' },
      ]}
    />
  );
}
