# Admin Dashboard Onboarding — Skip Action

**Feature**: Implement "Skip, I will handle this later" in Admin onboarding view
**Status**: Complete
**Date**: 2026-05-06

## Problem

The "Skip, I will handle this later" link in the Admin dashboard onboarding view navigated to `/admin/dashboard` — the same page — making it a no-op. The user could never actually skip onboarding and reach the `ActiveUser` view.

## Root Cause

The `<Link href={'/admin/dashboard'}>` simply re-rendered the same route. Since all `ONBOARDING_STEPS` have `isCompleted: false` hardcoded, the view logic in `dashboard-home.tsx` always returned the `<Onboarding>` component (the `completedSteps < 4` branch).

## Fix

Added in-memory skip state to `dashboard-home.tsx` using `useState(false)`. When the user clicks "Skip," the `hasSkippedOnboarding` state flips to `true`, and the view logic renders `<ActiveUser />` directly. State resets on page refresh — intentional, as this is an admin convenience, not a critical user flow.

### Changes

| File                                                           | Change                                                                                      |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `src/modules/@org/admin/dashboard/types/index.ts`              | Added `onSkip?: () => void` to `OnboardingProperties`                                       |
| `src/modules/@org/admin/dashboard/dashboard-home.tsx`          | Added `useState(hasSkippedOnboarding)`, early-return guard, `onSkip` prop                   |
| `src/modules/@org/admin/dashboard/_views/onboarding/index.tsx` | Destructured `onSkip`, replaced `<Link>` with `<button>`, removed unused `next/link` import |

## Verification

- `pnpm run typecheck` — clean (no errors)
- `pnpm run lint` — clean (no errors)
