'use client';

import { useNotifications } from '@/lib/sse/use-notifications';
import { useSession } from '@/lib/session';
import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { type SSEContextValue } from './types';

const SSEContext = createContext<SSEContextValue | null>(null);

export function SSEProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const userId = session?.user?.id;
  const token = session?.tokens?.accessToken;

  const api = useNotifications(userId, token);

  const value = useMemo<SSEContextValue>(
    () => ({
      on: api.on,
      close: api.close,
      getStatus: api.getStatus,
      status: api.status,
    }),
    [api.on, api.close, api.getStatus, api.status]
  );

  return <SSEContext.Provider value={value}>{children}</SSEContext.Provider>;
}

export function useSSE(): SSEContextValue {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error('useSSE must be used within SSEProvider');
  }
  return context;
}
