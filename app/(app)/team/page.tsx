'use client';

import * as React from 'react';
import { UserPlus, Mail, Clock, CheckCircle2, Trash2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useRole } from '@/lib/role-context';
import {
  ROLE_LABELS,
  ROLE_ORDER,
  teamInvites,
  users,
  type Role,
  type TeamInvite,
  type User,
} from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

/* ------------------------------------------------------------------ */
/*  Team management page                                               */
/* ------------------------------------------------------------------ */

export default function TeamPage() {
  const { organization } = useRole();

  const [invites, setInvites] = React.useState<TeamInvite[]>(
    teamInvites.filter((i) => i.status === 'pending')
  );
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [role, setRole] = React.useState<Role>('provider');

  const activeMembers = users.filter(
    (u) => u.orgId === organization.id && u.role !== 'patient'
  );

  const sendInvite = () => {
    if (!email.trim()) return;
    const newInvite: TeamInvite = {
      id: `inv-${Date.now()}`,
      email: email.trim(),
      name: name.trim() || email.split('@')[0],
      role,
      status: 'pending',
      invitedAt: new Date().toISOString().slice(0, 10),
    };
    setInvites((prev) => [newInvite, ...prev]);
    setEmail('');
    setName('');
    setRole('provider');
  };

  const revokeInvite = (id: string) => {
    setInvites((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-h1 font-bold text-text-primary">Team</h1>
        <p className="text-body text-text-secondary">
          Invite teammates and manage their access in {organization.shortName}.
        </p>
      </div>

      {/* Invite form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <UserPlus className="h-5 w-5 text-brand-primary" aria-hidden="true" />
            Invite a teammate
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            They&rsquo;ll receive an email invitation (mock — no real email is sent).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
            <div className="space-y-1.5 lg:col-span-1">
              <Label className="text-body-sm text-text-primary">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Avery"
              />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <Label className="text-body-sm text-text-primary">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@harborline.org"
              />
            </div>
            <div className="space-y-1.5 lg:col-span-1">
              <Label className="text-body-sm text-text-primary">Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_ORDER.map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-1">
              <Button
                onClick={sendInvite}
                disabled={!email.trim()}
                className="w-full gap-1.5"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Send invite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending invites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <Clock className="h-5 w-5 text-warning" aria-hidden="true" />
            Pending invites
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            Awaiting acceptance
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {invites.length === 0 ? (
            <div className="px-6 py-8 text-center text-body-sm text-text-muted">
              No pending invites. Send one above to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name / Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-body-sm font-medium text-text-primary">
                          {inv.name}
                        </span>
                        <span className="text-caption text-text-muted">
                          {inv.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-body-sm text-text-secondary">
                        {ROLE_LABELS[inv.role]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'border-warning/40 bg-warning/10 text-caption font-semibold text-warning'
                        )}
                      >
                        Pending
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-caption text-text-muted">
                        {inv.invitedAt}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-text-muted hover:text-danger"
                        onClick={() => revokeInvite(inv.id)}
                        aria-label="Revoke invite"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Active team */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-h4 text-text-primary">
            <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
            Active team
          </CardTitle>
          <CardDescription className="text-body-sm text-text-muted">
            {activeMembers.length} members in {organization.shortName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeMembers.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-brand-primary/15 text-caption font-semibold text-brand-primary">
                          {m.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-body-sm font-medium text-text-primary">
                          {m.name}
                        </span>
                        <span className="text-caption text-text-muted">
                          {m.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm text-text-secondary">
                      {m.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-body-sm text-text-secondary">
                      {ROLE_LABELS[m.role]}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'border-success/30 bg-success/10 text-caption font-semibold text-success'
                      )}
                    >
                      Active
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
