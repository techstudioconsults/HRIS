'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { z } from 'zod';
import type { ColorTheme } from '@/modules/@org/admin/settings/types';
import {
  PREFERENCES_STORAGE_KEY,
  DEFAULT_PREFERENCES,
} from '@/modules/@org/admin/settings/types';

const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'] as const),
  colorTheme: z.enum(['default', 'blue', 'green', 'amber', 'mono'] as const),
  sidebarVariant: z.enum(['sidebar', 'floating', 'inset'] as const),
  sidebarCollapsible: z.enum(['offcanvas', 'icon'] as const),
});

type Preferences = z.infer<typeof preferencesSchema>;

const THEME_CLASSES = [
  'theme-default',
  'theme-blue',
  'theme-green',
  'theme-amber',
  'theme-mono',
] as const;

function loadPreferences(): Preferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  try {
    const raw = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    const parsed = preferencesSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return parsed.data;
    const merged = { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
    const reparsed = preferencesSchema.safeParse(merged);
    return reparsed.success ? reparsed.data : DEFAULT_PREFERENCES;
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

function applyThemeClass(colorTheme: ColorTheme): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  for (const cls of THEME_CLASSES) {
    root.classList.remove(cls);
  }
  root.classList.add(`theme-${colorTheme}`);
}

type DashboardPreferencesContextValue = {
  preferences: Preferences;
  updatePreferences: (partial: Partial<Preferences>) => void;
  resetPreferences: () => void;
};

const DashboardPreferencesContext =
  createContext<DashboardPreferencesContextValue | null>(null);

export function DashboardPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [preferences, setPreferences] = useState<Preferences>(loadPreferences);

  // Apply theme class on mount and whenever colorTheme changes
  useEffect(() => {
    applyThemeClass(preferences.colorTheme);
  }, [preferences.colorTheme]);

  const updatePreferences = useCallback((partial: Partial<Preferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetPreferences = useCallback(() => {
    localStorage.setItem(
      PREFERENCES_STORAGE_KEY,
      JSON.stringify(DEFAULT_PREFERENCES)
    );
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  const value = {
    preferences,
    updatePreferences,
    resetPreferences,
  };

  return (
    <DashboardPreferencesContext.Provider value={value}>
      {children}
    </DashboardPreferencesContext.Provider>
  );
}

export function useDashboardPreferences() {
  const ctx = useContext(DashboardPreferencesContext);
  if (!ctx)
    throw new Error(
      'useDashboardPreferences must be used within DashboardPreferencesProvider'
    );
  return ctx;
}
