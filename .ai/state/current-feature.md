# Current Feature Context

**Feature Name**: PWA iOS Splash Screen Fix
**Status**: In Progress
**Phase**: Implementation (three fixes applied)
**Started**: 2026-05-05

## Summary

Fix the PWA splash screen / launch screen experience on iOS. Users see a blank black or white screen
when launching the app from the home screen instead of a branded splash with the logo.

## Root Causes Identified

1. **`head.tsx` is dead code in Next.js 16 App Router** — `head.tsx` is no longer a special segment
   file in Next.js 14+. The `apple-touch-startup-image` links defined there are NEVER injected
   into the HTML. This is the primary bug.

2. **Wrong image dimensions** — `icon-512-v2.png` (512×512 px) is used for all device splash
   media queries. iOS requires exact physical pixel dimensions (e.g. 1179×2556 for iPhone 15).
   A 512×512 image matches no device → blank screen fallback.

3. **Missing device coverage** — Only 10 media query entries covering mostly older iPhones.
   iPhone 14 Pro, 15, 16 series, and all iPad modern sizes are absent.

4. **No CSS FOUC guard** — No branded fallback for the flash between HTML load and React hydration.

5. **Identical landscape/portrait media queries** — iOS picks portrait image for landscape devices (first match wins).

## Scope

- **App**: `apps/user-dashboard` only
- **Files created**: `src/components/pwa/pwa-splash-guard.tsx`
- **Files modified**: `src/app/layout.tsx`, `src/app/globals.css`, `scripts/generate-splash-screens.mjs`
- **Files deleted**: `src/app/head.tsx` (dead code, deleted in prior iteration)

## Completed Fixes (2026-05-07)

### Fix 1: Orientation Media Queries

Added `and (orientation: portrait)` to all 14 portrait entries and `and (orientation: landscape)` to all 14 landscape entries in both `layout.tsx` and `generate-splash-screens.mjs`.

### Fix 2: PwaSplashGuard Component

Created `src/components/pwa/pwa-splash-guard.tsx` — client component renders branded overlay, sets `data-splash="ready"` after hydration.

### Fix 3: FOUC Guard CSS

Added `.pwa-splash-guard` CSS to `globals.css` with pulse animation, fade-out transition on `html[data-splash="ready"]`, and hidden in browser mode via `@media not (display-mode: standalone)`.

## Verification

- `pnpm run typecheck` — clean
- `pnpm run lint` — clean
- All 28 orientation suffixes verified in both layout.tsx and generate-splash-screens.mjs

## Previous Side Tasks — Completed

- **Forgot Password Flow UX Fix**: Replaced `router.push` navigation with `AlertModal` success confirmation on forgot-password form.
- **Integration Test Fixes (2026-05-06)**: Fixed 6 failing integration tests. Root causes: auth refactoring removed toast calls; onboarding schema now requires industry/size fields.
- **CI Pipeline Fixes (2026-05-06)**: Fixed crypto verify realm error in SessionManager tests and SVG imports typecheck on CI.
- **PWA iOS Splash Screen Fix (2026-05-06)**: Core deliverables: deleted head.tsx, added 28 device-specific splash PNGs, created generate script, updated manifest, added CSS FOUC guard.
- **Session employeeId Guard Fix (2026-05-06)**: `UserLeaveBody` fired `GET /leave-requests?employeeId=undefined`. Added `enabled: !!employeeId`.
