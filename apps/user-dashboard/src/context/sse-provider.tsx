'use client';

import { useNotifications } from '@/lib/sse/use-notifications';
import type { Handler } from '@/lib/sse/types';
import { useSession } from '@/lib/session';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from 'react';

import { type SSEContextValue } from './types';

const SSEContext = createContext<SSEContextValue | null>(null);

export function SSEProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  const userId = session?.user?.id;
  const employeeId = session?.user?.employee?.id;
  const token = session?.tokens?.accessToken;

  // User-level channel: general notifications (wallet, payroll approvals, etc.)
  const userChannel = useNotifications(
    userId ? `notifications/users/${userId}` : undefined,
    token
  );

  // Payroll-level channel: payroll-specific notifications for this employee
  const payrollChannel = useNotifications(
    employeeId ? `notifications/payrolls/${employeeId}` : undefined,
    token
  );

  // Unified subscriber — registers the handler on both channels so callers
  // don't need to know which channel emits which event.
  // Cast restores the generic <T> signature that useCallback cannot preserve.
  const on = useCallback(
    (event: string, handler: Handler<unknown>) => {
      const offUser = userChannel.on(event, handler);
      const offPayroll = payrollChannel.on(event, handler);
      return () => {
        offUser();
        offPayroll();
      };
    },
    [userChannel.on, payrollChannel.on]
  ) as typeof userChannel.on;

  // Close both connections
  const close = useCallback(() => {
    userChannel.close();
    payrollChannel.close();
  }, [userChannel.close, payrollChannel.close]);

  // Report open if either channel is live
  const status = useMemo(
    () =>
      userChannel.status === 'open' || payrollChannel.status === 'open'
        ? 'open'
        : userChannel.status,
    [userChannel.status, payrollChannel.status]
  );

  const getStatus = useCallback(
    () => (status === 'open' ? 'open' : userChannel.getStatus()),
    [status, userChannel.getStatus]
  );

  const value = useMemo<SSEContextValue>(
    () => ({ on, close, getStatus, status }),
    [on, close, getStatus, status]
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
