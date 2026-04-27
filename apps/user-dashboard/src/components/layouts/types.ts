import type React from 'react';

export interface LayoutSelectorSlots {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  nav?: React.ReactNode;
  sidebar?: React.ReactNode;
}

export interface LayoutSelectorProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  nav?: React.ReactNode; // Bottom nav for PWA
  sidebar?: React.ReactNode; // Sidebar for Web
  renderPWA?: (slots: LayoutSelectorSlots) => React.ReactNode;
  renderWeb?: (slots: LayoutSelectorSlots) => React.ReactNode;
}

// ── AppLayout props ───────────────────────────────────────────────────────────

export interface AppLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  nav?: React.ReactNode;
}

// ── WebLayout props ───────────────────────────────────────────────────────────

export interface WebLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  sidebar?: React.ReactNode;
}
