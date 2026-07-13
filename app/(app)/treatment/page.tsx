'use client';

import { ClipboardPenLine } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function TreatmentPage() {
  return (
    <PlaceholderPage
      title="Treatment Plans"
      description="Create and manage evidence-based treatment plans for patients"
      icon={ClipboardPenLine}
      features={[
        'Create treatment plans with measurable goals',
        'Track progress toward goals across sessions',
        'Link plans to diagnosis codes and interventions',
        'Review and update plans at care milestones',
      ]}
      mockRows={[
        { label: 'Jordan Avery', value: 'GAD — CBT protocol', badge: 'Active', badgeTone: 'success' },
        { label: 'Maria Sato', value: 'MDD — CBT + med consult', badge: 'Active', badgeTone: 'success' },
        { label: 'Emma Rios', value: 'Family therapy — 4 sessions', badge: 'Active', badgeTone: 'success' },
        { label: 'Devon Park', value: 'PTSD — EMDR protocol', badge: 'On hold', badgeTone: 'warning' },
      ]}
    />
  );
}
