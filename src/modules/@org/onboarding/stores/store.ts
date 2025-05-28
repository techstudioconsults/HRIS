/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface AuthState {
  user: any | null;
  setUser: (user: any | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
