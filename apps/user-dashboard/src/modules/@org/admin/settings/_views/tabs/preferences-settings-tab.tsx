'use client';

import { useTheme } from 'next-themes';
import { toast } from 'sonner';

import { MainButton } from '@workspace/ui/lib/button';
import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { AnyIconName } from '@workspace/ui/lib/icons/types';
import { useDashboardPreferences } from '@/lib/preferences/dashboard-preferences-provider';

import type {
  ThemeMode,
  ColorTheme,
  SidebarVariant,
  SidebarCollapsible,
} from '../../types';
import { DEFAULT_PREFERENCES } from '../../types';

const themeModeOptions: {
  value: ThemeMode;
  label: string;
  icon: AnyIconName;
}[] = [
  { value: 'light', label: 'Light', icon: 'Sun' },
  { value: 'dark', label: 'Dark', icon: 'Moon' },
  { value: 'system', label: 'System', icon: 'Monitor' },
];

const accentColorOptions: {
  value: ColorTheme;
  label: string;
  dotClass: string;
}[] = [
  { value: 'default', label: 'Default', dotClass: 'bg-neutral-500' },
  { value: 'blue', label: 'Ocean', dotClass: 'bg-blue-500' },
  { value: 'green', label: 'Forest', dotClass: 'bg-lime-500' },
  { value: 'amber', label: 'Amber', dotClass: 'bg-amber-500' },
  { value: 'mono', label: 'Mono', dotClass: 'bg-neutral-700' },
];

const sidebarVariantOptions: {
  value: SidebarVariant;
  label: string;
  description: string;
}[] = [
  { value: 'sidebar', label: 'Sidebar', description: 'Pushes content inward' },
  {
    value: 'floating',
    label: 'Floating',
    description: 'Overlays with rounded edges',
  },
  {
    value: 'inset',
    label: 'Inset',
    description: 'Inset within the page content',
  },
];

const sidebarCollapsibleOptions: {
  value: SidebarCollapsible;
  label: string;
  description: string;
}[] = [
  {
    value: 'offcanvas',
    label: 'Offcanvas',
    description: 'Hides completely off-screen',
  },
  {
    value: 'icon',
    label: 'Icon',
    description: 'Shows icons only when collapsed',
  },
];

export const PreferencesSettingsTab = () => {
  const { theme: currentTheme, setTheme } = useTheme();
  const { preferences, updatePreferences, resetPreferences } =
    useDashboardPreferences();

  const handleThemeModeChange = (mode: ThemeMode) => {
    if (setTheme) setTheme(mode);
    updatePreferences({ theme: mode });
  };

  const handleAccentColorChange = (color: ColorTheme) => {
    updatePreferences({ colorTheme: color });
  };

  const handleSidebarVariantChange = (value: SidebarVariant) => {
    updatePreferences({ sidebarVariant: value });
  };

  const handleSidebarCollapsibleChange = (value: SidebarCollapsible) => {
    updatePreferences({ sidebarCollapsible: value });
  };

  const handleReset = () => {
    resetPreferences();
    if (setTheme) setTheme(DEFAULT_PREFERENCES.theme);
    toast.success('Preferences reset', {
      description: 'All preferences have been restored to defaults.',
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-base font-semibold">Preferences</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Customize your dashboard appearance
        </p>
      </div>

      <div className="bg-background shadow rounded-lg border border-none p-4 sm:p-8">
        <div className="space-y-12">
          {/* ---- Accent Color ---- */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">Accent Color</h3>
            <p className="text-muted-foreground text-sm">
              Choose your preferred accent color palette for buttons, links, and
              interactive elements
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {accentColorOptions.map((option) => {
                const isSelected = preferences.colorTheme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleAccentColorChange(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 rounded-lg border p-4 text-center transition-all',
                      'hover:ring-2 hover:ring-ring/30 focus-visible:outline-none focus-visible:ring-2',
                      isSelected
                        ? 'ring-2 ring-ring bg-ring/5 shadow-sm'
                        : 'border-border bg-transparent'
                    )}
                    aria-pressed={isSelected}
                    aria-label={`${option.label} accent color`}
                  >
                    <span
                      className={cn(
                        'size-8 rounded-full border-2 border-border',
                        option.dotClass
                      )}
                    />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ---- Theme Mode ---- */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">Mode</h3>
            <p className="text-muted-foreground text-sm">
              Light, dark, or follow your system preference
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {themeModeOptions.map((option) => {
                const isSelected = preferences.theme === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleThemeModeChange(option.value)}
                    className={cn(
                      'flex items-center gap-3 rounded-lg border p-4 text-left transition-all',
                      'hover:ring-2 hover:ring-ring/30 focus-visible:outline-none focus-visible:ring-2',
                      isSelected
                        ? 'ring-2 ring-ring bg-ring/5 shadow-sm'
                        : 'border-border bg-transparent'
                    )}
                    aria-pressed={isSelected}
                    aria-label={`${option.label} theme`}
                  >
                    <span
                      className={cn(
                        'flex size-10 items-center justify-center rounded-full',
                        isSelected
                          ? 'bg-ring text-white'
                          : 'bg-muted text-muted-foreground'
                      )}
                    >
                      <Icon name={option.icon} size={20} />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {option.value === 'system'
                          ? 'Follows your device settings'
                          : `Always use ${option.label.toLowerCase()} mode`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {currentTheme && (
              <p className="text-xs text-muted-foreground">
                Current active theme: <strong>{currentTheme}</strong>
              </p>
            )}
          </section>

          {/* ---- Sidebar Variant ---- */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">Sidebar Layout</h3>
            <p className="text-muted-foreground text-sm">
              Control how the sidebar appears on your dashboard
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {sidebarVariantOptions.map((option) => {
                const isSelected = preferences.sidebarVariant === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSidebarVariantChange(option.value)}
                    className={cn(
                      'flex flex-col gap-2 rounded-lg border p-4 text-left transition-all',
                      'hover:ring-2 hover:ring-ring/30 focus-visible:outline-none focus-visible:ring-2',
                      isSelected
                        ? 'ring-2 ring-ring bg-ring/5 shadow-sm'
                        : 'border-border bg-transparent'
                    )}
                    aria-pressed={isSelected}
                    aria-label={`${option.label} sidebar`}
                  >
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ---- Sidebar Collapsible ---- */}
          <section className="space-y-4">
            <h3 className="text-base font-semibold">Collapse Mode</h3>
            <p className="text-muted-foreground text-sm">
              How the sidebar behaves when you collapse it
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {sidebarCollapsibleOptions.map((option) => {
                const isSelected =
                  preferences.sidebarCollapsible === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSidebarCollapsibleChange(option.value)}
                    className={cn(
                      'flex flex-col gap-2 rounded-lg border p-4 text-left transition-all',
                      'hover:ring-2 hover:ring-ring/30 focus-visible:outline-none focus-visible:ring-2',
                      isSelected
                        ? 'ring-2 ring-ring bg-ring/5 shadow-sm'
                        : 'border-border bg-transparent'
                    )}
                    aria-pressed={isSelected}
                    aria-label={`${option.label} collapse mode`}
                  >
                    <p className="text-sm font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ---- Reset ---- */}
          <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row sm:justify-start">
            <MainButton
              type="button"
              variant="destructiveOutline"
              className="text-destructive border-destructive w-full sm:w-50"
              onClick={handleReset}
            >
              Reset to Defaults
            </MainButton>
          </div>
        </div>
      </div>
    </section>
  );
};
