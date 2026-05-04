# Current Feature Context

**Feature Name**: Notification System Refactor — Real API Shape + Mutations + SSE Refresh
**Status**: Done
**Phase**: Complete
**Started**: 2026-05-04
**Completed**: 2026-05-04

## Summary

Refactored the app notification system to match the real backend API shape, wired
mark-as-read/clear-all mutations, and added SSE-driven notification list invalidation
so the bell badge updates in real time without polling.

## Files Modified

| File                                          | Change                                                                                                                                                                                                                                  |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `services/app/app.service.ts`                 | `NotificationDTO` → `AppNotification` (real API shape); fixed `ApiEnvelope`; updated mapper; added `markNotificationRead`, `markAllNotificationsRead`, `clearAllNotifications`; fixed `actionUrl` routing (salary.paid → /user/payslip) |
| `services/app/use-app-service.ts`             | Added `useMarkNotificationRead`, `useMarkAllNotificationsRead`, `useClearAllNotifications` mutations; bulk mutations derive `employeeId` from variables (no stale closure)                                                              |
| `components/shared/app-events-listener.tsx`   | Invalidates `notification.list(employeeId)` on every SSE event; uses `useSession` for employeeId                                                                                                                                        |
| `components/shared/top-bar/index.tsx`         | Self-fetches notifications via `useSession` + `useAppService`; uses `mutate` (not `mutateAsync`) for fire-and-forget mutation calls matching widget's sync handler contract                                                             |
| `components/shared/top-bar/types.ts`          | Removed `notifications` prop (TopBar self-fetches)                                                                                                                                                                                      |
| `app/(private)/(org)/layout.tsx`              | Removed `useGetNotifications` and `notifications` prop passthrough                                                                                                                                                                      |
| `components/shared/top-bar/example-usage.tsx` | Updated to remove `notifications` prop                                                                                                                                                                                                  |

## Review Findings (All Resolved)

- [x] `handleMarkAsRead` async mismatch → changed to `mutate` (sync fire-and-forget)
- [x] Stale closure in bulk mutation `invalidateQueries` → now derives `employeeId` from mutation variables
- [x] Wrong `actionUrl` for salary.paid → `/user/payslip` (was `/admin/payroll`)
- Pre-existing infrastructure issue (4-arg `onSuccess` in `use-service-query.ts`) — not in scope, not introduced here

## Key Decisions

- TopBar self-fetches notifications (uses `useSession` internally) — removes prop-drilling
- SSE invalidation in `AppEventsListener` (already has `queryClient` + all events) — minimal change for live badge
- `mutate` instead of `mutateAsync` — matches `onMarkAsRead?: (id: string) => void` widget contract exactly
