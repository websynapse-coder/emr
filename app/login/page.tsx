'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Mail, Lock, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      router.push('/dashboard');
    }, 400);
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
            <h1 className="text-h4 font-semibold text-text-primary">Welcome back</h1>
            <p className="text-caption text-text-muted">Sign in to your organization</p>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@organization.com"
                  className="pl-9"
                  autoFocus
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-body-sm text-text-primary">Password</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-9"
                />
              </div>
            </div>

            {error && (
              <p className="text-caption text-danger">{error}</p>
            )}

            <Button type="submit" className="w-full gap-1.5" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
              {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-caption text-text-muted">
          Don&apos;t have an organization yet?{' '}
          <button
            onClick={() => router.push('/')}
            className="font-medium text-brand-primary hover:underline"
          >
            Contact Sales
          </button>
        </p>
      </div>
    </div>
  );
}
