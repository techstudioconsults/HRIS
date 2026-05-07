# Global Input 16px Font, Auth Required Indicators, Company Domain Hint

**Feature**: Three-part frontend task — global input sizing, auth form cleanup, reusable domain hint
**Status**: Complete
**Date**: 2026-05-07

## Summary

Three tasks completed:

1. All form inputs, selects, and textareas now use 16px font-size globally
2. Auth route forms (login, signup, OTP) no longer show required `*` indicators
3. Company domain hint extracted from signup into reusable `CompanyDomainHint` component,
   shared across signup, add-employee, and edit-employee forms

## Changes

### Task 1: Global 16px Font-Size for Form Inputs

| File                                        | Change                                                                                                                                  |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/styles/base.css`           | Added `input:not([type="checkbox"]...), select, textarea { font-size: 16px; }` inside `@layer base` to catch raw/unstyled form elements |
| `packages/ui/src/components/select.tsx`     | Changed `SelectTrigger` base class from `text-sm` to `text-base`                                                                        |
| `packages/ui/src/lib/inputs/FormFields.tsx` | Changed `inputClassName` template from `text-sm` to `text-base` so all fields rendered via `FormField` get 16px                         |

Note: The `utilities.css` already had `input, textarea, select { font-size: 16px; }` but it was trumped by Tailwind `text-sm` utility classes. The component-level fixes address those overrides.

### Task 2: Remove Required Indicators from Auth Forms

| File                                                                   | Change                                                                                                                                                                     |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/ui/src/lib/inputs/FormFields.tsx`                            | Added `hideRequiredIndicator?: boolean` prop to `FormField`, `MultiSelect`, and `SwitchField`. When `true`, the red `*` asterisk is suppressed even when `required={true}` |
| `apps/user-dashboard/src/modules/@org/auth/_views/register/index.tsx`  | Added `hideRequiredIndicator` to all 7 `FormField` usages (companyName, firstName, lastName, domain, email, password, confirmPassword)                                     |
| `apps/user-dashboard/src/modules/@org/auth/_views/login/index.tsx`     | Added `hideRequiredIndicator` to both `FormField` usages (email, password)                                                                                                 |
| `apps/user-dashboard/src/modules/@org/auth/_views/login/otp-login.tsx` | Added `hideRequiredIndicator` to the email `FormField`                                                                                                                     |

### Task 3: Extract Company Domain Hint into Reusable Component

| File                                                                                      | Change                                                                                                       |
| ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `packages/ui/src/lib/inputs/domain-hint.tsx`                                              | **New file.** Reusable `CompanyDomainHint` component with InfoCircle icon and helper text                    |
| `apps/user-dashboard/src/modules/@org/auth/_views/register/index.tsx`                     | Replaced inline hint (10 lines) with `<CompanyDomainHint />` import. Removed unused `Icon` import            |
| `apps/user-dashboard/src/modules/@org/admin/employee/_components/forms/add-employee.tsx`  | Imported `CompanyDomainHint` and added it below the "Work Email" field (wrapped in a div for proper spacing) |
| `apps/user-dashboard/src/modules/@org/admin/employee/_components/forms/edit-employee.tsx` | Imported `CompanyDomainHint` and added it below the "Work Email" field                                       |

### Pre-existing Lint Fixes (Cleaned Up to Pass Pipeline)

| File                                                                                | Change                                                                    |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `packages/ui/src/lib/dashboard/sidebar/app-sidebar.tsx`                             | Removed unused `NavUser` import; removed unused `theme` destructured prop |
| `apps/user-dashboard/src/modules/@org/_components/payrool-linechart.tsx`            | Removed unused `formatCurrencyCompact` import                             |
| `apps/user-dashboard/src/modules/@org/admin/dashboard/_components/card-section.tsx` | Removed unused `formatCurrency` import                                    |

## Verification

- `pnpm run typecheck` — 4/4 successful, 0 errors
- `pnpm run lint` — 3/3 successful, 0 warnings, 0 errors

## Summary

All 4 button groups in the Preferences tab (Accent Color, Mode, Sidebar Layout, Collapse Mode)
used thick `border-2 border-primary` to indicate the selected state. Changed to a focus-style
`ring-2 ring-primary` indicator instead.

## Changes

| Change             | Before                                  | After                                                   |
| ------------------ | --------------------------------------- | ------------------------------------------------------- |
| Base border        | `border-2`                              | `border` (thin structural)                              |
| Selected           | `border-primary bg-primary/5 shadow-sm` | `ring-2 ring-primary bg-primary/5 shadow-sm`            |
| Hover              | `hover:border-primary/50`               | `hover:ring-2 hover:ring-primary/30`                    |
| Collapse Mode a11y | Missing `focus-visible:ring-2`          | Added `focus-visible:outline-none focus-visible:ring-2` |

## Files Modified

| File                                                                                           | Action                                                               |
| ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `apps/user-dashboard/src/modules/@org/admin/settings/_views/tabs/preferences-settings-tab.tsx` | Updated all 4 button groups (L135-139, L173-177, L228-232, L264-267) |

## Verification

- `pnpm run typecheck` — 4/4 clean
- `pnpm run lint` — clean (0 warnings, 0 errors)

---

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
