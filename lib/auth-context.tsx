'use client';

import * as React from 'react';
import mockData from '@/lib/mock-data.json';
import type { Role } from '@/lib/mockData';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  orgId: string;
  title: string;
  initials: string;
}

interface SessionData {
  user: AuthUser;
  expiresAt: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => AuthUser | null;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'moonaria-session';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

function isSessionValid(session: SessionData | null): session is SessionData {
  if (!session) return false;
  return session.expiresAt > Date.now();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  // Restore session on mount
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const session: SessionData = JSON.parse(raw);
        if (isSessionValid(session)) {
          setUser(session.user);
        } else {
          sessionStorage.removeItem(SESSION_KEY);
        }
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  const login = React.useCallback((email: string, password: string): AuthUser | null => {
    const match = mockData.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!match) return null;

    const authUser: AuthUser = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: match.role as Role,
      orgId: match.orgId,
      title: match.title,
      initials: match.initials,
    };

    const session: SessionData = {
      user: authUser,
      expiresAt: Date.now() + SESSION_TTL_MS,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setUser(authUser);
    return authUser;
  }, []);

  const logout = React.useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>.');
  }
  return ctx;
}
