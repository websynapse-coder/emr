'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  Clock,
  FileText,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  clinicalNotes,
  getNotesForSupervisor,
  providerProfiles,
  users,
  NOTE_STATUS_LABELS,
  type ClinicalNote,
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

/* ------------------------------------------------------------------ */
/*  Supervisor cosign queue page                                       */
/* ------------------------------------------------------------------ */

export default function NotesReviewPage() {
  // Dr. Priya Nair (user-003) is the supervisor for Maya Castellanos (user-009)
  const supervisorId = 'user-003';
  const pendingNotes = getNotesForSupervisor(supervisorId);

  // Also show already-cosigned notes for history
  const cosignedNotes = clinicalNotes.filter(
    (n) => n.supervisorId === supervisorId && n.status === 'cosigned'
  );

  const [notes, setNotes] = React.useState<ClinicalNote[]>([
    ...pendingNotes,
    ...cosignedNotes,
  ]);

  const approveNote = (noteId: string) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? {
              ...n,
              status: 'cosigned',
              cosignedAt: new Date().toISOString(),
            }
          : n
      )
    );
  };

  const pending = notes.filter((n) => n.status === 'awaiting-cosign');
  const cosigned = notes.filter((n) => n.status === 'cosigned');

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Notes to Review</h1>
        <p className="text-body text-text-secondary">
          Clinical notes from associate-level providers awaiting your cosign.
        </p>
      </div>

      {/* Pending */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Clock className="h-5 w-5 text-warning" aria-hidden="true" />
            Awaiting cosign
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {pending.length} note{pending.length !== 1 ? 's' : ''} need your review
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pending.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 text-center">
              <CheckCircle2 className="h-8 w-8 text-success" aria-hidden="true" />
              <p className="text-body-sm text-text-secondary">
                All caught up — no notes awaiting cosign.
              </p>
            </div>
          ) : (
            pending.map((note) => (
              <NoteReviewCard
                key={note.id}
                note={note}
                onApprove={() => approveNote(note.id)}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Cosigned history */}
      {cosigned.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
              <FileCheck2 className="h-5 w-5 text-success" aria-hidden="true" />
              Cosigned
            </CardTitle>
            <CardDescription className="text-body-sm text-text-muted">
              Recently approved notes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {cosigned.map((note) => (
              <CosignedRow key={note.id} note={note} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Note review card (pending)                                          */
/* ------------------------------------------------------------------ */

function NoteReviewCard({
  note,
  onApprove,
}: {
  note: ClinicalNote;
  onApprove: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const provider = users.find((u) => u.id === note.providerId);
  const providerProfile = providerProfiles.find((p) => p.userId === note.providerId);

  return (
    <div
      className={cn(
        'rounded-md border border-border bg-surface',
        'overflow-hidden'
      )}
    >
      {/* Header row */}
      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-warning/15 text-caption font-semibold text-warning">
              {provider?.initials ?? '??'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-body-sm font-medium text-text-primary">
              {note.patientName}
            </p>
            <p className="text-caption text-text-muted">
              {note.providerName} · {note.date} · {note.sessionType === 'telehealth' ? 'Telehealth' : 'In-Person'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {providerProfile?.isAssociate && (
            <Badge
              variant="outline"
              className="border-info/30 bg-info/10 text-caption font-semibold text-info"
            >
              <GraduationCap className="mr-1 h-3 w-3" aria-hidden="true" />
              Associate
            </Badge>
          )}
          <Badge
            variant="outline"
            className="border-warning/40 bg-warning/10 text-caption font-semibold text-warning"
          >
            {NOTE_STATUS_LABELS[note.status]}
          </Badge>
        </div>
      </div>

      {/* Expand/collapse toggle */}
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className={cn(
          'flex w-full items-center gap-1.5 border-t border-border px-4 py-2',
          'text-caption text-text-muted transition-colors hover:bg-surface-sunken'
        )}
      >
        <FileText className="h-3.5 w-3.5" aria-hidden="true" />
        {expanded ? 'Hide note' : 'Review note'}
        <ArrowRight
          className={cn('h-3.5 w-3.5 transition-transform', expanded && 'rotate-90')}
          aria-hidden="true"
        />
      </button>

      {/* SOAP content */}
      {expanded && (
        <div className="space-y-3 border-t border-border p-4">
          <SoapPreview label="Subjective" content={note.soap.subjective} />
          <SoapPreview label="Objective" content={note.soap.objective} />
          <SoapPreview label="Assessment" content={note.soap.assessment} />
          <SoapPreview label="Plan" content={note.soap.plan} />

          <div className="flex items-center justify-end gap-2 pt-2">
            <Link href={`/encounter/${note.appointmentId}`}>
              <Button variant="outline" className="gap-1.5">
                View full encounter
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Button>
            </Link>
            <Button onClick={onApprove} className="gap-1.5">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              Approve &amp; Cosign
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function SoapPreview({ label, content }: { label: string; content: string }) {
  return (
    <div>
      <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </p>
      <p className="mt-0.5 text-body-sm leading-relaxed text-text-secondary">
        {content}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cosigned row (history)                                             */
/* ------------------------------------------------------------------ */

function CosignedRow({ note }: { note: ClinicalNote }) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-md border border-border',
        'bg-surface px-4 py-2.5'
      )}
    >
      <CheckCircle2 className="h-5 w-5 shrink-0 text-success" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-body-sm font-medium text-text-primary">
          {note.patientName}
        </p>
        <p className="truncate text-caption text-text-muted">
          {note.providerName} · {note.date}
        </p>
      </div>
      <Badge
        variant="outline"
        className="border-success/30 bg-success/10 text-caption font-semibold text-success"
      >
        Cosigned
      </Badge>
    </div>
  );
}
