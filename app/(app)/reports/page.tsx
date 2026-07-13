'use client';

import { BarChart3 } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function ReportsPage() {
  return (
    <PlaceholderPage
      title="Reports"
      description="Generate and export operational and clinical reports"
      icon={BarChart3}
      features={[
        'Build custom reports with drag-and-drop dimensions',
        'Schedule recurring report delivery via email',
        'Export to CSV, PDF, or share via secure link',
        'Access pre-built templates: utilization, revenue, outcomes',
      ]}
      mockRows={[
        { label: 'Monthly Utilization Report', value: 'Last run: Jul 10', badge: 'Scheduled', badgeTone: 'info' },
        { label: 'Revenue by Payer', value: 'Last run: Jul 11', badge: 'On-demand', badgeTone: 'success' },
        { label: 'Clinical Outcomes Summary', value: 'Last run: Jul 5', badge: 'Scheduled', badgeTone: 'info' },
        { label: 'Claim Denial Analysis', value: 'Last run: Jul 12', badge: 'On-demand', badgeTone: 'success' },
      ]}
    />
  );
}
