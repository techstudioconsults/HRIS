# PWA setup (user-dashboard)

This app uses `@serwist/next` to generate a production service worker.

## Design notes

- Service worker cache is **transport-level** (HTTP response caching).
- React Query cache is **application-level** (in-memory server state).
- They are used together safely by keeping sensitive API routes as `NetworkOnly` in `src/sw.ts`.
- On service worker activation or when browser goes back online, the app invalidates React Query cache to avoid stale data.

## Icons

The PWA icons feature the **HRIS brand identity**:

- **Distinctive geometric design**: Blue circle with clean white diagonal bands crossing through it
- **Red center accent**: Crimson diamond in the center representing the core mission
- **Color palette**:
  - Primary blue: `#0052CC` (circle background)
  - White: `#FFFFFF` (diagonal bands)
  - Accent red: `#DC143C` (center diamond)

**Icon sizes**:

- **icon-192.svg**: 192×192px (standard icon for most devices/notifications)
- **icon-512.svg**: 512×512px (splash screen & hi-resolution displays)
- **icon-maskable-512.svg**: 512×512px with adaptive icon safe zone (Android/maskable icon support)

The geometric design ensures strong visual recognition at all sizes while maintaining the professional HR/business context of the application.

## Files

- `next.config.ts` - Serwist integration (`swSrc` / `swDest`)
- `src/sw.ts` - runtime caching and secure route exclusions
- `src/components/pwa/pwa-registration.tsx` - SW registration + React Query invalidation bridge
- `src/app/manifest.ts` - web app manifest
- `src/app/offline/page.tsx` - offline fallback UI route
- `public/icons/*` - install icons (brand logo variants)

## Run

```bash
pnpm dev:user
```

Service worker is disabled in development. Build production to validate install/offline behavior.

```bash
pnpm build:user
pnpm --filter user-dashboard start
```
