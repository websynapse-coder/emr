'use client';

import { CreditCard } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function BillingMgrPage() {
  return (
    <PlaceholderPage
      title="Billing"
      description="Practice-level billing overview, charges, and claim management"
      icon={CreditCard}
      features={[
        'View practice-level billing dashboard',
        'Track charge submission and claim status',
        'Monitor denial rates and aging A/R',
        'Manage patient statements and payment plans',
      ]}
      mockRows={[
        { label: 'Charges ready', value: '3 charges', badge: 'Action needed', badgeTone: 'warning' },
        { label: 'Claims in flight', value: '4 claims', badge: 'In progress', badgeTone: 'info' },
        { label: 'A/R aging (30+ days)', value: '$2,847.00', badge: 'Follow up', badgeTone: 'warning' },
        { label: 'Denial rate', value: '16.7%', badge: '1 denied', badgeTone: 'danger' },
      ]}
    />
  );
}
