'use client';

import { CalendarDays } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function AppointmentsPage() {
  return (
    <PlaceholderPage
      title="My Appointments"
      description="View your upcoming and past appointments"
      icon={CalendarDays}
      features={[
        'View upcoming and past sessions in one place',
        'Join telehealth sessions directly from the portal',
        'Request to reschedule or cancel appointments',
        'View session summaries and provider notes',
      ]}
      mockRows={[
        { label: 'Jul 13, 9:00 AM', value: 'Dr. Nair — Telehealth', badge: 'Upcoming', badgeTone: 'info' },
        { label: 'Jul 16, 10:00 AM', value: 'Dr. Nair — In-Person', badge: 'Upcoming', badgeTone: 'info' },
        { label: 'Jul 7, 9:00 AM', value: 'Dr. Nair — Telehealth', badge: 'Completed', badgeTone: 'success' },
        { label: 'Jun 30, 9:00 AM', value: 'Dr. Nair — Telehealth', badge: 'Completed', badgeTone: 'success' },
      ]}
    />
  );
}
