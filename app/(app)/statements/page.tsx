'use client';

import { ReceiptText } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function StatementsPage() {
  return (
    <PlaceholderPage
      title="Statements"
      description="Generate and send patient statements for outstanding balances"
      icon={ReceiptText}
      features={[
        'Generate patient statements for outstanding balances',
        'Configure statement templates and branding',
        'Schedule recurring statement runs',
        'Track statement delivery and payment status',
      ]}
      mockRows={[
        { label: 'Jordan Avery', value: '$28.20 balance', badge: 'Ready to send', badgeTone: 'warning' },
        { label: 'Maria Sato', value: '$98.00 balance', badge: 'Denied claim', badgeTone: 'danger' },
        { label: 'Noah Williams', value: '$0.00 balance', badge: 'Current', badgeTone: 'success' },
      ]}
    />
  );
}
