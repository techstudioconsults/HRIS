import { create } from 'zustand';

import type { AuthActions, AuthState } from '../types';

export type { AuthActions, AuthState } from '../types';

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  sessionExpiry: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  logout: () =>
    set({ user: null, isAuthenticated: false, sessionExpiry: null }),
  setSessionExpiry: (expiry) => set({ sessionExpiry: expiry }),
}));
