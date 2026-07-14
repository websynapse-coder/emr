/**
 * Mock data for the Moonaria frontend prototype.
 *
 * No backend, no real API calls, no real auth — these are in-memory fixtures
 * used to populate the sidebar, org switcher, and role switcher. Real screens
 * will be built in later steps.
 */

export type Role =
  | 'org-owner'
  | 'practice-manager'
  | 'provider'
  | 'clinical-supervisor'
  | 'biller'
  | 'front-desk'
  | 'patient';

export const ROLE_LABELS: Record<Role, string> = {
  'org-owner': 'Org Owner / Admin',
  'practice-manager': 'Practice Manager',
  provider: 'Provider',
  'clinical-supervisor': 'Clinical Supervisor',
  biller: 'Biller',
  'front-desk': 'Front Desk',
  patient: 'Patient',
};

export const ROLE_ORDER: Role[] = [
  'org-owner',
  'practice-manager',
  'provider',
  'clinical-supervisor',
  'biller',
  'front-desk',
  'patient',
];

/* ------------------------------------------------------------------ */
/*  Organizations                                                      */
/* ------------------------------------------------------------------ */

export interface Organization {
  id: string;
  name: string;
  shortName: string;
  /** Two-letter initials used in the sidebar logo tile. */
  initials: string;
  /** Hue hint for the org's brand accent (unused by tokens, kept for future). */
  tagline: string;
  /** Active subscription plan. */
  plan: 'starter' | 'professional' | 'enterprise';
  /** Number of providers on the org (mock). */
  providerCount: number;
}

export const organizations: Organization[] = [
  {
    id: 'org-harborline',
    name: 'Harborline Behavioral Health',
    shortName: 'Harborline',
    initials: 'HB',
    tagline: 'Outpatient & IOP across the Pacific Northwest',
    plan: 'professional',
    providerCount: 12,
  },
  {
    id: 'org-solace',
    name: 'Solace Community Counseling',
    shortName: 'Solace',
    initials: 'SC',
    tagline: 'Community mental health serving 4 counties',
    plan: 'professional',
    providerCount: 8,
  },
  {
    id: 'org-northpoint',
    name: 'Northpoint Psychiatry Group',
    shortName: 'Northpoint',
    initials: 'NP',
    tagline: 'Psychiatry & medication management',
    plan: 'enterprise',
    providerCount: 34,
  },
];

/* ------------------------------------------------------------------ */
/*  Users                                                              */
/* ------------------------------------------------------------------ */

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string;
  /** Job title shown in the role switcher / sidebar. */
  title: string;
  /** Two-letter initials for the avatar fallback. */
  initials: string;
}

export const users: User[] = [
  {
    id: 'user-001',
    name: 'Dana Whitlock',
    email: 'dana.whitlock@harborline.org',
    role: 'org-owner',
    orgId: 'org-harborline',
    title: 'Organization Owner',
    initials: 'DW',
  },
  {
    id: 'user-002',
    name: 'Marcus Reyes',
    email: 'marcus.reyes@harborline.org',
    role: 'practice-manager',
    orgId: 'org-harborline',
    title: 'Practice Manager',
    initials: 'MR',
  },
  {
    id: 'user-003',
    name: 'Dr. Priya Nair',
    email: 'priya.nair@harborline.org',
    role: 'provider',
    orgId: 'org-harborline',
    title: 'Licensed Psychologist',
    initials: 'PN',
  },
  {
    id: 'user-004',
    name: 'Dr. Eli Brennan',
    email: 'eli.brennan@harborline.org',
    role: 'provider',
    orgId: 'org-harborline',
    title: 'Psychiatrist',
    initials: 'EB',
  },
  {
    id: 'user-005',
    name: 'Sandra Okafor',
    email: 'sandra.okafor@harborline.org',
    role: 'clinical-supervisor',
    orgId: 'org-harborline',
    title: 'Clinical Supervisor',
    initials: 'SO',
  },
  {
    id: 'user-006',
    name: 'Tomás Aguilar',
    email: 'tomas.aguilar@harborline.org',
    role: 'biller',
    orgId: 'org-harborline',
    title: 'Billing Specialist',
    initials: 'TA',
  },
  {
    id: 'user-007',
    name: 'Hannah Lindqvist',
    email: 'hannah.lindqvist@harborline.org',
    role: 'front-desk',
    orgId: 'org-harborline',
    title: 'Front Desk Coordinator',
    initials: 'HL',
  },
  {
    id: 'user-008',
    name: 'Jordan Avery',
    email: 'jordan.avery@example.org',
    role: 'patient',
    orgId: 'org-harborline',
    title: 'Patient',
    initials: 'JA',
  },
  {
    id: 'user-009',
    name: 'Maya Castellanos',
    email: 'maya.castellanos@harborline.org',
    role: 'provider',
    orgId: 'org-harborline',
    title: 'Associate Therapist (LPC Intern)',
    initials: 'MC',
  },
  {
    id: 'user-010',
    name: 'Greg Tanaka',
    email: 'greg.tanaka@harborline.org',
    role: 'provider',
    orgId: 'org-harborline',
    title: 'LCSW',
    initials: 'GT',
  },
  {
    id: 'user-011',
    name: 'Aisha Rahman',
    email: 'aisha.rahman@solace.org',
    role: 'practice-manager',
    orgId: 'org-solace',
    title: 'Practice Manager',
    initials: 'AR',
  },
];

/* ------------------------------------------------------------------ */
/*  Per-role navigation items                                          */
/* ------------------------------------------------------------------ */

export interface NavItem {
  /** Stable id used as the React key and (future) route segment. */
  id: string;
  label: string;
  /** Lucide icon name — resolved in the sidebar via the icon registry. */
  icon: string;
  /** Badge count (e.g. unread, due). Omit when not applicable. */
  badge?: number;
  /** Route path. Defaults to `/<id>` when omitted. */
  href?: string;
}

/**
 * Navigation items shown in the sidebar for each role. These are stubs — the
 * actual screens will be built in later steps. Every role gets a "Dashboard"
 * entry as the landing page; the rest are role-specific.
 */
