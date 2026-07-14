'use client';

import * as React from 'react';
import { useRole } from '@/lib/role-context';
import { useAuth, type AuthUser } from '@/lib/auth-context';
import {
  users,
  patients,
  appointments,
  ROLE_LABELS,
  type Role,
  type User,
  type Patient,
} from '@/lib/mockData';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Search,
  Send,
  Users as UsersIcon,
  Stethoscope,
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  CircleDot,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  /** "patient" or "team" */
  kind: 'patient' | 'team';
  /** Display name */
  name: string;
  /** Subtitle — role or patient DOB */
  subtitle: string;
  /** Avatar initials */
  initials: string;
  /** User/patient id for routing messages */
  participantId: string;
  /** Pre-seeded messages */
  messages: ChatMessage[];
  unread: number;
  /** ISO timestamp of last message, for sorting */
  lastMessageAt: string;
}

/* ------------------------------------------------------------------ */
/*  Mock conversation seeds                                            */
/* ------------------------------------------------------------------ */

function seedConversationsFor(currentUser: AuthUser): Conversation[] {
  const convos: Conversation[] = [];

  // --- Patients: derived from appointments assigned to this provider ---
  const myPatientIds = new Set<string>();
  for (const apt of appointments) {
    if (apt.providerId === currentUser.id) {
      myPatientIds.add(apt.patientId);
    }
  }

  for (const pid of Array.from(myPatientIds)) {
    const patient = patients.find((p) => p.id === pid);
    if (!patient) continue;

    const isJordan = patient.id === 'pt-001';
    const isEmma = patient.id === 'pt-004';
    const isChen = patient.id === 'pt-005';

    convos.push({
      id: `conv-patient-${patient.id}`,
      kind: 'patient',
      name: patient.name,
      subtitle: `Patient • DOB ${patient.dateOfBirth}`,
      initials: patient.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase(),
      participantId: patient.id,
      unread: isJordan ? 2 : 0,
      lastMessageAt: isJordan
        ? '2026-07-13T10:30:00Z'
        : isEmma
          ? '2026-07-12T15:00:00Z'
          : '2026-07-11T09:00:00Z',
      messages: isJordan
        ? [
            {
              id: 'm1',
              senderId: patient.id,
              text: 'Hi Dr. Nair, I just wanted to confirm our appointment tomorrow at 9 AM.',
              timestamp: '2026-07-13T09:00:00Z',
              status: 'read',
            },
            {
              id: 'm2',
              senderId: currentUser.id,
              text: 'Hi Jordan! Yes, 9 AM via telehealth. Looking forward to it.',
              timestamp: '2026-07-13T09:15:00Z',
              status: 'read',
            },
            {
              id: 'm3',
              senderId: patient.id,
              text: 'I have been practicing the breathing exercises you showed me.',
              timestamp: '2026-07-13T10:20:00Z',
              status: 'delivered',
            },
            {
              id: 'm4',
              senderId: patient.id,
              text: 'They really helped with the panic attack I had at work yesterday.',
              timestamp: '2026-07-13T10:30:00Z',
              status: 'delivered',
            },
          ]
        : isEmma
          ? [
              {
                id: 'm5',
                senderId: patient.id,
                text: 'My mom wanted me to ask if we can move our session to 3 PM next week.',
                timestamp: '2026-07-12T15:00:00Z',
                status: 'read',
              },
            ]
          : isChen
            ? [
                {
                  id: 'm6',
                  senderId: currentUser.id,
                  text: 'Looking forward to our family session on Tuesday.',
                  timestamp: '2026-07-11T09:00:00Z',
                  status: 'read',
                },
              ]
            : [
                {
                  id: 'm7',
                  senderId: currentUser.id,
                  text: 'Just a reminder about your upcoming appointment.',
                  timestamp: '2026-07-10T12:00:00Z',
                  status: 'read',
                },
              ],
    });
  }

  // --- Team members: same org, exclude self ---
  const teammates = users.filter(
    (u) => u.orgId === currentUser.orgId && u.id !== currentUser.id
  );

  for (const member of teammates) {
    const isSupervisor = member.id === 'user-005';
    const isManager = member.id === 'user-002';
    const isMaya = member.id === 'user-009';

    convos.push({
      id: `conv-team-${member.id}`,
      kind: 'team',
      name: member.name,
      subtitle: ROLE_LABELS[member.role],
      initials: member.initials,
      participantId: member.id,
      unread: isMaya ? 1 : 0,
      lastMessageAt: isMaya
        ? '2026-07-13T11:00:00Z'
        : isSupervisor
          ? '2026-07-12T14:00:00Z'
          : isManager
            ? '2026-07-11T16:00:00Z'
            : '2026-07-10T10:00:00Z',
      messages: isMaya
        ? [
            {
              id: 'tm1',
              senderId: member.id,
              text: 'Hi, I just finished my session with Maria Sato. Could you review the note when you get a chance?',
              timestamp: '2026-07-13T11:00:00Z',
              status: 'delivered',
            },
          ]
        : isSupervisor
          ? [
              {
                id: 'tm2',
                senderId: member.id,
                text: 'Just reviewed the cosign queue. Everything looks good for this week.',
                timestamp: '2026-07-12T14:00:00Z',
                status: 'read',
              },
            ]
          : isManager
            ? [
                {
                  id: 'tm3',
                  senderId: member.id,
                  text: 'The schedule for next week is published. Let me know if you need any changes.',
                  timestamp: '2026-07-11T16:00:00Z',
                  status: 'read',
                },
              ]
            : [
                {
                  id: 'tm4',
                  senderId: currentUser.id,
                  text: 'Thanks for the update!',
                  timestamp: '2026-07-10T10:00:00Z',
                  status: 'read',
                },
              ],
    });
  }

  // Sort by last message time descending
  convos.sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
  return convos;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatRelativeDay(iso: string): string {
  const d = new Date(iso);
  const now = new Date('2026-07-13T12:00:00Z');
  const diffDays = Math.floor((now.getTime() - d.getTime()) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return formatTime(iso);
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/* ------------------------------------------------------------------ */
/*  Main page                                                          */
/* ------------------------------------------------------------------ */

export default function MessagesPage() {
  const { user } = useRole();
  const { user: authUser } = useAuth();
  const currentUser = authUser ?? user;

  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<'all' | 'patient' | 'team'>('all');
  const [search, setSearch] = React.useState('');
  const [draft, setDraft] = React.useState('');
  const [mobileView, setMobileView] = React.useState<'list' | 'chat'>('list');

  // Seed conversations once we know the current user
  React.useEffect(() => {
    if (currentUser) {
      const seeded = seedConversationsFor(currentUser);
      setConversations(seeded);
      if (seeded.length > 0) {
        setActiveId(seeded[0].id);
      }
    }
  }, [currentUser]);

  // Filtered conversations for the sidebar
  const filteredConversations = React.useMemo(() => {
    return conversations.filter((c) => {
      if (filter !== 'all' && c.kind !== filter) return false;
      if (search.trim() && !c.name.toLowerCase().includes(search.trim().toLowerCase()))
        return false;
      return true;
    });
  }, [conversations, filter, search]);

  const activeConvo = React.useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  // Mark conversation as read when opened
  React.useEffect(() => {
    if (activeConvo && activeConvo.unread > 0) {
      setConversations((prev) =>
        prev.map((c) => (c.id === activeConvo.id ? { ...c, unread: 0 } : c))
      );
    }
  }, [activeId]);

  const handleSelectConvo = (id: string) => {
    setActiveId(id);
    setMobileView('chat');
  };

  const handleSend = () => {
    if (!draft.trim() || !activeConvo || !currentUser) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: draft.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeConvo.id
          ? {
              ...c,
              messages: [...c.messages, newMsg],
              lastMessageAt: newMsg.timestamp,
            }
          : c
      )
    );
    setDraft('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!currentUser) {
    return (
      <div className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
        <p className="text-body text-text-muted">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden bg-surface">
      {/* ---------------------------------------------------------------- */}
      {/*  Chat list sidebar                                                */}
      {/* ---------------------------------------------------------------- */}
      <div
        className={cn(
          'flex w-full flex-col border-r border-border md:w-80 lg:w-96',
          mobileView === 'chat' && 'hidden md:flex'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-h4 font-semibold text-text-primary">Messages</h2>
          <div className="flex items-center gap-1">
            <span className="rounded-full bg-brand-primary/10 px-2 py-0.5 text-caption font-medium text-brand-primary">
              {conversations.length} chats
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations"
              className="h-9 pl-8 text-body-sm"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 px-3 py-2">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'patient', label: 'Patients' },
              { key: 'team', label: 'Team' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                'flex items-center gap-1 rounded-md px-2.5 py-1.5 text-caption font-medium transition-colors',
                filter === tab.key
                  ? 'bg-brand-primary text-brand-primary-foreground'
                  : 'text-text-muted hover:bg-surface-sunken'
              )}
            >
              {tab.key === 'patient' && <UsersIcon className="h-3 w-3" />}
              {tab.key === 'team' && <Stethoscope className="h-3 w-3" />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Conversation list */}
        <ScrollArea className="flex-1">
          <div className="px-2 pb-2">
            {filteredConversations.length === 0 && (
              <p className="px-2 py-8 text-center text-body-sm text-text-muted">
                No conversations found.
              </p>
            )}
            {filteredConversations.map((convo) => {
              const isActive = convo.id === activeId;
              const lastMsg = convo.messages[convo.messages.length - 1];
              const lastText = lastMsg
                ? lastMsg.senderId === currentUser.id
                  ? `You: ${lastMsg.text}`
                  : lastMsg.text
                : '';

              return (
                <button
                  key={convo.id}
                  onClick={() => handleSelectConvo(convo.id)}
                  className={cn(
                    'flex w-full items-start gap-3 rounded-lg px-2.5 py-2.5 text-left transition-colors',
                    isActive
                      ? 'bg-accent'
                      : 'hover:bg-surface-sunken'
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className={cn(
                          'text-caption font-semibold',
                          convo.kind === 'patient'
                            ? 'bg-info/15 text-info'
                            : 'bg-brand-primary/15 text-brand-primary'
                        )}
                      >
                        {convo.initials}
                      </AvatarFallback>
                    </Avatar>
                    {convo.kind === 'patient' ? (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-surface">
                        <UsersIcon className="h-3 w-3 text-text-secondary" />
                      </span>
                    ) : (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-surface">
                        <Stethoscope className="h-3 w-3 text-text-secondary" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-body-sm font-medium text-text-primary">
                        {convo.name}
                      </span>
                      <span className="shrink-0 text-caption text-text-muted">
                        {formatRelativeDay(convo.lastMessageAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-caption text-text-muted">
                        {lastText || convo.subtitle}
                      </span>
                      {convo.unread > 0 && (
                        <span className="flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-brand-primary px-1 text-caption font-semibold text-brand-primary-foreground">
                          {convo.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/*  Conversation view                                                */}
      {/* ---------------------------------------------------------------- */}
      <div
        className={cn(
          'flex flex-1 flex-col',
          mobileView === 'list' && 'hidden md:flex'
        )}
      >
        {activeConvo ? (
          <>
            {/* Chat header */}
            <div className="flex items-center gap-3 border-b border-border bg-surface px-4 py-2.5">
              <button
                onClick={() => setMobileView('list')}
                className="rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken md:hidden"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <Avatar className="h-9 w-9">
                <AvatarFallback
                  className={cn(
                    'text-caption font-semibold',
                    activeConvo.kind === 'patient'
                      ? 'bg-info/15 text-info'
                      : 'bg-brand-primary/15 text-brand-primary'
                  )}
                >
                  {activeConvo.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate text-body-sm font-semibold text-text-primary">
                  {activeConvo.name}
                </p>
                <p className="truncate text-caption text-text-muted">
                  {activeConvo.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken">
                  <Video className="h-4 w-4" />
                </button>
                <button className="rounded-md p-1.5 text-text-secondary hover:bg-surface-sunken">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1.5 px-4 py-4">
                {activeConvo.messages.map((msg, idx) => {
                  const isMe = msg.senderId === currentUser.id;
                  const prevMsg = activeConvo.messages[idx - 1];
                  const showAvatar =
                    !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId);

                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-end gap-2',
                        isMe ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {!isMe && (
                        <div className="w-7 shrink-0">
                          {showAvatar && (
                            <Avatar className="h-7 w-7">
                              <AvatarFallback
                                className={cn(
                                  'text-caption font-semibold',
                                  activeConvo.kind === 'patient'
                                    ? 'bg-info/15 text-info'
                                    : 'bg-brand-primary/15 text-brand-primary'
                                )}
                              >
                                {activeConvo.initials}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )}

                      <div
                        className={cn(
                          'max-w-[75%] rounded-lg px-3 py-2',
                          isMe
                            ? 'rounded-br-sm bg-brand-primary text-brand-primary-foreground'
                            : 'rounded-bl-sm bg-surface-sunken text-text-primary'
                        )}
                      >
                        <p className="text-body-sm leading-relaxed">{msg.text}</p>
                        <div className="mt-0.5 flex items-center justify-end gap-1">
                          <span
                            className={cn(
                              'text-caption',
                              isMe ? 'text-brand-primary-foreground/70' : 'text-text-muted'
                            )}
                          >
                            {formatTime(msg.timestamp)}
                          </span>
                          {isMe && (
                            <span
                              className={cn(
                                'text-caption',
                                msg.status === 'read'
                                  ? 'text-brand-primary-foreground/70'
                                  : 'text-brand-primary-foreground/50'
                              )}
                            >
                              {msg.status === 'read' ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Input bar */}
            <div className="border-t border-border bg-surface px-4 py-3">
              <div className="flex items-center gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message…"
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!draft.trim()}
                  size="icon"
                  className="h-9 w-9 shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-sunken">
                <Search className="h-5 w-5 text-text-muted" />
              </div>
              <p className="text-body text-text-muted">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
