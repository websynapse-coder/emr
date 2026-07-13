'use client';

import { Users } from 'lucide-react';
import { PlaceholderPage } from '@/components/placeholder-page';

export default function UsersPage() {
  return (
    <PlaceholderPage
      title="Users & Roles"
      description="Manage user accounts, role assignments, and access permissions"
      icon={Users}
      features={[
        'Invite new users and assign roles',
        'Manage role-based access controls (RBAC)',
        'View audit trails for user actions',
        'Deactivate or suspend user accounts',
      ]}
      mockRows={[
        { label: 'Dr. Priya Nair', value: 'Clinical Supervisor', badge: 'Active', badgeTone: 'success' },
        { label: 'Maya Castellanos', value: 'Associate Provider', badge: 'Active', badgeTone: 'success' },
        { label: 'James Park', value: 'Biller', badge: 'Active', badgeTone: 'success' },
        { label: 'Sarah Chen', value: 'Practice Manager', badge: 'Active', badgeTone: 'success' },
        { label: 'Mike Torres', value: 'Front Desk', badge: 'Active', badgeTone: 'success' },
      ]}
    />
  );
}