export const navByRole: Record<Role, NavItem[]> = {
  'org-owner': [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
    { id: 'financials', label: 'Financials', icon: 'BarChart3', href: '/financials' },
    { id: 'team', label: 'Team', icon: 'Users', href: '/team' },
    { id: 'providers', label: 'Providers', icon: 'Stethoscope', href: '/providers' },
    { id: 'billing-org', label: 'Billing', icon: 'CreditCard', href: '/billing-org' },
    { id: 'compliance', label: 'Compliance', icon: 'ShieldCheck', href: '/compliance' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3', href: '/reports' },
    { id: 'settings-org', label: 'Settings', icon: 'Settings', href: '/settings-org' },
  ],
  'practice-manager': [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
    { id: 'schedule', label: 'Schedule', icon: 'CalendarDays', href: '/schedule' },
    { id: 'providers', label: 'Providers', icon: 'Stethoscope', href: '/providers' },
    { id: 'patients', label: 'Patients', icon: 'Users', href: '/patients' },
    { id: 'team', label: 'Team', icon: 'Users', href: '/team' },
    { id: 'intake', label: 'Intake', icon: 'ClipboardList', href: '/intake' },
    { id: 'billing-mgr', label: 'Billing', icon: 'CreditCard', href: '/billing-mgr' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3', href: '/reports' },
    { id: 'settings-mgr', label: 'Settings', icon: 'Settings', href: '/settings-mgr' },
  ],
  provider: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
    { id: 'schedule', label: 'My Schedule', icon: 'CalendarDays', href: '/schedule' },
    { id: 'patients', label: 'My Patients', icon: 'Users', href: '/patients' },
    { id: 'notes', label: 'Clinical Notes', icon: 'FileText', href: '/notes' },
    { id: 'treatment', label: 'Treatment Plans', icon: 'ClipboardPenLine', href: '/treatment' },
    { id: 'e-prescribe', label: 'e-Prescribe', icon: 'Pill', href: '/e-prescribe' },
    { id: 'tasks', label: 'Tasks', icon: 'ListTodo', badge: 4, href: '/tasks' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare', badge: 2, href: '/messages' },
  ],
  'clinical-supervisor': [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
    { id: 'supervision', label: 'Supervision', icon: 'GraduationCap', href: '/supervision' },
    { id: 'cases', label: 'Case Review', icon: 'FolderSearch', href: '/cases' },
    { id: 'notes-review', label: 'Notes to Review', icon: 'FileCheck2', href: '/notes-review', badge: 1 },
    { id: 'schedule', label: 'Schedule', icon: 'CalendarDays', href: '/schedule' },
    { id: 'trainees', label: 'Trainees', icon: 'Users', href: '/trainees' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3', href: '/reports' },
  ],
  biller: [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
    { id: 'charges', label: 'Charges', icon: 'Receipt', href: '/billing/charges' },
    { id: 'claims', label: 'Claims', icon: 'FileText', href: '/billing/claims' },
    { id: 'remittance', label: 'Remittance & Payout', icon: 'Wallet', href: '/billing/remittance' },
    { id: 'denials', label: 'Denials', icon: 'AlertTriangle', badge: 1, href: '/denials' },
    { id: 'eligibility', label: 'Eligibility', icon: 'BadgeCheck', href: '/eligibility' },
    { id: 'statements', label: 'Statements', icon: 'ReceiptText', href: '/statements' },
    { id: 'reports', label: 'Reports', icon: 'BarChart3', href: '/reports' },
  ],
  'front-desk': [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', href: '/dashboard' },
    { id: 'schedule', label: 'Schedule', icon: 'CalendarDays', href: '/schedule' },
    { id: 'check-in', label: 'Check-In', icon: 'UserCheck', href: '/check-in' },
    { id: 'patients', label: 'Patients', icon: 'Users', href: '/patients' },
    { id: 'intake', label: 'Intake', icon: 'ClipboardList', href: '/intake' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare', badge: 5, href: '/messages' },
  ],
  patient: [
    { id: 'portal', label: 'Home', icon: 'LayoutDashboard', href: '/portal' },
    { id: 'appointments', label: 'Appointments', icon: 'CalendarDays', href: '/portal/appointments' },
    { id: 'care-team', label: 'My Care Team', icon: 'Users', href: '/portal/care-team' },
    { id: 'documents', label: 'Documents', icon: 'FolderOpen', href: '/portal/documents' },
    { id: 'messages', label: 'Messages', icon: 'MessageSquare', href: '/portal/messages' },
    { id: 'billing-patient', label: 'Billing', icon: 'CreditCard', href: '/portal/billing' },
  ],
};

/* ------------------------------------------------------------------ */
/*  Plans                                                              */
/* ------------------------------------------------------------------ */

export interface Plan {
  id: 'starter' | 'professional' | 'enterprise';
  name: string;
  pricePerMonth: number;
  tagline: string;
  features: string[];
  highlighted?: boolean;
}

export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    pricePerMonth: 199,
    tagline: 'For solo practices getting started',
    features: [
      'Up to 3 providers',
      'Core scheduling & charting',
      '1 practice location',
      'Email support',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    pricePerMonth: 499,
    tagline: 'For growing multi-discipline groups',
    highlighted: true,
    features: [
      'Up to 25 providers',
      'Claims & billing module',
      'Up to 5 practice locations',
      'Payer credentialing tracking',
      'Priority support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    pricePerMonth: 0,
    tagline: 'For large orgs with custom needs',
    features: [
      'Unlimited providers',
      'Multi-org hierarchy',
      'Unlimited locations',
      'SSO & audit logs',
      'Dedicated success manager',
      'Custom integrations',
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Payers                                                             */
/* ------------------------------------------------------------------ */

export type CredentialingStatus =
  | 'credentialed'
  | 'pending'
  | 'not-credentialed';

export const CREDENTIALING_STATUS_LABELS: Record<CredentialingStatus, string> = {
  credentialed: 'Credentialed',
  pending: 'Pending',
  'not-credentialed': 'Not Credentialed',
};

export interface PayerCredential {
  payerId: string;
  payerName: string;
  status: CredentialingStatus;
}

export const samplePayers: { id: string; name: string }[] = [
  { id: 'payer-aetna', name: 'Aetna' },
  { id: 'payer-blueshield', name: 'Blue Shield of California' },
  { id: 'payer-cigna', name: 'Cigna' },
  { id: 'payer-medicaid', name: 'State Medicaid' },
  { id: 'payer-medicare', name: 'Medicare Part B' },
];

/* ------------------------------------------------------------------ */
/*  Providers (extended profile data)                                  */
/* ------------------------------------------------------------------ */

export interface ProviderProfile {
  /** Matches the user id in `users`. */
  userId: string;
  npi: string;
  licenseNumber: string;
  licenseState: string;
  taxonomyCode: string;
  /** Associate-level / intern providers need a supervisor. */
  isAssociate: boolean;
  /** userId of the supervising licensed provider (null for non-associates). */
  supervisorId: string | null;
  /** Per-payer credentialing status. */
  credentials: PayerCredential[];
  /** Profile completion 0-100. */
  completion: number;
}

export const providerProfiles: ProviderProfile[] = [
  {
    userId: 'user-003',
    npi: '1486793210',
    licenseNumber: 'PSY-29381',
    licenseState: 'OR',
    taxonomyCode: '103T00000X',
    isAssociate: false,
    supervisorId: null,
    completion: 100,
    credentials: [
      { payerId: 'payer-aetna', payerName: 'Aetna', status: 'credentialed' },
      { payerId: 'payer-blueshield', payerName: 'Blue Shield of California', status: 'credentialed' },
      { payerId: 'payer-cigna', payerName: 'Cigna', status: 'pending' },
      { payerId: 'payer-medicaid', payerName: 'State Medicaid', status: 'credentialed' },
      { payerId: 'payer-medicare', payerName: 'Medicare Part B', status: 'not-credentialed' },
    ],
  },
  {
    userId: 'user-004',
    npi: '1938472010',
    licenseNumber: 'MD-77321',
    licenseState: 'WA',
    taxonomyCode: '2084P0800X',
    isAssociate: false,
    supervisorId: null,
    completion: 100,
    credentials: [
      { payerId: 'payer-aetna', payerName: 'Aetna', status: 'credentialed' },
      { payerId: 'payer-blueshield', payerName: 'Blue Shield of California', status: 'credentialed' },
      { payerId: 'payer-cigna', payerName: 'Cigna', status: 'credentialed' },
      { payerId: 'payer-medicaid', payerName: 'State Medicaid', status: 'credentialed' },
      { payerId: 'payer-medicare', payerName: 'Medicare Part B', status: 'credentialed' },
    ],
  },
  {
    userId: 'user-009',
    npi: '1726403928',
    licenseNumber: 'LPC-10432',
    licenseState: 'OR',
    taxonomyCode: '101Y00000X',
    isAssociate: true,
    supervisorId: 'user-003',
    completion: 60,
    credentials: [
      { payerId: 'payer-aetna', payerName: 'Aetna', status: 'pending' },
      { payerId: 'payer-blueshield', payerName: 'Blue Shield of California', status: 'not-credentialed' },
      { payerId: 'payer-cigna', payerName: 'Cigna', status: 'not-credentialed' },
      { payerId: 'payer-medicaid', payerName: 'State Medicaid', status: 'pending' },
      { payerId: 'payer-medicare', payerName: 'Medicare Part B', status: 'not-credentialed' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Team invites                                                       */
/* ------------------------------------------------------------------ */

export type InviteStatus = 'pending' | 'accepted' | 'expired';

export interface TeamInvite {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: InviteStatus;
  invitedAt: string;
}

export const teamInvites: TeamInvite[] = [
  {
    id: 'inv-001',
    email: 'rachel.kim@harborline.org',
    name: 'Rachel Kim',
    role: 'provider',
    status: 'pending',
    invitedAt: '2026-07-08',
  },
  {
    id: 'inv-002',
    email: 'noah.foster@harborline.org',
    name: 'Noah Foster',
    role: 'biller',
    status: 'pending',
    invitedAt: '2026-07-09',
  },
  {
    id: 'inv-003',
    email: 'lily.chen@harborline.org',
    name: 'Lily Chen',
    role: 'front-desk',
    status: 'accepted',
    invitedAt: '2026-07-01',
  },
];

/* ------------------------------------------------------------------ */
/*  Org-level stats (admin dashboard)                                  */
/* ------------------------------------------------------------------ */

export interface OrgStats {
  activeProviders: number;
  sessionsThisMonth: number;
  claimsPending: number;
  openTasks: number;
}

export const orgStats: OrgStats = {
  activeProviders: 12,
  sessionsThisMonth: 342,
  claimsPending: 18,
  openTasks: 7,
};

/* ------------------------------------------------------------------ */
/*  Patients                                                           */
/* ------------------------------------------------------------------ */

export type PatientStatus = 'pre-admission' | 'admitted' | 'active' | 'discharged';

export type AdmissionStep =
  | 'demographics'
  | 'insurance'
  | 'eligibility'
  | 'intake-forms'
  | 'review'
  | 'admit';

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  isMinor: boolean;
  guardianName?: string;
  payerId: string;
  memberId: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  groupNumber?: string;
  status?: PatientStatus;
  assignedProviderId?: string;
  admissionProgress?: AdmissionStep[];
  submittedFormIds?: string[];
  createdAt?: string;
}

export const patients: Patient[] = [
  {
    id: 'pt-001',
    name: 'Jordan Avery',
    dateOfBirth: '1992-03-14',
    isMinor: false,
    payerId: 'payer-aetna',
    memberId: 'AET-12-3456',
    gender: 'Male',
    phone: '(510) 555-0142',
    email: 'jordan.avery@email.com',
    address: '1428 Linden St, Oakland, CA 94607',
    emergencyContactName: 'Casey Avery',
    emergencyContactPhone: '(510) 555-0143',
    groupNumber: 'GRP-AET-001',
    status: 'active',
    assignedProviderId: 'user-003',
    admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'],
    submittedFormIds: ['form-demo', 'form-hipaa', 'form-medical', 'form-consent', 'form-roi'],
    createdAt: '2026-05-15',
  },
  {
    id: 'pt-002',
    name: 'Maria Sato',
    dateOfBirth: '1985-07-22',
    isMinor: false,
    payerId: 'payer-blueshield',
    memberId: 'BSC-778821',
    gender: 'Female',
    phone: '(510) 555-0150',
    email: 'maria.sato@email.com',
    address: '920 Ashby Ave, Berkeley, CA 94703',
    emergencyContactName: 'Kenji Sato',
    emergencyContactPhone: '(510) 555-0151',
    groupNumber: 'GRP-BSC-200',
    status: 'active',
    assignedProviderId: 'user-009',
    admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'],
    submittedFormIds: ['form-demo', 'form-hipaa', 'form-medical', 'form-consent', 'form-roi'],
    createdAt: '2026-05-20',
  },
  {
    id: 'pt-003',
    name: 'Devon Park',
    dateOfBirth: '1990-11-08',
    isMinor: false,
    payerId: 'payer-cigna',
    memberId: 'CGN-902340',
    gender: 'Male',
    phone: '(503) 555-0160',
    email: 'devon.park@email.com',
    address: '515 NW Marshall St, Portland, OR 97209',
    emergencyContactName: 'Lisa Park',
    emergencyContactPhone: '(503) 555-0161',
    groupNumber: 'GRP-CGN-500',
    status: 'active',
    assignedProviderId: 'user-004',
    admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'],
    submittedFormIds: ['form-demo', 'form-hipaa', 'form-medical', 'form-consent'],
    createdAt: '2026-06-01',
  },
  {
    id: 'pt-004',
    name: 'Emma Rios',
    dateOfBirth: '2012-05-19',
    isMinor: true,
    guardianName: 'Lucia Rios',
    payerId: 'payer-medicaid',
    memberId: 'MCD-44712',
    gender: 'Female',
    phone: '(510) 555-0170',
    email: 'lucia.rios@email.com',
    address: '330 Fruitvale Ave, Oakland, CA 94601',
    emergencyContactName: 'Lucia Rios',
    emergencyContactPhone: '(510) 555-0170',
    status: 'active',
    assignedProviderId: 'user-003',
    admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'],
    submittedFormIds: ['form-demo', 'form-hipaa', 'form-medical', 'form-consent', 'form-roi'],
    createdAt: '2026-06-10',
  },
  {
    id: 'pt-005',
    name: 'The Chen Family',
    dateOfBirth: '—',
    isMinor: false,
    payerId: 'payer-blueshield',
    memberId: 'BSC-553210',
    status: 'active',
    assignedProviderId: 'user-003',
    admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'],
    createdAt: '2026-06-15',
  },
  {
    id: 'pt-006',
    name: 'Noah Williams',
    dateOfBirth: '2010-09-03',
    isMinor: true,
    guardianName: 'Sarah Williams',
    payerId: 'payer-aetna',
    memberId: 'AET-44-8892',
    gender: 'Male',
    phone: '(510) 555-0180',
    email: 'sarah.williams@email.com',
    address: '770 Telegraph Ave, Oakland, CA 94612',
    emergencyContactName: 'Sarah Williams',
    emergencyContactPhone: '(510) 555-0180',
    status: 'active',
    assignedProviderId: 'user-003',
    admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'],
    submittedFormIds: ['form-demo', 'form-hipaa', 'form-medical', 'form-consent'],
    createdAt: '2026-06-20',
  },
  {
    id: 'pt-007',
    name: 'Aaliyah Johnson',
    dateOfBirth: '1998-12-01',
    isMinor: false,
    payerId: 'payer-medicaid',
    memberId: 'MCD-88201',
    gender: 'Female',
    phone: '(510) 555-0190',
    email: 'aaliyah.j@email.com',
    address: '210 Adeline St, Oakland, CA 94607',
    emergencyContactName: 'Michael Johnson',
    emergencyContactPhone: '(510) 555-0191',
    status: 'active',
    assignedProviderId: 'user-009',
    admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'],
    submittedFormIds: ['form-demo', 'form-hipaa', 'form-medical', 'form-consent', 'form-roi'],
    createdAt: '2026-06-25',
  },
  {
    id: 'pt-008',
    name: 'Marcus & Devin Cole',
    dateOfBirth: '—',
    isMinor: false,
    payerId: 'payer-cigna',
    memberId: 'CGN-11023',
    status: 'active',
    assignedProviderId: 'user-004',
    admissionProgress: ['demographics', 'insurance', 'eligibility', 'intake-forms', 'review', 'admit'],
    createdAt: '2026-07-01',
  },
];

export function getPatient(id: string): Patient | undefined {
  return patients.find((p) => p.id === id);
}

/* ------------------------------------------------------------------ */
/*  Appointments                                                       */
/* ------------------------------------------------------------------ */

export type SessionType = 'telehealth' | 'in-person';
export type SessionModality = 'individual' | 'couple' | 'family';
export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no-show'
  | 'in-progress';

export interface SessionParticipant {
  /** Display name for this participant. */
  name: string;
  /** Role in the session: patient, partner, parent, child, etc. */
  role: string;
  /** Whether this participant is a minor. */
  isMinor: boolean;
  /** Guardian name (only for minors). */
  guardianName?: string;
  /** Consent status. */
  consent: 'pending' | 'signed';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  /** ISO date string, e.g. "2026-07-13". */
  date: string;
  /** 24h start time, e.g. "09:00". */
  startTime: string;
  /** Duration in minutes. */
  durationMinutes: number;
  sessionType: SessionType;
  modality: SessionModality;
  status: AppointmentStatus;
  /** Participants for consent gate (only populated for sessions that need it). */
  participants?: SessionParticipant[];
  /** Eligibility check result. */
  eligibility?: {
    status: 'active' | 'inactive' | 'copay';
    copay?: number;
    payerName: string;
  };
}

/**
 * Appointments anchored to the week of 2026-07-13 (Mon) through 2026-07-19 (Sun)
 * so the week view always has data. A few past appointments from the prior week
 * are included for completed-session encounters.
 */
export const appointments: Appointment[] = [
  // --- Prior week (completed) ---
  {
    id: 'apt-001',
    patientId: 'pt-001',
    patientName: 'Jordan Avery',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-07',
    startTime: '09:00',
    durationMinutes: 50,
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'completed',
    eligibility: { status: 'active', payerName: 'Aetna' },
  },
  {
    id: 'apt-002',
    patientId: 'pt-002',
    patientName: 'Maria Sato',
    providerId: 'user-009',
    providerName: 'Maya Castellanos',
    date: '2026-07-08',
    startTime: '10:00',
    durationMinutes: 45,
    sessionType: 'in-person',
    modality: 'individual',
    status: 'completed',
    eligibility: { status: 'copay', copay: 30, payerName: 'Blue Shield of California' },
  },
  {
    id: 'apt-003',
    patientId: 'pt-004',
    patientName: 'Emma Rios',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-09',
    startTime: '14:00',
    durationMinutes: 50,
    sessionType: 'in-person',
    modality: 'family',
    status: 'completed',
    eligibility: { status: 'active', payerName: 'State Medicaid' },
  },
  {
    id: 'apt-004',
    patientId: 'pt-003',
    patientName: 'Devon Park',
    providerId: 'user-004',
    providerName: 'Dr. Eli Brennan',
    date: '2026-07-10',
    startTime: '11:00',
    durationMinutes: 30,
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'no-show',
    eligibility: { status: 'active', payerName: 'Cigna' },
  },

  // --- Current week (Mon 2026-07-13 through Sun 2026-07-19) ---
  {
    id: 'apt-005',
    patientId: 'pt-001',
    patientName: 'Jordan Avery',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-13',
    startTime: '09:00',
    durationMinutes: 50,
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'Aetna' },
  },
  {
    id: 'apt-006',
    patientId: 'pt-002',
    patientName: 'Maria Sato',
    providerId: 'user-009',
    providerName: 'Maya Castellanos',
    date: '2026-07-13',
    startTime: '10:30',
    durationMinutes: 45,
    sessionType: 'in-person',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'copay', copay: 30, payerName: 'Blue Shield of California' },
  },
  {
    id: 'apt-007',
    patientId: 'pt-003',
    patientName: 'Devon Park',
    providerId: 'user-004',
    providerName: 'Dr. Eli Brennan',
    date: '2026-07-13',
    startTime: '13:00',
    durationMinutes: 30,
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'Cigna' },
  },
  {
    id: 'apt-008',
    patientId: 'pt-005',
    patientName: 'The Chen Family',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-14',
    startTime: '09:00',
    durationMinutes: 75,
    sessionType: 'in-person',
    modality: 'family',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'Blue Shield of California' },
  },
  {
    id: 'apt-009',
    patientId: 'pt-004',
    patientName: 'Emma Rios',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-14',
    startTime: '11:00',
    durationMinutes: 50,
    sessionType: 'in-person',
    modality: 'family',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'State Medicaid' },
  },
  {
    id: 'apt-010',
    patientId: 'pt-007',
    patientName: 'Aaliyah Johnson',
    providerId: 'user-009',
    providerName: 'Maya Castellanos',
    date: '2026-07-14',
    startTime: '14:00',
    durationMinutes: 50,
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'State Medicaid' },
  },
  {
    id: 'apt-011',
    patientId: 'pt-006',
    patientName: 'Noah Williams',
    providerId: 'user-004',
    providerName: 'Dr. Eli Brennan',
    date: '2026-07-15',
    startTime: '09:30',
    durationMinutes: 45,
    sessionType: 'in-person',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'copay', copay: 20, payerName: 'Aetna' },
  },
  {
    id: 'apt-012',
    patientId: 'pt-008',
    patientName: 'Marcus & Devin Cole',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-15',
    startTime: '11:00',
    durationMinutes: 60,
    sessionType: 'telehealth',
    modality: 'couple',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'Cigna' },
  },
  {
    id: 'apt-013',
    patientId: 'pt-001',
    patientName: 'Jordan Avery',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-16',
    startTime: '10:00',
    durationMinutes: 50,
    sessionType: 'in-person',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'Aetna' },
  },
  {
    id: 'apt-014',
    patientId: 'pt-002',
    patientName: 'Maria Sato',
    providerId: 'user-009',
    providerName: 'Maya Castellanos',
    date: '2026-07-16',
    startTime: '13:30',
    durationMinutes: 45,
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'inactive', payerName: 'Blue Shield of California' },
  },
  {
    id: 'apt-015',
    patientId: 'pt-007',
    patientName: 'Aaliyah Johnson',
    providerId: 'user-004',
    providerName: 'Dr. Eli Brennan',
    date: '2026-07-17',
    startTime: '09:00',
    durationMinutes: 30,
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'State Medicaid' },
  },
  {
    id: 'apt-016',
    patientId: 'pt-005',
    patientName: 'The Chen Family',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-17',
    startTime: '10:30',
    durationMinutes: 75,
    sessionType: 'in-person',
    modality: 'family',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'Blue Shield of California' },
  },
  {
    id: 'apt-017',
    patientId: 'pt-003',
    patientName: 'Devon Park',
    providerId: 'user-004',
    providerName: 'Dr. Eli Brennan',
    date: '2026-07-17',
    startTime: '14:00',
    durationMinutes: 30,
    sessionType: 'in-person',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'copay', copay: 45, payerName: 'Cigna' },
  },
  {
    id: 'apt-018',
    patientId: 'pt-006',
    patientName: 'Noah Williams',
    providerId: 'user-004',
    providerName: 'Dr. Eli Brennan',
    date: '2026-07-18',
    startTime: '10:00',
    durationMinutes: 45,
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'Aetna' },
  },
  {
    id: 'apt-019',
    patientId: 'pt-008',
    patientName: 'Marcus & Devin Cole',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-18',
    startTime: '13:00',
    durationMinutes: 60,
    sessionType: 'in-person',
    modality: 'couple',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'Cigna' },
  },
  {
    id: 'apt-020',
    patientId: 'pt-001',
    patientName: 'Jordan Avery',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-19',
    startTime: '09:00',
    durationMinutes: 50,
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'scheduled',
    eligibility: { status: 'active', payerName: 'Aetna' },
  },
];

