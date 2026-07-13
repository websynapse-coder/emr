'use client';

import { FolderSearch } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function CasesPage() {
  return (
    <PlaceholderPage
      title="Case Review"
      description="Review complex cases and care plans across the team"
      icon={FolderSearch}
      features={[
        'Review high-acuity and complex cases',
        'Provide clinical guidance and case direction',
        'Track case outcomes and quality metrics',
        'Escalate cases requiring specialist consultation',
      ]}
      mockRows={[
        { label: 'Maria Sato', value: 'MDD — passive SI', badge: 'Monitoring', badgeTone: 'warning' },
        { label: 'Devon Park', value: 'PTSD — no-show pattern', badge: 'Follow up', badgeTone: 'warning' },
        { label: 'Noah Williams', value: 'ADHD — medication review', badge: 'Active', badgeTone: 'success' },
      ]}
    />
  );
}
