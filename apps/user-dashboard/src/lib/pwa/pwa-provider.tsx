'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  isRunningAsPWA,
  getDisplayMode,
  isIOSDevice,
  isIOSPWA,
} from '@/lib/pwa/detect-pwa';

interface PWAContextType {
  isPWA: boolean;
  displayMode: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  isIOSDevice: boolean;
  isIOSPWA: boolean;
  isInitialized: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [pwaStatus, setPwaStatus] = useState<PWAContextType>({
    isPWA: false,
    displayMode: 'browser',
    isIOSDevice: false,
    isIOSPWA: false,
    isInitialized: false,
  });

  useEffect(() => {
    // Detect PWA status on mount (client-side only)
    setPwaStatus({
      isPWA: isRunningAsPWA(),
      displayMode: getDisplayMode(),
      isIOSDevice: isIOSDevice(),
      isIOSPWA: isIOSPWA(),
      isInitialized: true,
    });

    // Apply .pwa class to body for CSS hooks
    if (isRunningAsPWA()) {
      document.body.classList.add('pwa');
    } else {
      document.body.classList.remove('pwa');
    }
  }, []);

  return (
    <PWAContext.Provider value={pwaStatus}>{children}</PWAContext.Provider>
  );
}

/**
 * Hook to access PWA context throughout the app
 * Returns the current PWA detection status
 */
export function usePWA(): PWAContextType {
  const context = useContext(PWAContext);

  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}

/**
 * Convenience hook: Is the app running as PWA?
 */
export function useIsPWA(): boolean {
  const { isPWA, isInitialized } = usePWA();
  return isInitialized && isPWA;
}

/**
 * Convenience hook: Is the app running on iOS PWA?
 */
export function useIsIOSPWA(): boolean {
  const { isIOSPWA, isInitialized } = usePWA();
  return isInitialized && isIOSPWA;
}