/* ------------------------------------------------------------------ */
/*  Clinical notes                                                     */
/* ------------------------------------------------------------------ */

export type NoteStatus = 'draft' | 'signed' | 'awaiting-cosign' | 'cosigned';

export const NOTE_STATUS_LABELS: Record<NoteStatus, string> = {
  draft: 'Draft',
  signed: 'Signed',
  'awaiting-cosign': 'Awaiting Cosign',
  cosigned: 'Cosigned',
};

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface TranscriptLine {
  speaker: string;
  text: string;
  /** Seconds from session start. */
  timestamp: number;
}

export interface ClinicalNote {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  providerId: string;
  providerName: string;
  /** ISO date. */
  date: string;
  sessionType: SessionType;
  modality: SessionModality;
  status: NoteStatus;
  /** SOAP note content (editable in post-session). */
  soap: SoapNote;
  /** Mock transcript lines. */
  transcript: TranscriptLine[];
  /** Supervisor who needs to cosign (for associate providers). */
  supervisorId?: string;
  supervisorName?: string;
  /** When the note was cosigned (for cosigned status). */
  cosignedAt?: string;
}

export const clinicalNotes: ClinicalNote[] = [
  // Completed session — signed note (Dr. Nair, licensed)
  {
    id: 'note-001',
    appointmentId: 'apt-001',
    patientId: 'pt-001',
    patientName: 'Jordan Avery',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-07',
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'signed',
    soap: {
      subjective:
        'Patient reports decreased anxiety over the past week. States CBT techniques practiced 3x. Sleep improved to 6-7 hrs/night. Denies SI. Reports one panic episode at work on Tuesday.',
      objective:
        'Mental status: alert, oriented x3, cooperative. Speech normal rate and volume. Affect congruent with mood. No psychomotor abnormalities. Insight and judgment fair.',
      assessment:
        'GAD, moderate, improving. PHQ-9 score 8 (mild). GAD-7 score 10 (moderate). Patient responding to CBT + sertraline 50mg. Panic episodes reduced from 3/week to 1/week.',
      plan:
        'Continue sertraline 50mg daily. Continue CBT weekly. Practice diaphragmatic breathing 2x daily. Reassess in 1 week. Crisis line provided. Next session 2026-07-13.',
    },
    transcript: [
      { speaker: 'Dr. Nair', text: 'Hi Jordan, how has your week been since our last session?', timestamp: 0 },
      { speaker: 'Jordan', text: 'Better, actually. I tried the breathing exercises you showed me and I think they helped.', timestamp: 8 },
      { speaker: 'Dr. Nair', text: "That's great to hear. How often were you able to practice them?", timestamp: 16 },
      { speaker: 'Jordan', text: 'Probably three times. I had one panic attack at work on Tuesday but I was able to get through it.', timestamp: 24 },
      { speaker: 'Dr. Nair', text: 'You used the technique during the panic episode?', timestamp: 34 },
      { speaker: 'Jordan', text: 'Yeah. It took about five minutes but I got through it without having to leave.', timestamp: 40 },
      { speaker: 'Dr. Nair', text: "That's real progress. Let's talk about what triggered it and how we can build on this.", timestamp: 50 },
    ],
  },
  // Completed session — awaiting cosign (Maya, associate, supervisor = Dr. Nair)
  {
    id: 'note-002',
    appointmentId: 'apt-002',
    patientId: 'pt-002',
    patientName: 'Maria Sato',
    providerId: 'user-009',
    providerName: 'Maya Castellanos',
    date: '2026-07-08',
    sessionType: 'in-person',
    modality: 'individual',
    status: 'awaiting-cosign',
    supervisorId: 'user-003',
    supervisorName: 'Dr. Priya Nair',
    soap: {
      subjective:
        'Patient presents with persistent low mood and difficulty concentrating at work. Reports feeling "stuck" in her job. Sleep 5 hrs/night. Appetite decreased. Endorses passive SI without plan or intent.',
      objective:
        'Mental status: alert, oriented x3. Speech slightly slowed. Affect flat, mood depressed. Cooperative with interview. No acute distress. Insight good.',
      assessment:
        'MDD, recurrent, moderate, without psychotic features. PHQ-9 score 14 (moderate). Patient is an appropriate candidate for CBT and medication consult. Associate-level provider under supervision of Dr. Nair.',
      plan:
        'Initiate CBT weekly. Refer to psychiatry for medication evaluation. Safety plan completed and reviewed. Crisis line provided. Next session in 1 week. Supervisor cosign required.',
    },
    transcript: [
      { speaker: 'Maya', text: 'Hi Maria, thanks for coming in today. How have you been feeling since last week?', timestamp: 0 },
      { speaker: 'Maria', text: "Honestly, not great. I've been having a hard time getting out of bed some mornings.", timestamp: 8 },
      { speaker: 'Maya', text: "I appreciate you sharing that. Can you tell me more about what those mornings look like?", timestamp: 20 },
      { speaker: 'Maria', text: "I just feel stuck. My job is overwhelming and I can't focus. I lie there for an hour before I get up.", timestamp: 30 },
      { speaker: 'Maya', text: 'It sounds like the exhaustion is affecting your whole day. Have you had any thoughts of not wanting to be here?', timestamp: 44 },
      { speaker: 'Maria', text: 'Sometimes, but I would never do anything. I just wish the feeling would stop.', timestamp: 56 },
      { speaker: 'Maya', text: 'Thank you for being honest with me. I want to make sure you have support. Let us work on a safety plan together today.', timestamp: 68 },
    ],
  },
  // Completed family session — cosigned (Dr. Nair, family)
  {
    id: 'note-003',
    appointmentId: 'apt-003',
    patientId: 'pt-004',
    patientName: 'Emma Rios',
    providerId: 'user-003',
    providerName: 'Dr. Priya Nair',
    date: '2026-07-09',
    sessionType: 'in-person',
    modality: 'family',
    status: 'cosigned',
    supervisorId: 'user-003',
    supervisorName: 'Dr. Priya Nair',
    cosignedAt: '2026-07-09T15:30:00Z',
    soap: {
      subjective:
        'Family session with Emma (14) and mother Lucia. Lucia reports Emma has been more withdrawn over the past month. Emma reports feeling "misunderstood" at home and pressured about school. Both express desire to improve communication.',
      objective:
        'Emma appeared guarded initially, became more engaged as session progressed. Lucia tearful when discussing changes in their relationship. Both willing to participate in structured communication exercise.',
      assessment:
        'Family communication breakdown secondary to adolescent developmental stressors. No safety concerns identified. Family demonstrates capacity for improved communication with structured support.',
      plan:
        'Continue family therapy weekly x4, then reassess. Provide communication skills handout. Individual session with Emma to screen for depression next week. Lucia to practice reflective listening daily.',
    },
    transcript: [
      { speaker: 'Dr. Nair', text: "Lucia, you mentioned Emma has been more withdrawn. What does that look like at home?", timestamp: 0 },
      { speaker: 'Lucia', text: "She stays in her room after school. She used to tell me everything and now I get one-word answers.", timestamp: 10 },
      { speaker: 'Dr. Nair', text: 'Emma, does that match how you see it?', timestamp: 22 },
      { speaker: 'Emma', text: "I just feel like everything I say turns into a lecture. So I stopped saying things.", timestamp: 28 },
      { speaker: 'Lucia', text: "I didn't realize that's how it felt. I'm just worried about you.", timestamp: 40 },
      { speaker: 'Dr. Nair', text: "It sounds like you both want the same thing — to feel close again. Let's practice a way to talk that doesn't feel like a lecture.", timestamp: 50 },
    ],
  },
  // No-show — draft note (placeholder)
  {
    id: 'note-004',
    appointmentId: 'apt-004',
    patientId: 'pt-003',
    patientName: 'Devon Park',
    providerId: 'user-004',
    providerName: 'Dr. Eli Brennan',
    date: '2026-07-10',
    sessionType: 'telehealth',
    modality: 'individual',
    status: 'draft',
    soap: {
      subjective: 'Patient did not attend scheduled appointment. No-show.',
      objective: 'No session conducted. Attempted phone outreach, no answer.',
      assessment: 'No-show. Patient history of inconsistent attendance.',
      plan: 'Outreach to patient to reschedule. Consider care coordination.',
    },
    transcript: [],
  },
];

