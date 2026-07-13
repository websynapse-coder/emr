'use client';

import { FolderOpen } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function DocumentsPage() {
  return (
    <PlaceholderPage
      title="Documents"
      description="Access your clinical documents, forms, and records"
      icon={FolderOpen}
      features={[
        'Download consent forms and signed documents',
        'View clinical summaries and treatment plans',
        'Access intake and assessment forms',
        'Request records or document corrections',
      ]}
      mockRows={[
        { label: 'Session Recording Consent — Jul 7', value: 'Signed Jul 7, 2026', badge: 'Signed', badgeTone: 'success' },
        { label: 'Telehealth Consent — Jun 23', value: 'Signed Jun 23, 2026', badge: 'Signed', badgeTone: 'success' },
        { label: 'Intake Packet', value: 'Completed Jun 15, 2026', badge: 'On file', badgeTone: 'success' },
        { label: 'Treatment Plan — CBT for GAD', value: 'Updated Jul 7, 2026', badge: 'Active', badgeTone: 'info' },
      ]}
    />
  );
}
