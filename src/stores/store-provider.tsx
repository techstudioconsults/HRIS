"use client";

import { queryClient } from "@/lib/react-query/query-client";
import { ReactNode, useEffect } from "react";

import { useAuthStore } from "./auth-store";

interface StoreProviderProperties {
  children: ReactNode;
}

/**
 * StoreProvider
 * - Centralizes app-wide Zustand side-effects
 * - Integrates with React Query to ensure cache hygiene on auth changes
 * - Handles session expiry via precise timeouts (no polling)
 */
export function StoreProvider({ children }: StoreProviderProperties) {
  // React Query hygiene when authentication state changes (logout, token invalidation, etc.)
  useEffect(() => {
    const clearReactQuery = async () => {
      try {
        await queryClient.cancelQueries();
      } catch {
        // ignore
      }

      const anyClient = queryClient as unknown as {
        clear?: () => void;
        getQueryCache?: () => { clear: () => void };
        getMutationCache?: () => { clear: () => void };
      };

      // v5: clear(); v4: clear caches via query/mutation cache
      anyClient.clear?.();
      anyClient.getQueryCache?.().clear?.();
      anyClient.getMutationCache?.().clear?.();
    };

    // Track changes to isAuthenticated without subscribeWithSelector middleware
    let previous = useAuthStore.getState().isAuthenticated;
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (state.isAuthenticated !== previous) {
        previous = state.isAuthenticated;
        if (!state.isAuthenticated) void clearReactQuery();
      }
    });

    // Initial hygiene on mount (e.g., SSR hydration with unauthenticated state)
    if (!previous) {
      void clearReactQuery();
    }

    return () => {
      unsubscribe();
    };
  }, []);

  // Handle session expiry with an exact timeout (no interval/polling)
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const scheduleLogoutOnExpiry = (expiry: Date | null) => {
      if (timeoutId) clearTimeout(timeoutId);
      if (!expiry) return;

      const msUntilExpiry = expiry.getTime() - Date.now();
      if (msUntilExpiry <= 0) {
        // Already expired
        useAuthStore.getState().logout();
        return;
      }

      timeoutId = setTimeout(() => {
        useAuthStore.getState().logout();
      }, msUntilExpiry);
    };

    // Prime from current state
    let previousExpiry = useAuthStore.getState().sessionExpiry;
    scheduleLogoutOnExpiry(previousExpiry);

    // Subscribe to changes in session expiry and reschedule timeout precisely
    const unsubscribe = useAuthStore.subscribe((state) => {
      if (state.sessionExpiry !== previousExpiry) {
        previousExpiry = state.sessionExpiry;
        scheduleLogoutOnExpiry(previousExpiry);
      }
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  return <>{children}</>;
}

/**
 * Aggregated store hooks for convenience
 * - Prefer selecting only the state you need in components to minimize re-renders.
 */
export const useStores = () => {
  const authStore = useAuthStore();

  return {
    auth: authStore,
  };
};