export function getNoteByAppointment(appointmentId: string): ClinicalNote | undefined {
  return clinicalNotes.find((n) => n.appointmentId === appointmentId);
}

export function getNotesForSupervisor(supervisorId: string): ClinicalNote[] {
  return clinicalNotes.filter(
    (n) => n.supervisorId === supervisorId && n.status === 'awaiting-cosign'
  );
}

/* ------------------------------------------------------------------ */
/*  Session participants (for consent gate)                             */
/* ------------------------------------------------------------------ */

/**
 * Generates the participant list for a given appointment's modality.
 * For family sessions, returns 3-4 named participants including a minor
 * with guardian consent required.
 */
export function getParticipantsForAppointment(appointment: Appointment): SessionParticipant[] {
  const baseConsent = 'pending' as const;

  if (appointment.modality === 'individual') {
    const patient = getPatient(appointment.patientId);
    if (patient?.isMinor) {
      return [
        {
          name: patient.name,
          role: 'Patient (minor)',
          isMinor: true,
          guardianName: patient.guardianName,
          consent: baseConsent,
        },
      ];
    }
    return [
      {
        name: appointment.patientName,
        role: 'Patient',
        isMinor: false,
        consent: baseConsent,
      },
    ];
  }

  if (appointment.modality === 'couple') {
    return [
      { name: 'Marcus Cole', role: 'Partner 1', isMinor: false, consent: baseConsent },
      { name: 'Devin Cole', role: 'Partner 2', isMinor: false, consent: baseConsent },
    ];
  }

  // Family — 3-4 participants with one minor
  return [
    { name: 'Wei Chen', role: 'Parent', isMinor: false, consent: baseConsent },
    { name: 'Mei Chen', role: 'Parent', isMinor: false, consent: baseConsent },
    {
      name: 'Lucas Chen',
      role: 'Child (minor)',
      isMinor: true,
      guardianName: 'Wei Chen',
      consent: baseConsent,
    },
    { name: 'Sophie Chen', role: 'Adolescent', isMinor: false, consent: baseConsent },
  ];
}

