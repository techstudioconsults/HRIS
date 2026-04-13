'use client';

import React from 'react';
import { usePWA } from '@/lib/pwa/pwa-provider';
import { AppLayout } from './app-layout';
import { WebLayout } from './web-layout';

interface LayoutSelectorSlots {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  nav?: React.ReactNode;
  sidebar?: React.ReactNode;
}

/**
 * LayoutSelector - Automatically picks AppLayout or WebLayout
 *
 * This component handles the logic of choosing the right layout
 * based on whether the app is running as PWA or in browser.
 *
 * Usage:
 * <LayoutSelector>{children}</LayoutSelector>
 *
 * For advanced route shells, use renderPWA/renderWeb to customize wrappers
 * while reusing the central PWA detection logic.
 */
export interface LayoutSelectorProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  nav?: React.ReactNode; // Bottom nav for PWA
  sidebar?: React.ReactNode; // Sidebar for Web
  renderPWA?: (slots: LayoutSelectorSlots) => React.ReactNode;
  renderWeb?: (slots: LayoutSelectorSlots) => React.ReactNode;
}

export function LayoutSelector({
  children,
  header,
  footer,
  nav,
  sidebar,
  renderPWA,
  renderWeb,
}: LayoutSelectorProps) {
  const { isPWA, isInitialized } = usePWA();

  const slots: LayoutSelectorSlots = {
    children,
    header,
    footer,
    nav,
    sidebar,
  };

  // Default to web shell during initialization to avoid a PWA-first flash on desktop refresh.
  if (!isInitialized) {
    if (renderWeb) {
      return <>{renderWeb(slots)}</>;
    }

    return (
      <WebLayout header={header} footer={footer} sidebar={sidebar}>
        {children}
      </WebLayout>
    );
  }

  // Render based on context
  if (isPWA) {
    if (renderPWA) {
      return <>{renderPWA(slots)}</>;
    }

    return (
      <AppLayout header={header} footer={footer} nav={nav}>
        {children}
      </AppLayout>
    );
  }

  if (renderWeb) {
    return <>{renderWeb(slots)}</>;
  }

  return (
    <WebLayout header={header} footer={footer} sidebar={sidebar}>
      {children}
    </WebLayout>
  );
}
