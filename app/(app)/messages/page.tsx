'use client';

import { MessageSquare } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function MessagesPage() {
  return (
    <PlaceholderPage
      title="Messages"
      description="Secure messaging with patients and care team members"
      icon={MessageSquare}
      features={[
        'Send and receive secure messages with patients',
        'Message care team members internally',
        'Attach files and link to patient records',
        'Set message priority and follow-up flags',
      ]}
      mockRows={[
        { label: 'Jordan Avery', value: '2 new messages', badge: 'Unread', badgeTone: 'warning' },
        { label: 'Dr. Priya Nair', value: '1 new message', badge: 'Unread', badgeTone: 'warning' },
        { label: 'Maria Sato', value: 'No new messages', badge: 'Read', badgeTone: 'success' },
        { label: 'Care team group', value: '3 new messages', badge: 'Unread', badgeTone: 'warning' },
      ]}
    />
  );
}