/* ------------------------------------------------------------------ */
/*  Eligibility check (mock)                                           */
/* ------------------------------------------------------------------ */

export function mockEligibilityCheck(
  patientId: string
): { status: 'active' | 'inactive' | 'copay'; copay?: number; payerName: string } {
  const patient = getPatient(patientId);
  const payerName =
    samplePayers.find((p) => p.id === patient?.payerId)?.name ?? 'Unknown Payer';

  const results: Array<{ status: 'active' | 'inactive' | 'copay'; copay?: number }> = [
    { status: 'active' },
    { status: 'active' },
    { status: 'copay', copay: 25 },
    { status: 'copay', copay: 40 },
    { status: 'inactive' },
  ];
  // Deterministic-ish pick based on patient id hash
  const hash = patientId.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const pick = results[hash % results.length];
  return { ...pick, payerName };
}

/* ------------------------------------------------------------------ */
/*  Billing: CPT & ICD-10 codes                                        */
/* ------------------------------------------------------------------ */

export interface CptCode {
  code: string;
  description: string;
  /** Standard billing amount in cents. */
  amountCents: number;
}

export const cptCodes: CptCode[] = [
  { code: '90791', description: 'Psychiatric diagnostic evaluation', amountCents: 26700 },
  { code: '90834', description: 'Psychotherapy, 45 min', amountCents: 9800 },
  { code: '90837', description: 'Psychotherapy, 60 min', amountCents: 14100 },
  { code: '90847', description: 'Family psychotherapy', amountCents: 13200 },
  { code: '90853', description: 'Group psychotherapy', amountCents: 8700 },
  { code: '90832', description: 'Psychotherapy, 30 min', amountCents: 7100 },
];

