# Current Feature Context

**Feature Name**: PWA iOS Splash Screen Fix
**Status**: In Progress
**Phase**: Planning
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

## Scope

- **App**: `apps/user-dashboard` only
- **Files to create/modify**: layout.tsx, manifest.ts, globals.css, splash generator script,
  splash PNG assets
- **Files to delete**: `src/app/head.tsx` (dead code)

## Files to Change

| File | Action |
|------|--------|
| `src/app/layout.tsx` | Add `appleWebApp.startupImage` to Metadata API; add CSS splash HTML |
| `src/app/manifest.ts` | Improve manifest config |
| `src/app/globals.css` | Add splash screen CSS animation |
| `src/app/head.tsx` | Delete (dead code) |
| `scripts/generate-splash-screens.mjs` | Create — generates PNG files |
| `public/splash/*.png` | Create — all iOS device splash images |

## Side Task — Completed
- **Forgot Password Flow UX Fix**: Replaced `router.push` navigation with `AlertModal` success
  confirmation on forgot-password form. See `last-output.md` for details.
