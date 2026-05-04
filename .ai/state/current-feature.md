# Current Feature Context

**Feature Name**: TopBar Notification Bell — API Wiring
**Status**: Done
**Phase**: Optimizer (optional)
**Started**: 2026-05-04
**Completed**: 2026-05-04

## Summary

Wire the `GET /notifications/users/{employeeID}` endpoint into the notification bell icon
in the TopBar component so real notification data flows from the backend instead of `[]`.

## Files Created / Modified

| File                                   | Action   | Description                                                                                                          |
| -------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `services/app/app.service.ts`          | Modified | Added `NotificationDTO`, `ApiEnvelope<T>` (exported), `mapNotificationDTO`, typed returns, contextual error messages |
| `lib/react-query/query-keys.ts`        | Modified | Added `notification.list(employeeId)` key factory                                                                    |
| `lib/react-query/use-service-query.ts` | Modified | Added `TSelect` generic to `useServiceQuery` and `useSuspenseServiceQuery` for select transform support              |
| `services/app/use-app-service.ts`      | Modified | Added `useGetNotifications(employeeId)` hook with `select` mapper                                                    |
| `app/(private)/(org)/layout.tsx`       | Modified | Wire `useGetNotifications` → pass real data to `TopBar`                                                              |
| `components/shared/top-bar/index.tsx`  | Modified | Sync prop→state via `useEffect`, removed `console.log`, removed unused `isPWA`                                       |

## Review Findings (Resolved)

- [x] Removed unused `isPWA` variable and import
- [x] Exported `ApiEnvelope<T>` for reuse
- [x] Added context to `throw new Error()` messages
- [x] Removed `as Notification[]` cast (unnecessary with TSelect generic)
- [x] ESLint: 0 errors, 0 warnings
- [x] TypeScript: 0 new errors

## Decisions

- Mutations (mark-read, clear-all) remain local state only — no PATCH/DELETE endpoints exist yet
- DTO-to-UI mapper in hook's `select` — clean separation, easy to adjust if API shape differs
- `enabled: !!employeeId` prevents query flight before session is hydrated
- `useServiceQuery` and `useSuspenseServiceQuery` now accept `TSelect` generic for typed `select` transforms (backward compatible)