export interface IcdCode {
  code: string;
  description: string;
}

export const icdCodes: IcdCode[] = [
  { code: 'F41.1', description: 'GAD (Generalized Anxiety Disorder)' },
  { code: 'F33.1', description: 'MDD, recurrent, moderate' },
  { code: 'F43.10', description: 'PTSD (unspecified)' },
  { code: 'F90.2', description: 'ADHD, combined type' },
  { code: 'F60.3', description: 'Borderline Personality Disorder' },
  { code: 'Z71.9', description: 'Counseling, unspecified' },
];

/* ------------------------------------------------------------------ */
/*  Charges (auto-generated from signed/cosigned notes)                */
/* ------------------------------------------------------------------ */

export type ChargeStatus = 'ready' | 'submitted' | 'hold';

export interface Charge {
  id: string;
  /** The clinical note this charge was generated from. */
  noteId: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  providerName: string;
  /** Date of service. */
  serviceDate: string;
  cptCode: string;
  icdCode: string;
  amountCents: number;
  status: ChargeStatus;
  /** Payer name. */
  payerName: string;
}

/**
 * Charges are derived from notes with status 'signed' or 'cosigned'.
 * Notes that are 'draft' or 'awaiting-cosign' do NOT produce a charge —
 * reinforcing that unsigned/unapproved notes never produce a billable charge.
 */
export const charges: Charge[] = [
  {
    id: 'chg-001',
    noteId: 'note-001',
    appointmentId: 'apt-001',
    patientId: 'pt-001',
    patientName: 'Jordan Avery',
    providerName: 'Dr. Priya Nair',
    serviceDate: '2026-07-07',
    cptCode: '90837',
    icdCode: 'F41.1',
    amountCents: 14100,
    status: 'submitted',
    payerName: 'Aetna',
  },
  {
    id: 'chg-002',
    noteId: 'note-003',
    appointmentId: 'apt-003',
    patientId: 'pt-004',
    patientName: 'Emma Rios',
    providerName: 'Dr. Priya Nair',
    serviceDate: '2026-07-09',
    cptCode: '90847',
    icdCode: 'Z71.9',
    amountCents: 13200,
    status: 'ready',
    payerName: 'State Medicaid',
  },
  {
    id: 'chg-003',
    noteId: 'note-001',
    appointmentId: 'apt-001',
    patientId: 'pt-001',
    patientName: 'Jordan Avery',
    providerName: 'Dr. Priya Nair',
    serviceDate: '2026-07-07',
    cptCode: '90791',
    icdCode: 'F41.1',
    amountCents: 26700,
    status: 'ready',
    payerName: 'Aetna',
  },
];

/**
 * Returns charges that are billable — i.e. derived from signed or cosigned notes.
 * This function enforces the product rule: unsigned notes never produce a charge.
 */
export function getBillableCharges(): Charge[] {
  return charges.filter((c) => {
    const note = clinicalNotes.find((n) => n.id === c.noteId);
    return note && (note.status === 'signed' || note.status === 'cosigned');
  });
}

/* ------------------------------------------------------------------ */
/*  Claims                                                              */
/* ------------------------------------------------------------------ */

export type ClaimStatus = 'submitted' | 'adjudicated' | 'paid' | 'denied';

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  submitted: 'Submitted',
  adjudicated: 'Adjudicated',
  paid: 'Paid',
  denied: 'Denied',
};

export interface Claim {
  id: string;
  /** Reference to the charge that was submitted. */
  chargeId: string;
  patientName: string;
  patientId: string;
  providerName: string;
  serviceDate: string;
  cptCode: string;
  icdCode: string;
  amountCents: number;
  payerName: string;
  status: ClaimStatus;
  /** When the claim was submitted. */
  submittedAt: string;
  /** When the claim was adjudicated (if applicable). */
  adjudicatedAt?: string;
  /** When the claim was paid or denied (if applicable). */
  resolvedAt?: string;
  /** Denial reason (only for denied claims). */
  denialReason?: string;
  /** Amount paid by payer (for paid claims). */
  paidAmountCents?: number;
  /** Patient responsibility (copay/coinsurance). */
  patientResponsibilityCents?: number;
}

