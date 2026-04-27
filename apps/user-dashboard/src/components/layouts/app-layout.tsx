'use client';

import React from 'react';

import type { AppLayoutProps } from './types';

/**
 * AppLayout - Optimized for PWA (installed app mode)
 *
 * Features:
 * - Handles safe areas (notches, home indicator bars)
 * - No browser chrome UI
 * - Tighter, native app-like spacing
 * - Full viewport utilization
 */
export type { AppLayoutProps } from './types';

export function AppLayout({ children, header, footer, nav }: AppLayoutProps) {
  return (
    <div className="app-layout bg-background">
      {/* Header - with safe-area-top */}
      {header && (
        <header className="app-layout__header safe-area-top bg-background">
          {header}
        </header>
      )}

      {/* Main Content - only scrollable region in the app shell */}
      <main className="app-layout__main safe-area-bottom">
        <div className="safe-area-x">{children}</div>
      </main>

      {/* Bottom Navigation - with safe-area-bottom */}
      {nav && (
        <nav className="app-layout__dock fixed my-5 w-full bottom-0 safe-area-bottom">
          {nav}
        </nav>
      )}

      {/* Footer */}
      {footer && (
        <footer className="app-layout__footer safe-area-bottom bg-muted/30 text-xs text-muted-foreground">
          {footer}
        </footer>
      )}
    </div>
  );
}
