'use client';

import { CreditCard } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function BillingOrgPage() {
  return (
    <PlaceholderPage
      title="Organization Billing"
      description="Manage org-level subscription, invoicing, and payment methods"
      icon={CreditCard}
      features={[
        'View and download organization invoices',
        'Manage payment methods and billing contacts',
        'Track subscription usage and plan limits',
        'Configure cost-center allocations',
      ]}
      mockRows={[
        { label: 'Current plan', value: 'Enterprise — 50 seats', badge: 'Active', badgeTone: 'success' },
        { label: 'Next invoice', value: '$4,250.00', badge: 'Aug 1, 2026', badgeTone: 'info' },
        { label: 'Seats used', value: '47 of 50', badge: '94%', badgeTone: 'info' },
        { label: 'Payment method', value: 'Visa ending 4242', badge: 'Auto-pay', badgeTone: 'success' },
      ]}
    />
  );
}
