---
section: product
topic: user-story
id: US-005
epic: EPIC-001
version: 1.0
created: 2026-04-29
---

# US-005 — Onboarding Route Guard

## Story

As a system, I want to ensure only authenticated owners who have not yet completed
onboarding can access the onboarding wizard so that completed organisations are
redirected to their dashboard and unauthenticated users are redirected to the login page.

## Acceptance Criteria

- [ ] An unauthenticated user visiting any `/onboarding/*` route is redirected to `/login`.
- [ ] An authenticated user whose `setupStatus.takenTour` is `true` is redirected to `/admin/dashboard`.
- [ ] An authenticated user whose `setupStatus.takenTour` is `false` (or `undefined`) is permitted through to the requested onboarding page.
- [ ] `isOnboardingSetupComplete(setupStatus)` returns `true` only when `setupStatus.takenTour === true`.
- [ ] `isOnboardingSetupComplete(undefined)` returns `false`.
- [ ] `isOnboardingSetupComplete(null)` returns `false`.
- [ ] The route guard renders a loading skeleton while the setup status fetch is in flight.
- [ ] The guard does not flash the onboarding UI before redirecting a completed user.

## Implementation Notes

- Guard component: `apps/user-dashboard/src/modules/@org/onboarding/_components/onboarding-route-guard.tsx`
- Pure utility: `isOnboardingSetupComplete` exported from `services/service.ts`
- Setup status fetched via `useOnboardingService().useGetSetupStatus(employeeId)`.

## Error Cases

| Scenario                       | UI Behaviour                                       |
| ------------------------------ | -------------------------------------------------- |
| Setup status fetch fails (5xx) | Fail-open: allow onboarding to continue; log error |
| Session expired mid-wizard     | Redirect to `/login` on next route transition      |
