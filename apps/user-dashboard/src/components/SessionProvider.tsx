'use client';

import { SessionProvider as HrisSessionProvider } from '@/lib/session';
import type { SessionProviderProperties } from './types';

export function SessionProvider({ children }: SessionProviderProperties) {
  return <HrisSessionProvider>{children}</HrisSessionProvider>;
}
