'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Video,
  MapPin,
  ShieldCheck,
  PenLine,
  CheckCircle2,
  CircleDot,
  Circle,
  Loader2,
  FileText,
  AlertCircle,
  Clock,
  GraduationCap,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  appointments,
  clinicalNotes,
  providerProfiles,
  getParticipantsForAppointment,
  getNoteByAppointment,
  type Appointment,
  type SessionParticipant,
  type ClinicalNote,
  type SoapNote,
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

/* ------------------------------------------------------------------ */
/*  Encounter step model                                               */
/* ------------------------------------------------------------------ */

type Step = 'consent' | 'session' | 'post-session';

/* ------------------------------------------------------------------ */
/*  Encounter page                                                     */
/* ------------------------------------------------------------------ */

export default function EncounterPage() {
  const params = useParams<{ aptId: string }>();
  const router = useRouter();

  const appointment = React.useMemo(
    () => appointments.find((a) => a.id === params.aptId),
    [params.aptId]
  );

  const existingNote = React.useMemo(
    () => (appointment ? getNoteByAppointment(appointment.id) : undefined),
    [appointment]
  );

  const [step, setStep] = React.useState<Step>('consent');
  const [participants, setParticipants] = React.useState<SessionParticipant[]>([]);
  const [recordingSeconds, setRecordingSeconds] = React.useState(0);
  const [transcriptLoading, setTranscriptLoading] = React.useState(false);
  const [showTranscript, setShowTranscript] = React.useState(false);
  const [soap, setSoap] = React.useState<SoapNote>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
  });
  const [noteStatus, setNoteStatus] = React.useState<'draft' | 'signed' | 'awaiting-cosign' | 'cosigned'>('draft');

  // Initialize participants from mock data
  React.useEffect(() => {
    if (appointment) {
      setParticipants(getParticipantsForAppointment(appointment));
    }
  }, [appointment]);

  // Initialize SOAP note from existing note if present
  React.useEffect(() => {
    if (existingNote) {
      setSoap(existingNote.soap);
      setNoteStatus(existingNote.status);
      if (existingNote.status === 'signed' || existingNote.status === 'awaiting-cosign' || existingNote.status === 'cosigned') {
        setShowTranscript(true);
      }
    }
  }, [existingNote]);

  // Recording timer
  React.useEffect(() => {
    if (step !== 'session') return;
    const interval = setInterval(() => {
      setRecordingSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  if (!appointment) {
    return (
      <div className="mx-auto max-w-4xl">
        <p className="text-body text-text-muted">Appointment not found.</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4 gap-1.5">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Go back
        </Button>
      </div>
    );
  }

  const allSigned = participants.every((p) => p.consent === 'signed');
  const providerProfile = providerProfiles.find((p) => p.userId === appointment.providerId);
  const isAssociate = providerProfile?.isAssociate ?? false;

  const signParticipant = (index: number) => {
    setParticipants((prev) =>
      prev.map((p, i) => (i === index ? { ...p, consent: 'signed' } : p))
    );
  };

  const startRecording = () => {
    setStep('session');
    setRecordingSeconds(0);
  };

  const endSession = () => {
    setStep('post-session');
    setTranscriptLoading(true);
    setShowTranscript(false);
    // Simulate transcript generation
    setTimeout(() => {
      setTranscriptLoading(false);
      setShowTranscript(true);
    }, 2500);
  };

  const signNote = () => {
    if (isAssociate) {
      setNoteStatus('awaiting-cosign');
    } else {
      setNoteStatus('signed');
    }
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      {/* Back link */}
      <button
        type="button"
        onClick={() => router.back()}
        className={cn(
          'flex items-center gap-1.5 text-body-sm text-text-muted',
          'transition-colors hover:text-text-primary'
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to schedule
      </button>

      {/* Session header */}
      <div
        className={cn(
          'flex flex-col gap-3 rounded-lg border border-border',
          'bg-surface-raised p-5'
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-h2 font-bold text-text-primary">
              {appointment.patientName}
            </h1>
            <p className="text-body text-text-secondary">
              {appointment.providerName} · {appointment.date} at {appointment.startTime}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                appointment.sessionType === 'telehealth'
                  ? 'border-info/30 bg-info/10 text-info'
                  : 'border-brand-secondary/30 bg-brand-secondary/10 text-brand-secondary',
                'text-caption font-semibold'
              )}
            >
              {appointment.sessionType === 'telehealth' ? (
                <Video className="mr-1 h-3 w-3" aria-hidden="true" />
              ) : (
                <MapPin className="mr-1 h-3 w-3" aria-hidden="true" />
              )}
              {appointment.sessionType === 'telehealth' ? 'Telehealth' : 'In-Person'}
            </Badge>
            <Badge
              variant="outline"
              className="border-border bg-surface-sunken text-caption font-semibold capitalize text-text-secondary"
            >
              {appointment.modality}
            </Badge>
            {isAssociate && (
              <Badge
                variant="outline"
                className="border-info/30 bg-info/10 text-caption font-semibold text-info"
              >
                <GraduationCap className="mr-1 h-3 w-3" aria-hidden="true" />
                Associate
              </Badge>
            )}
          </div>
        </div>

        {/* Step indicator */}
        <StepIndicator currentStep={step} />
      </div>

      {/* Step content */}
      {step === 'consent' && (
        <ConsentGate
          appointment={appointment}
          participants={participants}
          onSign={signParticipant}
          onStartRecording={startRecording}
          allSigned={allSigned}
        />
      )}

      {step === 'session' && (
        <InSession
          appointment={appointment}
          recordingSeconds={recordingSeconds}
          onEndSession={endSession}
        />
      )}

      {step === 'post-session' && (
        <PostSession
          appointment={appointment}
          existingNote={existingNote}
          transcriptLoading={transcriptLoading}
          showTranscript={showTranscript}
          soap={soap}
          setSoap={setSoap}
          noteStatus={noteStatus}
          onSignNote={signNote}
          isAssociate={isAssociate}
          supervisorName={providerProfile?.supervisorId
            ? users_lookup_supervisor_name(providerProfile.supervisorId)
            : undefined}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper: supervisor name lookup                                     */
/* ------------------------------------------------------------------ */

import { users } from '@/lib/mockData';

function users_lookup_supervisor_name(supervisorId: string): string | undefined {
  return users.find((u) => u.id === supervisorId)?.name;
}

/* ------------------------------------------------------------------ */
/*  Step indicator                                                      */
/* ------------------------------------------------------------------ */

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: 'consent', label: 'Consent' },
    { id: 'session', label: 'Session' },
    { id: 'post-session', label: 'Note' },
  ];
  const currentIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <React.Fragment key={s.id}>
            <div
              className={cn(
                'flex items-center gap-1.5 rounded-full px-2.5 py-1 text-caption font-medium',
                done && 'bg-success/10 text-success',
                active && 'bg-brand-primary/10 text-brand-primary',
                !done && !active && 'bg-surface-sunken text-text-muted'
              )}
            >
              {done ? (
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              ) : active ? (
                <CircleDot className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Circle className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {s.label}
            </div>
            {i < steps.length - 1 && (
              <div className={cn('h-px w-6', done ? 'bg-success' : 'bg-border')} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step A — Consent gate                                               */
/* ------------------------------------------------------------------ */

function ConsentGate({
  appointment,
  participants,
  onSign,
  onStartRecording,
  allSigned,
}: {
  appointment: Appointment;
  participants: SessionParticipant[];
  onSign: (index: number) => void;
  onStartRecording: () => void;
  allSigned: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-h3 text-text-primary">
          <ShieldCheck className="h-5 w-5 text-brand-primary" aria-hidden="true" />
          Consent &amp; participant verification
        </CardTitle>
        <CardDescription className="text-body-sm text-text-muted">
          Every participant must sign before recording can start.
          {appointment.modality === 'family' && ' This is a family session — all listed members must consent.'}
          {appointment.modality === 'couple' && ' This is a couple session — both partners must consent.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {participants.map((p, i) => (
          <ParticipantRow
            key={i}
            participant={p}
            onSign={() => onSign(i)}
          />
        ))}

        {/* Start recording */}
        <div className="pt-4">
          {allSigned ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-body-sm text-success">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                All participants have signed. You can start recording.
              </div>
              <Button onClick={onStartRecording} size="lg" className="gap-2">
                <CircleDot className="h-5 w-5 text-danger-foreground" aria-hidden="true" />
                Start Recording
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div
                className={cn(
                  'flex items-center gap-2 rounded-md border border-border',
                  'bg-surface-sunken p-3 text-body-sm text-text-muted'
                )}
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
                <span>
                  Recording is disabled until every participant has signed
                  ({participants.filter((p) => p.consent === 'signed').length}/{participants.length} signed).
                </span>
              </div>
              <Button disabled size="lg" className="gap-2 opacity-50">
                <CircleDot className="h-5 w-5" aria-hidden="true" />
                Start Recording
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ParticipantRow({
  participant,
  onSign,
}: {
  participant: SessionParticipant;
  onSign: () => void;
}) {
  const signed = participant.consent === 'signed';

  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-md border border-border px-4 py-3',
        'sm:flex-row sm:items-center sm:justify-between',
        signed ? 'bg-success/5' : 'bg-surface'
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            signed
              ? 'bg-success/15 text-success'
              : 'bg-surface-sunken text-text-muted'
          )}
        >
          {signed ? (
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Circle className="h-5 w-5" aria-hidden="true" />
          )}
        </div>
        <div>
          <p className="text-body-sm font-medium text-text-primary">
            {participant.name}
          </p>
          <p className="text-caption text-text-muted">{participant.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {participant.isMinor && (
          <div className="flex items-center gap-1.5 rounded-md bg-warning/10 px-2.5 py-1 text-caption text-warning">
            <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
            Guardian consent required: {participant.guardianName}
          </div>
        )}
        {signed ? (
          <Badge
            variant="outline"
            className="border-success/30 bg-success/10 text-caption font-semibold text-success"
          >
            Signed
          </Badge>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onSign}
            className="gap-1.5"
          >
            <PenLine className="h-3.5 w-3.5" aria-hidden="true" />
            {participant.isMinor ? `Guardian signs` : 'Sign'}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step B — In-session                                                */
/* ------------------------------------------------------------------ */

function InSession({
  appointment,
  recordingSeconds,
  onEndSession,
}: {
  appointment: Appointment;
  recordingSeconds: number;
  onEndSession: () => void;
}) {
  const minutes = Math.floor(recordingSeconds / 60);
  const seconds = recordingSeconds % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-h3 text-text-primary">
          <Video className="h-5 w-5 text-brand-primary" aria-hidden="true" />
          Session in progress
        </CardTitle>
        <CardDescription className="text-body-sm text-text-muted">
          Recording is active. Do not close this window.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recording indicator */}
        <div
          className={cn(
            'flex flex-col items-center justify-center gap-4 rounded-lg',
            'border border-danger/30 bg-danger/5 p-8'
          )}
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-75" />
              <span className="relative inline-flex h-4 w-4 rounded-full bg-danger" />
            </span>
            <span className="text-h2 font-bold text-danger">{timeStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                appointment.sessionType === 'telehealth'
                  ? 'border-info/30 bg-info/10 text-info'
                  : 'border-brand-secondary/30 bg-brand-secondary/10 text-brand-secondary',
                'text-caption font-semibold'
              )}
            >
              {appointment.sessionType === 'telehealth' ? (
                <Video className="mr-1 h-3 w-3" aria-hidden="true" />
              ) : (
                <MapPin className="mr-1 h-3 w-3" aria-hidden="true" />
              )}
              {appointment.sessionType === 'telehealth' ? 'Telehealth' : 'In-Person'}
            </Badge>
            <Badge
              variant="outline"
              className="border-border bg-surface-sunken text-caption font-semibold capitalize text-text-secondary"
            >
              {appointment.modality}
            </Badge>
            <Badge
              variant="outline"
              className="border-danger/30 bg-danger/10 text-caption font-semibold text-danger"
            >
              REC
            </Badge>
          </div>
        </div>

        {/* Session info */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <InfoCell label="Patient" value={appointment.patientName} />
          <InfoCell label="Provider" value={appointment.providerName} />
          <InfoCell label="Date" value={appointment.date} />
          <InfoCell label="Start" value={appointment.startTime} />
        </div>

        <Button
          variant="destructive"
          size="lg"
          onClick={onEndSession}
          className="w-full gap-2"
        >
          <CircleDot className="h-5 w-5" aria-hidden="true" />
          End Session
        </Button>
      </CardContent>
    </Card>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface p-3">
      <p className="text-caption text-text-muted">{label}</p>
      <p className="text-body-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step C — Post-session                                              */
/* ------------------------------------------------------------------ */

function PostSession({
  appointment,
  existingNote,
  transcriptLoading,
  showTranscript,
  soap,
  setSoap,
  noteStatus,
  onSignNote,
  isAssociate,
  supervisorName,
}: {
  appointment: Appointment;
  existingNote?: ClinicalNote;
  transcriptLoading: boolean;
  showTranscript: boolean;
  soap: SoapNote;
  setSoap: React.Dispatch<React.SetStateAction<SoapNote>>;
  noteStatus: 'draft' | 'signed' | 'awaiting-cosign' | 'cosigned';
  onSignNote: () => void;
  isAssociate: boolean;
  supervisorName?: string;
}) {
  const transcript = existingNote?.transcript ?? generateMockTranscript(appointment);

  return (
    <div className="space-y-6">
      {/* Transcript */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h3 text-text-primary">
            <FileText className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Session transcript
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Auto-generated from session recording
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transcriptLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" aria-hidden="true" />
              <p className="text-body-sm text-text-secondary">
                Generating transcript...
              </p>
              <p className="text-caption text-text-muted">
                This usually takes a few seconds
              </p>
            </div>
          ) : showTranscript ? (
            <div className="space-y-3">
              {transcript.map((line, i) => (
                <div key={i} className="flex gap-3">
                  <span className="shrink-0 text-caption tabular-nums text-text-muted">
                    {formatTimestamp(line.timestamp)}
                  </span>
                  <div>
                    <span
                      className={cn(
                        'text-body-sm font-semibold',
                        line.speaker.toLowerCase().includes('dr') ||
                        line.speaker.toLowerCase().includes('maya')
                          ? 'text-brand-primary'
                          : 'text-text-secondary'
                      )}
                    >
                      {line.speaker}:
                    </span>{' '}
                    <span className="text-body-sm text-text-secondary">
                      {line.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-body-sm text-text-muted">
              Transcript will appear here after the session ends.
            </p>
          )}
        </CardContent>
      </Card>

      {/* SOAP note */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-h3 text-text-primary">
                <Sparkles className="h-5 w-5 text-brand-primary" aria-hidden="true" />
                AI-generated SOAP note
              </CardTitle>
              <CardDescription className="text-body-sm text-text-muted">
                Editable — review and sign before submitting
              </CardDescription>
            </div>
            <NoteStatusBadge status={noteStatus} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showTranscript && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => {
                setSoap(generateMockSoap(appointment));
              }}
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-primary" aria-hidden="true" />
              Generate from transcript
            </Button>
          )}

          <SoapField
            label="Subjective"
            value={soap.subjective}
            onChange={(v) => setSoap((s) => ({ ...s, subjective: v }))}
            placeholder="Patient-reported symptoms, concerns, and history..."
          />
          <SoapField
            label="Objective"
            value={soap.objective}
            onChange={(v) => setSoap((s) => ({ ...s, objective: v }))}
            placeholder="Observations, mental status exam, measurable findings..."
          />
          <SoapField
            label="Assessment"
            value={soap.assessment}
            onChange={(v) => setSoap((s) => ({ ...s, assessment: v }))}
            placeholder="Clinical impressions, diagnosis, progress evaluation..."
          />
          <SoapField
            label="Plan"
            value={soap.plan}
            onChange={(v) => setSoap((s) => ({ ...s, plan: v }))}
            placeholder="Treatment plan, next steps, follow-up..."
          />

          {/* Sign / cosign state */}
          <div className="pt-2">
            {noteStatus === 'draft' && (
              <Button onClick={onSignNote} size="lg" className="w-full gap-2">
                <PenLine className="h-4 w-4" aria-hidden="true" />
                Sign Note
              </Button>
            )}

            {noteStatus === 'signed' && (
              <div
                className={cn(
                  'flex items-center gap-2 rounded-md border border-success/30',
                  'bg-success/10 p-4 text-body-sm text-success'
                )}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Note signed</p>
                  <p className="text-caption">
                    Note has been signed and filed to the patient record.
                  </p>
                </div>
              </div>
            )}

            {noteStatus === 'awaiting-cosign' && (
              <div
                className={cn(
                  'flex items-center gap-2 rounded-md border border-warning/40',
                  'bg-warning/10 p-4 text-body-sm text-warning'
                )}
              >
                <Clock className="h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Awaiting Supervisor Cosign</p>
                  <p className="text-caption">
                    {supervisorName
                      ? `Routed to ${supervisorName} for cosign review.`
                      : 'Routed to supervisor for cosign review.'}
                    {' Switch to the Clinical Supervisor role from the Demo Mode menu to review and approve.'}
                  </p>
                </div>
              </div>
            )}

            {noteStatus === 'cosigned' && (
              <div
                className={cn(
                  'flex items-center gap-2 rounded-md border border-success/30',
                  'bg-success/10 p-4 text-body-sm text-success'
                )}
              >
                <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Note cosigned</p>
                  <p className="text-caption">
                    Supervisor has reviewed and cosigned this note.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SOAP field                                                         */
/* ------------------------------------------------------------------ */

function SoapField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-body-sm font-semibold text-text-primary">
        {label}
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="resize-none"
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Note status badge                                                  */
/* ------------------------------------------------------------------ */

function NoteStatusBadge({ status }: { status: 'draft' | 'signed' | 'awaiting-cosign' | 'cosigned' }) {
  const map = {
    draft: 'border-border bg-surface-sunken text-text-muted',
    signed: 'border-success/30 bg-success/10 text-success',
    'awaiting-cosign': 'border-warning/40 bg-warning/10 text-warning',
    cosigned: 'border-success/30 bg-success/10 text-success',
  };
  const labels = {
    draft: 'Draft',
    signed: 'Signed',
    'awaiting-cosign': 'Awaiting Cosign',
    cosigned: 'Cosigned',
  };
  return (
    <Badge variant="outline" className={cn('text-caption font-semibold', map[status])}>
      {labels[status]}
    </Badge>
  );
}

/* ------------------------------------------------------------------ */
/*  Mock transcript / SOAP generators                                   */
/* ------------------------------------------------------------------ */

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function generateMockTranscript(appointment: Appointment): { speaker: string; text: string; timestamp: number }[] {
  const providerFirst = appointment.providerName.replace(/^Dr\.\s/, '').split(' ')[0];
  const patientFirst = appointment.patientName.split(' ')[0];

  return [
    { speaker: providerFirst, text: `Hi ${patientFirst}, thanks for joining today. How have you been since our last session?`, timestamp: 0 },
    { speaker: patientFirst, text: 'I have been doing okay. Some ups and downs but overall I feel like things are moving in the right direction.', timestamp: 10 },
    { speaker: providerFirst, text: 'I am glad to hear that. Can you tell me about a specific moment that felt challenging this week?', timestamp: 22 },
    { speaker: patientFirst, text: 'I had a tough conversation with a family member on Wednesday. I noticed myself getting really overwhelmed.', timestamp: 32 },
    { speaker: providerFirst, text: 'That sounds difficult. What did you notice in your body when that happened?', timestamp: 46 },
    { speaker: patientFirst, text: 'My chest got tight and my heart was racing. I remembered the grounding technique we talked about and tried it.', timestamp: 58 },
    { speaker: providerFirst, text: 'That is excellent. You used the skill in the moment. How did it go?', timestamp: 72 },
    { speaker: patientFirst, text: 'It helped. I was able to stay in the conversation instead of shutting down. I felt proud of myself after.', timestamp: 82 },
    { speaker: providerFirst, text: 'You should feel proud. That is real progress. Let us spend some time today building on that momentum.', timestamp: 96 },
  ];
}

function generateMockSoap(appointment: Appointment): SoapNote {
  const patientFirst = appointment.patientName.split(' ')[0];
  return {
    subjective: `${patientFirst} reports a mixed week with improved ability to manage emotional triggers. Identified a challenging family interaction on Wednesday and successfully utilized grounding techniques learned in prior session. Reports feeling proud of self for staying present. Sleep stable at 6-7 hours. Denies SI/HI.`,
    objective: `Mental status: alert, oriented x3, cooperative. Speech normal rate. Affect bright, mood euthymic. Engaged in session. Insight good, judgment fair-to-good. No psychomotor abnormalities.`,
    assessment: `${appointment.modality === 'family' ? 'Family therapy' : 'Individual therapy'} progressing well. Patient demonstrating increased use of coping skills in vivo. Symptom reduction noted across sessions. Continue current treatment trajectory.`,
    plan: `Continue weekly sessions. Reinforce grounding technique practice. Introduce cognitive restructuring in next session. Review progress in 4 weeks. Crisis resources confirmed.`,
  };
}
