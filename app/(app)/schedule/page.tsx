'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  Plus,
  ChevronLeft,
  ChevronRight,
  Video,
  MapPin,
  CircleDot,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  appointments as allAppointments,
  patients,
  users,
  mockEligibilityCheck,
  type Appointment,
  type SessionType,
  type SessionModality,
  type Patient,
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

/* ------------------------------------------------------------------ */
/*  Week calendar constants                                            */
/* ------------------------------------------------------------------ */

const WEEK_START = new Date('2026-07-13T00:00:00');
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM – 6 PM

function getWeekDates(start: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function formatDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const HOUR_HEIGHT = 56; // px per hour row

/* ------------------------------------------------------------------ */
/*  Scheduling page                                                    */
/* ------------------------------------------------------------------ */

export default function SchedulePage() {
  const [weekStart, setWeekStart] = React.useState(WEEK_START);
  const [bookOpen, setBookOpen] = React.useState(false);
  const [appointments, setAppointments] = React.useState<Appointment[]>(allAppointments);

  const weekDates = React.useMemo(() => getWeekDates(weekStart), [weekStart]);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
  };
  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
  };
  const thisWeek = () => setWeekStart(WEEK_START);

  const handleBook = (newAppt: Appointment) => {
    setAppointments((prev) => [...prev, newAppt]);
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-h1 font-bold text-text-primary">Schedule</h1>
          <p className="text-body text-text-secondary">
            Week of {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} – {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek} aria-label="Previous week">
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="outline" onClick={thisWeek} className="text-body-sm">
            This week
          </Button>
          <Button variant="outline" size="icon" onClick={nextWeek} aria-label="Next week">
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button onClick={() => setBookOpen(true)} className="ml-2 gap-1.5">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Book appointment
          </Button>
        </div>
      </div>

      {/* Calendar */}
      <Card>
        <CardContent className="p-0">
          {/* Day headers */}
          <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-border">
            <div className="px-2 py-2" />
            {weekDates.map((d, i) => {
              const isToday = formatDateString(d) === formatDateString(new Date('2026-07-13'));
              return (
                <div
                  key={i}
                  className={cn(
                    'px-2 py-2 text-center',
                    i < 6 && 'border-r border-border'
                  )}
                >
                  <p className="text-caption text-text-muted">{DAYS[i]}</p>
                  <p
                    className={cn(
                      'text-h4 font-semibold',
                      isToday ? 'text-brand-primary' : 'text-text-primary'
                    )}
                  >
                    {d.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Time grid */}
          <div className="relative grid grid-cols-[60px_repeat(7,1fr)]">
            {/* Hour rows */}
            {HOURS.map((hour, hourIdx) => (
              <React.Fragment key={hour}>
                <div
                  className="border-r border-b border-border px-2 py-1 text-caption text-text-muted"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                >
                  {hour > 12 ? `${hour - 12}` : hour}:00 {hour >= 12 ? 'PM' : 'AM'}
                </div>
                {weekDates.map((_, dayIdx) => (
                  <div
                    key={dayIdx}
                    className={cn(
                      'border-b border-border',
                      dayIdx < 6 && 'border-r'
                    )}
                    style={{ height: `${HOUR_HEIGHT}px` }}
                  />
                ))}
              </React.Fragment>
            ))}

            {/* Appointment blocks */}
            {weekDates.map((dayDate, dayIdx) => {
              const dayAppts = appointments.filter(
                (a) => a.date === formatDateString(dayDate)
              );
              return dayAppts.map((appt) => {
                const startMin = timeToMinutes(appt.startTime) - 8 * 60;
                const top = (startMin / 60) * HOUR_HEIGHT;
                const height = (appt.durationMinutes / 60) * HOUR_HEIGHT - 2;
                if (top < 0 || top > HOURS.length * HOUR_HEIGHT) return null;
                return (
                  <div
                    key={appt.id}
                    className="absolute z-10"
                    style={{
                      top: `${top}px`,
                      height: `${Math.max(height, 28)}px`,
                      left: `calc(60px + ${dayIdx} * ((100% - 60px) / 7))`,
                      width: `calc((100% - 60px) / 7 - 4px)`,
                    }}
                  >
                    <AppointmentBlock appointment={appt} />
                  </div>
                );
              });
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-caption text-text-muted">
        <span className="flex items-center gap-1.5">
          <Video className="h-3.5 w-3.5 text-info" aria-hidden="true" />
          Telehealth
        </span>
        <span className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-brand-secondary" aria-hidden="true" />
          In-Person
        </span>
        <span className="flex items-center gap-1.5">
          <CircleDot className="h-3.5 w-3.5 text-success" aria-hidden="true" />
          Scheduled
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-success" aria-hidden="true" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <XCircle className="h-3.5 w-3.5 text-danger" aria-hidden="true" />
          No-show
        </span>
      </div>

      <BookAppointmentDialog
        open={bookOpen}
        onOpenChange={setBookOpen}
        onBook={handleBook}
        weekStart={weekStart}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Appointment block (calendar cell)                                  */
/* ------------------------------------------------------------------ */

function AppointmentBlock({ appointment: appt }: { appointment: Appointment }) {
  const isTelehealth = appt.sessionType === 'telehealth';
  const statusColors: Record<string, string> = {
    scheduled: isTelehealth
      ? 'bg-info/10 border-info/40 text-info'
      : 'bg-brand-secondary/10 border-brand-secondary/40 text-brand-secondary',
    completed: 'bg-success/10 border-success/40 text-success',
    'no-show': 'bg-danger/10 border-danger/40 text-danger',
    cancelled: 'bg-surface-sunken border-border text-text-muted',
    'in-progress': 'bg-warning/10 border-warning/40 text-warning',
  };

  return (
    <Link
      href={`/encounter/${appt.id}`}
      className={cn(
        'flex h-full flex-col gap-0.5 rounded-md border px-2 py-1 text-caption',
        'transition-all hover:shadow-sm',
        statusColors[appt.status]
      )}
    >
      <div className="flex items-center gap-1">
        {isTelehealth ? (
          <Video className="h-3 w-3 shrink-0" aria-hidden="true" />
        ) : (
          <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
        )}
        <span className="font-semibold">{appt.startTime}</span>
      </div>
      <p className="truncate font-medium text-text-primary">{appt.patientName}</p>
      <p className="truncate text-text-muted">{appt.providerName}</p>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/*  Book Appointment dialog                                            */
/* ------------------------------------------------------------------ */

function BookAppointmentDialog({
  open,
  onOpenChange,
  onBook,
  weekStart,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onBook: (appt: Appointment) => void;
  weekStart: Date;
}) {
  const [patientId, setPatientId] = React.useState('');
  const [providerId, setProviderId] = React.useState('');
  const [date, setDate] = React.useState(formatDateString(weekStart));
  const [time, setTime] = React.useState('09:00');
  const [duration, setDuration] = React.useState('50');
  const [sessionType, setSessionType] = React.useState<SessionType>('telehealth');
  const [modality, setModality] = React.useState<SessionModality>('individual');
  const [eligibility, setEligibility] = React.useState<{
    status: 'active' | 'inactive' | 'copay';
    copay?: number;
    payerName: string;
  } | null>(null);
  const [checkingEligibility, setCheckingEligibility] = React.useState(false);

  const providers = users.filter(
    (u) => u.role === 'provider' || u.role === 'clinical-supervisor'
  );

  const checkEligibility = () => {
    if (!patientId) return;
    setCheckingEligibility(true);
    setEligibility(null);
    setTimeout(() => {
      setEligibility(mockEligibilityCheck(patientId));
      setCheckingEligibility(false);
    }, 800);
  };

  const reset = () => {
    setPatientId('');
    setProviderId('');
    setDate(formatDateString(weekStart));
    setTime('09:00');
    setDuration('50');
    setSessionType('telehealth');
    setModality('individual');
    setEligibility(null);
  };

  const handleBook = () => {
    const patient = patients.find((p) => p.id === patientId);
    const provider = providers.find((p) => p.id === providerId);
    if (!patient || !provider) return;

    const newAppt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId,
      patientName: patient.name,
      providerId,
      providerName: provider.name,
      date,
      startTime: time,
      durationMinutes: parseInt(duration, 10),
      sessionType,
      modality,
      status: 'scheduled',
      eligibility: eligibility ?? undefined,
    };
    onBook(newAppt);
    reset();
    onOpenChange(false);
  };

  const canBook = patientId && providerId && date && time;

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-h3 text-text-primary">Book appointment</DialogTitle>
          <DialogDescription className="text-body-sm text-text-muted">
            Schedule a new session. Eligibility is checked automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          {/* Patient + Provider */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Patient</Label>
              <Select value={patientId} onValueChange={(v) => { setPatientId(v); setEligibility(null); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                      {p.isMinor && ' (minor)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Provider</Label>
              <Select value={providerId} onValueChange={setProviderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date + Time */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Start time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 min</SelectItem>
                  <SelectItem value="45">45 min</SelectItem>
                  <SelectItem value="50">50 min</SelectItem>
                  <SelectItem value="60">60 min</SelectItem>
                  <SelectItem value="75">75 min</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Session type + modality */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Session type</Label>
              <div className="flex gap-2">
                <ToggleButton
                  active={sessionType === 'telehealth'}
                  onClick={() => setSessionType('telehealth')}
                  icon={<Video className="h-4 w-4" aria-hidden="true" />}
                  label="Telehealth"
                />
                <ToggleButton
                  active={sessionType === 'in-person'}
                  onClick={() => setSessionType('in-person')}
                  icon={<MapPin className="h-4 w-4" aria-hidden="true" />}
                  label="In-Person"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Modality</Label>
              <Select value={modality} onValueChange={(v) => setModality(v as SessionModality)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="couple">Couple</SelectItem>
                  <SelectItem value="family">Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Eligibility check */}
          <div className="rounded-md border border-border bg-surface-sunken p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldIcon />
                <span className="text-body-sm font-medium text-text-primary">
                  Eligibility check
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={checkEligibility}
                disabled={!patientId || checkingEligibility}
                className="gap-1.5"
              >
                {checkingEligibility ? (
                  <>
                    <Clock className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    Checking...
                  </>
                ) : (
                  'Check eligibility'
                )}
              </Button>
            </div>
            {eligibility && (
              <div className="mt-3">
                <EligibilityBadge eligibility={eligibility} />
              </div>
            )}
            {!eligibility && !checkingEligibility && (
              <p className="mt-2 text-caption text-text-muted">
                Select a patient and check eligibility to see coverage status.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleBook} disabled={!canBook} className="gap-1.5">
            Book appointment
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Eligibility badge                                                  */
/* ------------------------------------------------------------------ */

function EligibilityBadge({
  eligibility,
}: {
  eligibility: { status: 'active' | 'inactive' | 'copay'; copay?: number; payerName: string };
}) {
  if (eligibility.status === 'active') {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="border-success/30 bg-success/10 text-caption font-semibold text-success"
        >
          <CheckCircle2 className="mr-1 h-3 w-3" aria-hidden="true" />
          Active Coverage
        </Badge>
        <span className="text-caption text-text-muted">{eligibility.payerName}</span>
      </div>
    );
  }
  if (eligibility.status === 'inactive') {
    return (
      <div className="flex items-center gap-2">
        <Badge
          variant="outline"
          className="border-danger/30 bg-danger/10 text-caption font-semibold text-danger"
        >
          <XCircle className="mr-1 h-3 w-3" aria-hidden="true" />
          Inactive
        </Badge>
        <span className="text-caption text-text-muted">
          Coverage not active — verify with payer
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className="border-warning/40 bg-warning/10 text-caption font-semibold text-warning"
      >
        <DollarSign className="mr-1 h-3 w-3" aria-hidden="true" />
        Copay ${eligibility.copay}
      </Badge>
      <span className="text-caption text-text-muted">{eligibility.payerName}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-body-sm transition-colors',
        active
          ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
          : 'border-border bg-surface text-text-secondary hover:bg-surface-sunken'
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function ShieldIcon() {
  return (
    <svg
      className="h-4 w-4 text-brand-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.11 6.34-2.41a1 1 0 0 1 1.32 0C14.5 3.89 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );
}
