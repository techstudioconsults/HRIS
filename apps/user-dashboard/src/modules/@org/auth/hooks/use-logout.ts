'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

import { useAuthStore } from '../stores/auth-store';

export function useLogout() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  return useCallback(async () => {
    await fetch('/api/auth/session', { method: 'DELETE' });
    logout();
    router.push('/login');
  }, [logout, router]);
}
