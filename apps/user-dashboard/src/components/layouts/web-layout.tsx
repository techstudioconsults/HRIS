'use client';

import React from 'react';

import type { WebLayoutProps } from './types';

/**
 * WebLayout - Optimized for browser viewing
 *
 * Features:
 * - Accommodates browser chrome (address bar, etc.)
 * - Install prompt space
 * - Standard web app spacing
 * - Responsive to browser window
 */
export type { WebLayoutProps } from './types';

export function WebLayout({
  children,
  header,
  footer,
  sidebar,
}: WebLayoutProps) {
  return (
    <div className="web-layout flex min-h-screen flex-col bg-background">
      {/* Header */}
      {header && (
        <header className="border-b border-border bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{header}</div>
        </header>
      )}

      {/* Main Content with optional Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar (if provided) */}
        {sidebar && (
          <aside className="hidden w-64 border-r border-border bg-muted/30 md:block">
            <div className="p-4">{sidebar}</div>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="border-t border-border bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground sm:px-6 lg:px-8">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
