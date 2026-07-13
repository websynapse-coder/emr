'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  Video,
  MapPin,
  ShieldCheck,
  Wallet,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  DollarSign,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRole } from '@/lib/role-context';
import {
  appointments,
  getConsentHistoryForPatient,
  getPatientBillItems,
  getPatientBalance,
  getPortalMessages,
  patients,
  type Appointment,
  type ConsentRecord,
  type PatientBillItem,
  type PortalMessage,
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/* ------------------------------------------------------------------ */
/*  Patient portal dashboard                                           */
/* ------------------------------------------------------------------ */

export default function PortalPage() {
  const { user } = useRole();

  // The patient user (user-008 = Jordan Avery) maps to patient pt-001
  const patientId = 'pt-001';
  const patient = patients.find((p) => p.id === patientId);

  const upcomingAppts = appointments
    .filter((a) => a.patientId === patientId && a.status === 'scheduled')
    .sort((a, b) => a.date.localeCompare(b.date));

  const consentRecords = getConsentHistoryForPatient(patientId);
  const billItems = getPatientBillItems(patientId);
  const balance = getPatientBalance(patientId);
  const messages = getPortalMessages(patientId);

  const [messageText, setMessageText] = React.useState('');
  const [localMessages, setLocalMessages] = React.useState<PortalMessage[]>(messages);

  const sendMessage = () => {
    if (!messageText.trim()) return;
    const newMsg: PortalMessage = {
      id: `msg-${Date.now()}`,
      patientId,
      direction: 'inbound',
      from: user?.name ?? 'Patient',
      text: messageText.trim(),
      timestamp: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, newMsg]);
    setMessageText('');
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Patient header */}
      <div
        className={cn(
          'flex items-center gap-4 rounded-lg border border-border',
          'bg-surface-raised p-5'
        )}
      >
        <Avatar className="h-14 w-14">
          <AvatarFallback className="bg-brand-primary text-brand-primary-foreground text-h4">
            {patient?.name?.split(' ').map((n) => n[0]).join('') ?? 'PT'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-h2 font-bold text-text-primary">
            Welcome, {patient?.name?.split(' ')[0] ?? 'there'}
          </h1>
          <p className="text-body text-text-secondary">
            Your patient portal at Harborline Behavioral Health
          </p>
        </div>
      </div>

      {/* Balance summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BalanceTile
          icon={Wallet}
          label="Amount owed"
          value={formatCents(balance.totalOwedCents)}
          tone={balance.totalOwedCents > 0 ? 'warning' : 'success'}
        />
        <BalanceTile
          icon={CheckCircle2}
          label="Amount paid"
          value={formatCents(balance.totalPaidCents)}
          tone="success"
        />
        <BalanceTile
          icon={DollarSign}
          label="Total billed"
          value={formatCents(balance.totalBilledCents)}
          tone="info"
        />
      </div>

      {/* Upcoming appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <CalendarClock className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Upcoming appointments
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {upcomingAppts.length} scheduled session{upcomingAppts.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {upcomingAppts.length === 0 ? (
            <p className="py-4 text-center text-body-sm text-text-muted">
              No upcoming appointments.
            </p>
          ) : (
            upcomingAppts.slice(0, 5).map((appt) => (
              <AppointmentRow key={appt.id} appointment={appt} />
            ))
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Consent history */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
              <ShieldCheck className="h-5 w-5 text-brand-primary" aria-hidden="true" />
              Consent history
            </CardTitle>
            <CardDescription className="text-body-sm text-text-muted">
              Records of your signed session consents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {consentRecords.length === 0 ? (
              <p className="py-4 text-center text-body-sm text-text-muted">
                No consent records yet.
              </p>
            ) : (
              consentRecords.map((record) => (
                <ConsentRow key={record.id} record={record} />
              ))
            )}
          </CardContent>
        </Card>

        {/* Secure messaging */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
              <MessageSquare className="h-5 w-5 text-brand-primary" aria-hidden="true" />
              Secure messages
            </CardTitle>
            <CardDescription className="text-body-sm text-text-muted">
              Communicate with your care team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {localMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
            <div className="space-y-2">
              <Textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message to your care team..."
                rows={2}
                className="resize-none"
              />
              <Button
                onClick={sendMessage}
                disabled={!messageText.trim()}
                className="w-full gap-1.5"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                Send message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing link */}
      <Card>
        <CardContent className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-brand-primary/10">
              <Wallet className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-body-sm font-medium text-text-primary">
                View detailed billing
              </p>
              <p className="text-caption text-text-muted">
                See charges, payments, and balances
              </p>
            </div>
          </div>
          <Link href="/portal/billing">
            <Button variant="outline" className="gap-1.5">
              View bills
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                      */
/* ------------------------------------------------------------------ */

function AppointmentRow({ appointment: appt }: { appointment: Appointment }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border border-border',
        'bg-surface px-4 py-3'
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-primary/10">
        {appt.sessionType === 'telehealth' ? (
          <Video className="h-5 w-5 text-info" aria-hidden="true" />
        ) : (
          <MapPin className="h-5 w-5 text-brand-secondary" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-body-sm font-medium text-text-primary">
          {appt.providerName}
        </p>
        <p className="text-caption text-text-muted">
          {appt.date} at {appt.startTime} ·{' '}
          {appt.sessionType === 'telehealth' ? 'Telehealth' : 'In-Person'} ·{' '}
          <span className="capitalize">{appt.modality}</span>
        </p>
      </div>
      <Badge
        variant="outline"
        className="border-success/30 bg-success/10 text-caption font-semibold text-success"
      >
        Scheduled
      </Badge>
    </div>
  );
}

function ConsentRow({ record }: { record: ConsentRecord }) {
  const typeLabel: Record<string, string> = {
    'session-recording': 'Session Recording',
    'telehealth-consent': 'Telehealth Consent',
    'general-consent': 'General Consent',
  };
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-md border border-border',
        'bg-surface px-4 py-3'
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/15">
        <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-body-sm font-medium text-text-primary">
            {typeLabel[record.type]}
          </p>
          <Badge
            variant="outline"
            className="border-success/30 bg-success/10 text-caption font-semibold text-success"
          >
            Signed
          </Badge>
        </div>
        <p className="text-caption text-text-muted">
          {record.sessionDate} · {record.providerName} ·{' '}
          <span className="capitalize">{record.modality}</span>
        </p>
        <p className="text-caption text-text-muted">
          Signed by: {record.participantName} ({record.role})
          {record.signedByGuardian && ` on behalf of minor — Guardian: ${record.guardianName}`}
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message: msg }: { message: PortalMessage }) {
  const isOutbound = msg.direction === 'outbound';
  return (
    <div className={cn('flex', isOutbound ? 'justify-start' : 'justify-end')}>
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-3 py-2',
          isOutbound
            ? 'bg-brand-primary/10 text-text-primary'
            : 'bg-surface-sunken text-text-secondary'
        )}
      >
        <p className="text-caption font-semibold text-text-muted">
          {msg.from}
        </p>
        <p className="text-body-sm text-text-secondary">{msg.text}</p>
        <p className="mt-0.5 text-caption text-text-muted">
          {formatDateTime(msg.timestamp)}
        </p>
      </div>
    </div>
  );
}

type Tone = 'info' | 'success' | 'warning' | 'danger';

const toneMap: Record<Tone, { bg: string; text: string }> = {
  info: { bg: 'bg-info/12', text: 'text-info' },
  success: { bg: 'bg-success/12', text: 'text-success' },
  warning: { bg: 'bg-warning/15', text: 'text-warning' },
  danger: { bg: 'bg-danger/12', text: 'text-danger' },
};

function BalanceTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  tone: Tone;
}) {
  const t = toneMap[tone];
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-md', t.bg)}>
          <Icon className={cn('h-5 w-5', t.text)} aria-hidden="true" />
        </div>
        <div>
          <p className="text-caption text-text-muted">{label}</p>
          <p className="text-h3 font-semibold text-text-primary">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
