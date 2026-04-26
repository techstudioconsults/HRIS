'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import type { SessionProviderProperties } from './types';

export function SessionProvider({ children }: SessionProviderProperties) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
