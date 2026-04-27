'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import type { HrisSession, SessionStatus, UseSessionReturn } from './types';

const SessionContext = createContext<UseSessionReturn>({
  data: null,
  status: 'loading',
  refresh: async () => {},
});

async function fetchToken(): Promise<{
  data: HrisSession | null;
  status: SessionStatus;
}> {
  try {
    const res = await fetch('/api/auth/token', { cache: 'no-store' });
    if (!res.ok) return { data: null, status: 'unauthenticated' };
    const json = await res.json();
    return {
      data: {
        user: json.user,
        tokens: { accessToken: json.accessToken },
        expires: json.expires,
      },
      status: 'authenticated',
    };
  } catch {
    return { data: null, status: 'unauthenticated' };
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<HrisSession | null>(null);
  const [status, setStatus] = useState<SessionStatus>('loading');

  const refresh = useCallback(async () => {
    const result = await fetchToken();
    setData(result.data);
    setStatus(result.status);
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const result = await fetchToken();
      if (!cancelled) {
        setData(result.data);
        setStatus(result.status);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SessionContext.Provider value={{ data, status, refresh }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext(): UseSessionReturn {
  return useContext(SessionContext);
}
