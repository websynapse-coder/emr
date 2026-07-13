'use client';

import { ListTodo } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function TasksPage() {
  return (
    <PlaceholderPage
      title="Tasks"
      description="Track clinical and administrative tasks assigned to you"
      icon={ListTodo}
      features={[
        'View tasks assigned to you and your team',
        'Create and assign tasks with due dates',
        'Link tasks to patients and clinical notes',
        'Filter by priority, status, and due date',
      ]}
      mockRows={[
        { label: 'Sign note — Jordan Avery', value: 'Due today', badge: 'Urgent', badgeTone: 'danger' },
        { label: 'Review lab results — Devon Park', value: 'Due Jul 14', badge: 'Pending', badgeTone: 'warning' },
        { label: 'Treatment plan update — Maria Sato', value: 'Due Jul 16', badge: 'Upcoming', badgeTone: 'info' },
        { label: 'Call back — Emma Rios guardian', value: 'Due Jul 15', badge: 'Pending', badgeTone: 'warning' },
      ]}
    />
  );
}