export const claims: Claim[] = [
  {
    id: 'clm-001',
    chargeId: 'chg-001',
    patientName: 'Jordan Avery',
    patientId: 'pt-001',
    providerName: 'Dr. Priya Nair',
    serviceDate: '2026-07-07',
    cptCode: '90837',
    icdCode: 'F41.1',
    amountCents: 14100,
    payerName: 'Aetna',
    status: 'paid',
    submittedAt: '2026-07-08',
    adjudicatedAt: '2026-07-10',
    resolvedAt: '2026-07-11',
    paidAmountCents: 11280,
    patientResponsibilityCents: 2820,
  },
  {
    id: 'clm-002',
    chargeId: 'chg-002',
    patientName: 'Emma Rios',
    patientId: 'pt-004',
    providerName: 'Dr. Priya Nair',
    serviceDate: '2026-07-09',
    cptCode: '90847',
    icdCode: 'Z71.9',
    amountCents: 13200,
    payerName: 'State Medicaid',
    status: 'adjudicated',
    submittedAt: '2026-07-10',
    adjudicatedAt: '2026-07-12',
  },
  {
    id: 'clm-003',
    chargeId: 'chg-003',
    patientName: 'Jordan Avery',
    patientId: 'pt-001',
    providerName: 'Dr. Priya Nair',
    serviceDate: '2026-07-07',
    cptCode: '90791',
    icdCode: 'F41.1',
    amountCents: 26700,
    payerName: 'Aetna',
    status: 'submitted',
    submittedAt: '2026-07-11',
  },
  {
    id: 'clm-004',
    chargeId: 'chg-001',
    patientName: 'Maria Sato',
    patientId: 'pt-002',
    providerName: 'Maya Castellanos',
    serviceDate: '2026-07-01',
    cptCode: '90834',
    icdCode: 'F33.1',
    amountCents: 9800,
    payerName: 'Blue Shield of California',
    status: 'denied',
    submittedAt: '2026-07-02',
    adjudicatedAt: '2026-07-05',
    resolvedAt: '2026-07-05',
    denialReason:
      'CO-97: The benefit for this service is included in the payment for another service. CPT 90834 bundled into E/M code 99213 billed on same date of service.',
  },
  {
    id: 'clm-005',
    chargeId: 'chg-002',
    patientName: 'Devon Park',
    patientId: 'pt-003',
    providerName: 'Dr. Eli Brennan',
    serviceDate: '2026-07-03',
    cptCode: '90837',
    icdCode: 'F43.10',
    amountCents: 14100,
    payerName: 'Cigna',
    status: 'paid',
    submittedAt: '2026-07-04',
    adjudicatedAt: '2026-07-07',
    resolvedAt: '2026-07-09',
    paidAmountCents: 13065,
    patientResponsibilityCents: 1035,
  },
  {
    id: 'clm-006',
    chargeId: 'chg-003',
    patientName: 'Aaliyah Johnson',
    patientId: 'pt-007',
    providerName: 'Dr. Eli Brennan',
    serviceDate: '2026-07-05',
    cptCode: '90832',
    icdCode: 'F90.2',
    amountCents: 7100,
    payerName: 'State Medicaid',
    status: 'adjudicated',
    submittedAt: '2026-07-06',
    adjudicatedAt: '2026-07-10',
  },
];

/* ------------------------------------------------------------------ */
/*  Remittances                                                         */
/* ------------------------------------------------------------------ */

export interface Remittance {
  id: string;
  claimId: string;
  patientName: string;
  payerName: string;
  /** Total claim amount. */
  billedAmountCents: number;
  /** Amount paid by payer. */
  paidAmountCents: number;
  /** Patient responsibility (copay/coinsurance/deductible). */
  patientResponsibilityCents: number;
  /** Date posted to the system. */
  postedDate: string;
  /** Check/EFT reference number. */
  referenceNumber: string;
}

export const remittances: Remittance[] = [
  {
    id: 'rmt-001',
    claimId: 'clm-001',
    patientName: 'Jordan Avery',
    payerName: 'Aetna',
    billedAmountCents: 14100,
    paidAmountCents: 11280,
    patientResponsibilityCents: 2820,
    postedDate: '2026-07-11',
    referenceNumber: 'EFT-AET-20260711-8841',
  },
  {
    id: 'rmt-002',
    claimId: 'clm-005',
    patientName: 'Devon Park',
    payerName: 'Cigna',
    billedAmountCents: 14100,
    paidAmountCents: 13065,
    patientResponsibilityCents: 1035,
    postedDate: '2026-07-09',
    referenceNumber: 'CHK-CGN-20260709-2207',
  },
  {
    id: 'rmt-003',
    claimId: 'clm-001',
    patientName: 'Maria Sato',
    payerName: 'Blue Shield of California',
    billedAmountCents: 9800,
    paidAmountCents: 0,
    patientResponsibilityCents: 9800,
    postedDate: '2026-07-05',
    referenceNumber: 'ERA-BSC-20260705-9912',
  },
];

/* ------------------------------------------------------------------ */
/*  Payout summary (org-level)                                          */
/* ------------------------------------------------------------------ */

export interface PayoutSummary {
  /** Total paid out this period, in cents. */
  totalPaidOutCents: number;
  /** Pending amount not yet disbursed, in cents. */
  pendingCents: number;
  /** Next payout date (ISO). */
  nextPayoutDate: string;
  /** Period label. */
  periodLabel: string;
}

export const payoutSummary: PayoutSummary = {
  totalPaidOutCents: 24345,
  pendingCents: 13200,
  nextPayoutDate: '2026-07-19',
  periodLabel: 'Jul 1 – Jul 15, 2026',
};

/* ------------------------------------------------------------------ */
/*  Consent history (patient-facing)                                    */
/* ------------------------------------------------------------------ */

export interface ConsentRecord {
  id: string;
  /** Patient ID this consent belongs to. */
  patientId: string;
  /** Display name of the participant who signed. */
  participantName: string;
  /** Role in the session. */
  role: string;
  /** Session date (ISO). */
  sessionDate: string;
  /** Provider name. */
  providerName: string;
  /** Session modality. */
  modality: SessionModality;
  /** Consent type. */
  type: 'session-recording' | 'telehealth-consent' | 'general-consent';
  /** When the consent was signed. */
  signedAt: string;
  /** Whether the participant was a minor (guardian signed on their behalf). */
  signedByGuardian: boolean;
  /** Guardian name (if applicable). */
  guardianName?: string;
}

export const consentHistory: ConsentRecord[] = [
  {
    id: 'consent-001',
    patientId: 'pt-001',
    participantName: 'Jordan Avery',
    role: 'Patient',
    sessionDate: '2026-07-07',
    providerName: 'Dr. Priya Nair',
    modality: 'individual',
    type: 'session-recording',
    signedAt: '2026-07-07T09:02:00Z',
    signedByGuardian: false,
  },
  {
    id: 'consent-002',
    patientId: 'pt-001',
    participantName: 'Jordan Avery',
    role: 'Patient',
    sessionDate: '2026-06-30',
    providerName: 'Dr. Priya Nair',
    modality: 'individual',
    type: 'session-recording',
    signedAt: '2026-06-30T09:01:00Z',
    signedByGuardian: false,
  },
  {
    id: 'consent-003',
    patientId: 'pt-001',
    participantName: 'Jordan Avery',
    role: 'Patient',
    sessionDate: '2026-06-23',
    providerName: 'Dr. Priya Nair',
    modality: 'individual',
    type: 'telehealth-consent',
    signedAt: '2026-06-23T09:00:00Z',
    signedByGuardian: false,
  },
  // Emma Rios (minor) — guardian consent
  {
    id: 'consent-004',
    patientId: 'pt-004',
    participantName: 'Emma Rios',
    role: 'Patient (minor)',
    sessionDate: '2026-07-09',
    providerName: 'Dr. Priya Nair',
    modality: 'family',
    type: 'session-recording',
    signedAt: '2026-07-09T14:03:00Z',
    signedByGuardian: true,
    guardianName: 'Lucia Rios',
  },
  {
    id: 'consent-005',
    patientId: 'pt-004',
    participantName: 'Lucia Rios',
    role: 'Parent',
    sessionDate: '2026-07-09',
    providerName: 'Dr. Priya Nair',
    modality: 'family',
    type: 'session-recording',
    signedAt: '2026-07-09T14:01:00Z',
    signedByGuardian: false,
  },
];

export function getConsentHistoryForPatient(patientId: string): ConsentRecord[] {
  return consentHistory.filter((c) => c.patientId === patientId);
}

/* ------------------------------------------------------------------ */
/*  Patient billing (patient-facing)                                   */
/* ------------------------------------------------------------------ */

export interface PatientBillItem {
  id: string;
  patientId: string;
  /** Description of the charge. */
  description: string;
  /** Date of service. */
  serviceDate: string;
  /** Total charge in cents. */
  billedCents: number;
  /** Amount paid by insurance in cents. */
  insurancePaidCents: number;
  /** Patient responsibility in cents (copay/coinsurance/deductible). */
  patientResponsibilityCents: number;
  /** Amount patient has already paid. */
  patientPaidCents: number;
  /** Status of this bill item. */
  status: 'paid' | 'balance-due' | 'denied' | 'pending';
  /** Payer name. */
  payerName: string;
  /** Related claim ID (if any). */
  claimId?: string;
}

