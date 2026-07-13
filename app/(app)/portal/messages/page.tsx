'use client';

import { MessageSquare } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function PortalMessagesPage() {
  return (
    <PlaceholderPage
      title="Messages"
      description="Secure messaging with your care team"
      icon={MessageSquare}
      features={[
        'Send and receive secure messages with your providers',
        'View message history by conversation',
        'Receive appointment reminders and follow-ups',
        'Attach documents to messages',
      ]}
      mockRows={[
        { label: 'Dr. Priya Nair', value: 'Last: Jul 10', badge: '2 unread', badgeTone: 'warning' },
        { label: 'Care Team', value: 'Last: Jul 8', badge: '1 unread', badgeTone: 'warning' },
        { label: 'Billing Office', value: 'Last: Jul 5', badge: 'Read', badgeTone: 'success' },
      ]}
    />
  );
}
