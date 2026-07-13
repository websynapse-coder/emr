'use client';

import { FileText } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function NotesPage() {
  return (
    <PlaceholderPage
      title="Clinical Notes"
      description="View, search, and manage your clinical documentation"
      icon={FileText}
      features={[
        'Search notes by patient, date, or status',
        'Filter by draft, signed, awaiting cosign, or cosigned',
        'Edit draft notes and sign for filing',
        'Track notes awaiting supervisor cosign',
      ]}
      mockRows={[
        { label: 'Jordan Avery — Jul 7', value: 'CPT 90837', badge: 'Signed', badgeTone: 'success' },
        { label: 'Maria Sato — Jul 8', value: 'CPT 90834', badge: 'Awaiting Cosign', badgeTone: 'warning' },
        { label: 'Emma Rios — Jul 9', value: 'CPT 90847', badge: 'Cosigned', badgeTone: 'success' },
        { label: 'Devon Park — Jul 10', value: 'No-show', badge: 'Draft', badgeTone: 'info' },
      ]}
    />
  );
}
