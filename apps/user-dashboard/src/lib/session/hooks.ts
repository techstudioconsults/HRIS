'use client';

import { useSessionContext } from './context';
import type { UseSessionReturn } from './types';

/**
 * Drop-in replacement for next-auth/react's useSession().
 * Returns { data, status } with the same shape as NextAuth's Session.
 *
 * Migration: change import path only —
 *   from: import { useSession } from 'next-auth/react'
 *   to:   import { useSession } from '@/lib/session'
 */
export function useSession(): UseSessionReturn {
  return useSessionContext();
}
