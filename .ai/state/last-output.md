# Enable TanStack React Query Devtools

**Feature**: Devtools Enablement
**Status**: Complete
**Date**: 2026-05-06

### What Was Done

#### Step 1: Fix package version
- **File**: `apps/user-dashboard/package.json` line 73
- Changed `"@tanstack/react-query-devtools": ""` → `"@tanstack/react-query-devtools": "^5.83.0"`

#### Step 2: Install
- Ran `pnpm install --filter user-dashboard` — succeeded
- Installed `@tanstack/react-query-devtools@5.100.9` (latest matching ^5.83.0)
- Minor peer dep warning: devtools 5.100.9 wants `@tanstack/react-query@^5.100.9`, project has 5.100.5 — benign patch mismatch, no runtime issue

#### Step 3: Enable devtools in provider
- **File**: `apps/user-dashboard/src/lib/react-query/query-provider.tsx`
- Added import: `import { ReactQueryDevtools } from '@tanstack/react-query-devtools';`
- Replaced commented-out JSX `{/*<ReactQueryDevtools initialIsOpen={false} />*/}` with active `<ReactQueryDevtools initialIsOpen={false} />`
- No `NODE_ENV` guard needed — TanStack Devtools are tree-shaken from production bundles automatically

#### Step 4: Verify
- `npx tsc --noEmit` — **zero errors** in `query-provider.tsx`
- Pre-existing unrelated TS errors unchanged

### Files Changed

| File | Action |
|------|--------|
| `apps/user-dashboard/package.json` | **MODIFY** — fix empty devtools version |
| `apps/user-dashboard/src/lib/react-query/query-provider.tsx` | **MODIFY** — import + render ReactQueryDevtools |
