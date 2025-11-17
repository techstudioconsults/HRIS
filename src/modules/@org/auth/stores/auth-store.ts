/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

export interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  sessionExpiry: Date | null;
}

export interface AuthActions {
  setUser: (user: any | null) => void;
  clearUser: () => void;
  logout: () => void;
  setSessionExpiry: (expiry: Date | null) => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  isAuthenticated: false,
  sessionExpiry: null,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
  logout: () => set({ user: null, isAuthenticated: false, sessionExpiry: null }),
  setSessionExpiry: (expiry) => set({ sessionExpiry: expiry }),
}));
