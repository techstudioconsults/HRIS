# Current Feature Context

**Feature Name**: Routes Migration — Typed Constants
**Status**: Done
**Phase**: Complete
**Started**: 2026-05-04
**Completed**: 2026-05-04

## Summary

Replaced all inline route strings across 42 files with typed factory calls from
`src/lib/routes/routes.ts`. Zero new TypeScript errors introduced.

## Decision

Added `routes` factory export to the existing `src/lib/routes/routes.ts` file
(which already contained `ROUTE_CONFIGS` for auth/access control).
No new file needed — same module, second export.

## Files Created / Modified

- **Modified**: `src/lib/routes/routes.ts` — added `routes` factory object
- **Updated**: 41 consumer files across auth, employees, teams, leave, payroll,
  onboarding, user, and shared components

## Bug Fixed in Migration

- `top-bar/index.tsx`: `router.push('profile')` was missing the leading `/` —
  fixed to context-aware `routes.admin.profile()` / `routes.user.profile()`
  based on `pathname.startsWith('/admin')`
