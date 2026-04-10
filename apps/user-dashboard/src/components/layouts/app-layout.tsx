'use client';

import React from 'react';

/**
 * AppLayout - Optimized for PWA (installed app mode)
 *
 * Features:
 * - Handles safe areas (notches, home indicator bars)
 * - No browser chrome UI
 * - Tighter, native app-like spacing
 * - Full viewport utilization
 */
export interface AppLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  nav?: React.ReactNode;
}

export function AppLayout({ children, header, footer, nav }: AppLayoutProps) {
  return (
    <div className="app-layout flex h-screen flex-col bg-background">
      {/* Header - with safe-area-top */}
      {header && (
        <header className="safe-area-top bg-background">{header}</header>
      )}

      {/* Main Content - flex-grow */}
      <main className="flex-1 overflow-auto">
        <div className="safe-area-x">{children}</div>
      </main>

      {/* Bottom Navigation - with safe-area-bottom */}
      {nav && <nav className="safe-area-bottom bg-background">{nav}</nav>}

      {/* Footer */}
      {footer && (
        <footer className="safe-area-bottom bg-muted/30 text-xs text-muted-foreground">
          {footer}
        </footer>
      )}
    </div>
  );
}
