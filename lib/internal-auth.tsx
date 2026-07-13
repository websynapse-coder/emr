'use client';

import * as React from 'react';

interface InternalAuthValue {
  isAuthed: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const InternalAuthContext = React.createContext<InternalAuthValue | null>(null);

const VALID_USERNAME = 'moon_Admin';
const VALID_PASSWORD = 'normal@2026';

export function InternalAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthed, setIsAuthed] = React.useState(false);

  const login = React.useCallback((username: string, password: string) => {
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthed(true);
      return true;
    }
    return false;
  }, []);

  const logout = React.useCallback(() => {
    setIsAuthed(false);
  }, []);

  const value = React.useMemo(
    () => ({ isAuthed, login, logout }),
    [isAuthed, login, logout]
  );

  return (
    <InternalAuthContext.Provider value={value}>
      {children}
    </InternalAuthContext.Provider>
  );
}

export function useInternalAuth(): InternalAuthValue {
  const ctx = React.useContext(InternalAuthContext);
  if (!ctx) {
    throw new Error('useInternalAuth must be used within <InternalAuthProvider>.');
  }
  return ctx;
}
