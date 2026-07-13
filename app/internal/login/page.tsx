'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Moon, ShieldAlert, Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useInternalAuth } from '@/lib/internal-auth';

export default function InternalLoginPage() {
  const router = useRouter();
  const { login } = useInternalAuth();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Invalid credentials');
      return;
    }
    if (login(username, password)) {
      router.push('/internal');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-sunken px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-primary text-brand-primary-foreground">
            <Moon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="text-center">
            <h1 className="text-h4 font-semibold text-text-primary">Moonaria Internal</h1>
            <p className="text-caption text-text-muted">Sales &amp; Ops Admin Panel</p>
          </div>
        </div>

        {/* Warning banner */}
        <div className="mb-4 flex items-center gap-2 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-caption text-warning-foreground">
          <ShieldAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
          Internal staff only. Not for customer use.
        </div>

        {/* Login card */}
        <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Username</Label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            {error && (
              <p className="text-caption text-danger">{error}</p>
            )}

            <Button type="submit" className="w-full gap-1.5">
              <Lock className="h-4 w-4" aria-hidden="true" />
              Sign in to Internal Admin
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-caption text-text-muted">
          Demo credentials are hardcoded for prototype use.
        </p>
      </div>
    </div>
  );
}
