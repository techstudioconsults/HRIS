# Preferences Panel — Refactor & Theme Variant Fix

**Feature**: Preferences panel cleanup + working theme variant switching
**Status**: Complete
**Date**: 2026-05-07

## Summary

Rewrote the Preferences tab to remove useless features (sidebar position, content density) and
implement working theme variant switching with instant apply (no save button).

## Changes

### 1. Removed useless features

- **Sidebar position** (left/right) — removed from types, provider, tab UI, and AppSidebar usage
- **Content density** (comfortable/compact) — removed from types, provider, and tab UI
- Both had no working implementation

### 2. Theme variant switching

The `packages/ui/src/styles/theme.css` defines accent color theme classes:

- `theme-default` — neutral gray
- `theme-blue` — blue accent
- `theme-green` — lime/green accent
- `theme-amber` — amber accent
- `theme-mono` — monospace font, no rounded corners, no shadows

The selected theme class is applied to `<html>` via `document.documentElement.classList`.
Changes are instant — no save button, no refresh needed.

### 3. Instant changes architecture

- **No React Hook Form** — removed form wrapper and "Save Preferences" button
- Clicking a theme variant or mode option immediately:
  1. Applies the DOM change (classList for variant, `setTheme()` for mode)
  2. Persists to localStorage via `updatePreferences()`
- Only "Reset to Defaults" button remains

### 4. Anti-flash inline script

Added a synchronous `<script>` block in `layout.tsx` that reads `localStorage` and applies
the theme variant class to `<html>` before React hydrates, preventing FOUC on page load.

### 5. Provider rewrite

Rewrote `DashboardPreferencesProvider` to use `useState` (reactive context) instead of
stale `useMemo` with empty deps. This ensures `preferences` in the context updates
when `updatePreferences` is called, making the UI reactive to clicks.

## Files Modified

| File                                                                                           | Action                                                                                                                  |
| ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `apps/user-dashboard/src/modules/@org/admin/settings/types/index.ts`                           | Removed `SidebarPosition`, `ContentDensity` types and fields; updated `PreferencesFormValues` and `DEFAULT_PREFERENCES` |
| `apps/user-dashboard/src/lib/preferences/dashboard-preferences-provider.tsx`                   | Rewrote: `useState` for reactivity, removed content density logic, always applies theme class, simplified `applyDOM`    |
| `apps/user-dashboard/src/modules/@org/admin/settings/_views/tabs/preferences-settings-tab.tsx` | Rewrote: no form, instant changes, only Accent Color + Theme Mode sections + Reset button                               |
| `apps/user-dashboard/src/components/shared/navbar/AppSidebar.tsx`                              | Removed `useDashboardPreferences` import and `side={preferences.sidebarPosition}` prop                                  |
| `apps/user-dashboard/src/app/layout.tsx`                                                       | Added inline anti-flash `<script>` to apply saved theme class before hydration                                          |

## Verification

- `pnpm run typecheck` — 4 successful, 4 total (clean)
- `pnpm run lint` (user-dashboard) — clean (0 warnings, 0 errors)
- `pnpm run test` — all 61 tests pass, 0 fail
