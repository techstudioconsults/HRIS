# Session employeeId Guard Fix

**Feature**: Bugfix - employeeId=undefined in leave request query
**Status**: Complete
**Date**: 2026-05-06

## Bug

`UserLeaveBody` fires `GET /api/v1/leave-requests?employeeId=undefined` during session loading, causing a 500 error from the backend.

## Root Cause

`useSession()` returns `null`/`undefined` while fetching the session token from `GET /api/auth/token`. During this loading window, `sessionData?.user?.employee?.id` evaluates to `undefined`. The `useGetLeaveRequests` query had no `enabled` guard, so it fired immediately with `employeeId: undefined`, which reached the backend as the string `"undefined"`.

## Fix

Added `enabled: !!employeeId` guard to the `useGetLeaveRequests` call in `UserLeaveBody.tsx`. The query now defers until the session resolves and the employee ID is available.

Also:

- Removed a stray `console.log(sessionData?.user?.employee?.id)` left in production code
- Fixed pre-existing type error in `RequestLeaveModal.tsx`: `useGetLeaveTypes()` called with no args when the hook requires `Filters`
- Removed unused `RejectLeaveRequestPayload` imports from `user/leave/services/service.ts` and `user/leave/services/use-service.ts`

## Verification

- `pnpm run typecheck` — clean
- `pnpm run lint` — clean
- `pnpm run test` — 61 pass, 0 fail

## Context

Other session-dependent hooks (`useGetNotifications` in `use-app-service.ts`, `useGetMyProfile` in `user/profile/services/use-service.ts`) already had `enabled: !!employeeId` guards built into their service implementations. The `UserLeaveBody` component was the only caller bypassing this pattern.

## Files Changed

| File                                                            | Change                                                     |
| --------------------------------------------------------------- | ---------------------------------------------------------- |
| `src/modules/@org/user/leave/_components/LeaveBody.tsx`         | Added `enabled: !!employeeId` guard; removed `console.log` |
| `src/modules/@org/user/leave/_components/RequestLeaveModal.tsx` | Fixed `useGetLeaveTypes({})` — passed empty Filters        |
| `src/modules/@org/user/leave/services/service.ts`               | Removed unused `RejectLeaveRequestPayload` import          |
| `src/modules/@org/user/leave/services/use-service.ts`           | Removed unused `RejectLeaveRequestPayload` import          |
