import { type UseNotificationsReturn } from '@/lib/sse/use-notifications';

export type ThemeContextType = {
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
};

export type SSEContextValue = Pick<
  UseNotificationsReturn,
  'on' | 'close' | 'getStatus' | 'status'
>;

// ── ActiveTarget context ──────────────────────────────────────────────────────

export interface ActiveTarget<T = unknown> {
  entity: T | null;
  set: (value: T | null) => void;
}