export const patientBillItems: PatientBillItem[] = [
  // Jordan Avery — happy path (claim paid, patient owes copay)
  {
    id: 'pbi-001',
    patientId: 'pt-001',
    description: 'Psychotherapy, 60 min (CPT 90837)',
    serviceDate: '2026-07-07',
    billedCents: 14100,
    insurancePaidCents: 11280,
    patientResponsibilityCents: 2820,
    patientPaidCents: 0,
    status: 'balance-due',
    payerName: 'Aetna',
    claimId: 'clm-001',
  },
  // Jordan Avery — prior session fully paid
  {
    id: 'pbi-002',
    patientId: 'pt-001',
    description: 'Psychiatric diagnostic evaluation (CPT 90791)',
    serviceDate: '2026-06-30',
    billedCents: 26700,
    insurancePaidCents: 24030,
    patientResponsibilityCents: 2670,
    patientPaidCents: 2670,
    status: 'paid',
    payerName: 'Aetna',
  },
  // Jordan Avery — another prior session fully paid
  {
    id: 'pbi-003',
    patientId: 'pt-001',
    description: 'Psychotherapy, 60 min (CPT 90837)',
    serviceDate: '2026-06-23',
    billedCents: 14100,
    insurancePaidCents: 11280,
    patientResponsibilityCents: 2820,
    patientPaidCents: 2820,
    status: 'paid',
    payerName: 'Aetna',
  },
  // Maria Sato — edge case (claim denied, full patient responsibility)
  {
    id: 'pbi-004',
    patientId: 'pt-002',
    description: 'Psychotherapy, 45 min (CPT 90834)',
    serviceDate: '2026-07-01',
    billedCents: 9800,
    insurancePaidCents: 0,
    patientResponsibilityCents: 9800,
    patientPaidCents: 0,
    status: 'denied',
    payerName: 'Blue Shield of California',
    claimId: 'clm-004',
  },
];

export function getPatientBillItems(patientId: string): PatientBillItem[] {
  return patientBillItems.filter((b) => b.patientId === patientId);
}

export function getPatientBalance(patientId: string): {
  totalOwedCents: number;
  totalPaidCents: number;
  totalBilledCents: number;
} {
  const items = getPatientBillItems(patientId);
  const totalOwedCents = items
    .filter((i) => i.status === 'balance-due' || i.status === 'denied')
    .reduce((sum, i) => sum + (i.patientResponsibilityCents - i.patientPaidCents), 0);
  const totalPaidCents = items.reduce((sum, i) => sum + i.patientPaidCents, 0);
  const totalBilledCents = items.reduce((sum, i) => sum + i.billedCents, 0);
  return { totalOwedCents, totalPaidCents, totalBilledCents };
}

/* ------------------------------------------------------------------ */
/*  Patient portal messages (mock)                                      */
/* ------------------------------------------------------------------ */

export interface PortalMessage {
  id: string;
  patientId: string;
  /** Direction of the message. */
  direction: 'inbound' | 'outbound';
  /** Sender name. */
  from: string;
  /** Message content. */
  text: string;
  /** Timestamp (ISO). */
  timestamp: string;
}

export const portalMessages: PortalMessage[] = [
  {
    id: 'msg-001',
    patientId: 'pt-001',
    direction: 'outbound',
    from: 'Dr. Priya Nair',
    text: 'Hi Jordan, just a reminder about our next session on July 13 at 9 AM via telehealth. Looking forward to it!',
    timestamp: '2026-07-10T15:30:00Z',
  },
  {
    id: 'msg-002',
    patientId: 'pt-001',
    direction: 'inbound',
    from: 'Jordan Avery',
    text: 'Thank you, Dr. Nair. I will be there. I have been practicing the breathing exercises.',
    timestamp: '2026-07-10T16:45:00Z',
  },
  {
    id: 'msg-003',
    patientId: 'pt-001',
    direction: 'outbound',
    from: 'Dr. Priya Nair',
    text: 'That is wonderful to hear. Keep it up and we will discuss your progress next session.',
    timestamp: '2026-07-10T17:00:00Z',
  },
];

export function getPortalMessages(patientId: string): PortalMessage[] {
  return portalMessages.filter((m) => m.patientId === patientId);
}

/* ------------------------------------------------------------------ */
/*  Org financial metrics                                               */
/* ------------------------------------------------------------------ */

export interface RevenueByPayer {
  payerName: string;
  amountCents: number;
  /** Claim count contributing to this total. */
  claimCount: number;
}

export const revenueByPayer: RevenueByPayer[] = [
  { payerName: 'Aetna', amountCents: 35310, claimCount: 2 },
  { payerName: 'Cigna', amountCents: 13065, claimCount: 1 },
  { payerName: 'State Medicaid', amountCents: 0, claimCount: 2 },
  { payerName: 'Blue Shield of California', amountCents: 0, claimCount: 1 },
  { payerName: 'Medicare Part B', amountCents: 0, claimCount: 0 },
];

export interface OrgFinancialMetrics {
  /** Total revenue collected this period, in cents. */
  totalRevenueCents: number;
  /** Denial rate as a percentage (0-100). */
  denialRate: number;
  /** Average claim turnaround time in days. */
  avgTurnaroundDays: number;
  /** Total claims submitted. */
  totalClaims: number;
  /** Denied claims count. */
  deniedClaims: number;
  /** Paid claims count. */
  paidClaims: number;
  /** Period label. */
  periodLabel: string;
}

export const orgFinancialMetrics: OrgFinancialMetrics = {
  totalRevenueCents: 48375,
  denialRate: 16.7,
  avgTurnaroundDays: 3.5,
  totalClaims: 6,
  deniedClaims: 1,
  paidClaims: 2,
  periodLabel: 'Jul 1 – Jul 15, 2026',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Sales leads (public Contact Sales form submissions)                */
/* ------------------------------------------------------------------ */

export type LeadStatus = 'New' | 'Contacted' | 'Converted';

export interface SalesLead {
  id: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  providerCount: string;
  currentSystem?: string;
  message?: string;
  submittedAt: string;
  status: LeadStatus;
}

export const salesLeads: SalesLead[] = [
  {
    id: 'lead-001',
    organizationName: 'Lakeshore Family Therapy',
    contactName: 'Karen Mills',
    contactEmail: 'karen@lakeshoreft.com',
    contactPhone: '(503) 555-0142',
    providerCount: '6',
    currentSystem: 'SimplePractice',
    message: 'Looking for something that handles couple and family sessions better.',
    submittedAt: '2026-07-10T14:22:00Z',
    status: 'New',
  },
  {
    id: 'lead-002',
    organizationName: 'Cascade Psychiatric Associates',
    contactName: 'James Okonkwo',
    contactEmail: 'jokonkwo@cascadepsych.com',
    contactPhone: '(206) 555-0198',
    providerCount: '18',
    currentSystem: 'Athenahealth',
    message: 'Need credentialing tracking across multiple payers.',
    submittedAt: '2026-07-11T09:15:00Z',
    status: 'Contacted',
  },
];

export function getLead(id: string): SalesLead | undefined {
  return salesLeads.find((l) => l.id === id);
}

export function getOrg(orgId: string): Organization | undefined {
  return organizations.find((o) => o.id === orgId);
}

export function getUsersForRole(role: Role): User[] {
  return users.filter((u) => u.role === role);
}

/** The "current" user for a role — the first user matching that role. */
export function getDefaultUserForRole(role: Role): User | undefined {
  return getUsersForRole(role)[0];
}

export function getProviderProfile(userId: string): ProviderProfile | undefined {
  return providerProfiles.find((p) => p.userId === userId);
}

export function getLicensedProviders(): User[] {
  return users.filter(
    (u) => u.role === 'provider' || u.role === 'clinical-supervisor'
  );
}

export function getPendingInvites(): TeamInvite[] {
  return teamInvites.filter((i) => i.status === 'pending');
}
