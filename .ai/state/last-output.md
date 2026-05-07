# PWA iOS Splash Screen — Three Critical Fixes

**Feature**: PWA iOS Splash Screen Fix — orientation media queries, FOUC guard component, FOUC CSS
**Status**: Complete
**Date**: 2026-05-07

## Fixes Applied

### Issue 1: Landscape/Portrait Orientation in Media Queries (BLOCKING BUG)

All 28 splash screen entries in `layout.tsx` `appleWebApp.startupImage` had identical media queries
for portrait and landscape variants. iOS Safari always picked the first (portrait) image — landscape
devices showed a stretched portrait splash.

**Fix**: Added `and (orientation: portrait)` to all 14 portrait entries and `and (orientation: landscape)`
to all 14 landscape entries in both `layout.tsx` and `scripts/generate-splash-screens.mjs`.

### Issue 2: Missing PwaSplashGuard Component (FOUC Guard)

Created `src/components/pwa/pwa-splash-guard.tsx` — a client component that:

- Renders a full-viewport branded overlay (#0f172a background + logo.png) as body's first child
- Sets `document.documentElement.dataset.splash = 'ready'` via `requestAnimationFrame` after React hydrates
- CSS transition fades it out when `data-splash="ready"` is set

### Issue 3: FOUC Guard CSS in globals.css

Added `.pwa-splash-guard` styles to `src/app/globals.css`:

- Fixed overlay with high z-index, flexbox centered logo with pulse animation
- `html[data-splash="ready"] .pwa-splash-guard` → fades out via opacity transition
- `@media not (display-mode: standalone)` → hidden in browser mode

## Changes

| File                                      | Action                                                                                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/pwa/pwa-splash-guard.tsx` | **Created** — FOUC guard client component                                                                                            |
| `src/app/layout.tsx`                      | Added `and (orientation: portrait/landscape)` to all 28 media queries; added `<PwaSplashGuard />` before `<Providers>`; added import |
| `src/app/globals.css`                     | Appended `.pwa-splash-guard` CSS with animation, fade-out, and `@media not (display-mode: standalone)` guard                         |
| `scripts/generate-splash-screens.mjs`     | Updated all 28 `media` strings to include `and (orientation: ...)`                                                                   |

## Verification

- `pnpm run typecheck` — clean (no errors)
- `pnpm run lint` — clean (no errors, no warnings)
- All 28 orientation suffixes verified in both layout.tsx and generate-splash-screens.mjs

## Technical Notes

- **Why iOS ignores manifest splash**: iOS WKWebView only supports proprietary `<link rel="apple-touch-startup-image">` tags — it completely ignores Web App Manifest splash/background_color. Only Android/Chrome uses manifest-based splash.
- **Why splash fails in React apps**: iOS determines the splash image from `<head>` at page load time, BEFORE JavaScript executes. If splash `<link>` tags are injected client-side, they appear after the native splash decision window has passed.
- **Why orientation matters**: Without `(orientation: ...)` in the media query, iOS picks the first matching entry — always portrait if it comes first. Landscape devices get a stretched/blown-up portrait splash.
- **iOS caching**: iOS aggressively caches splash assets. Testing changes may require: delete Home Screen icon → clear Safari website data → restart device → re-add to Home Screen.
