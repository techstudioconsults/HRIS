# User Home — State Management

_How UI state is managed within the employee home dashboard._

## Principles

- The home module is **predominantly server-rendered**. There is no complex client state.
- No Zustand or Jotai store is needed at MVP; all rendering decisions are derived from props and session data.
- When the activity feed moves to a live API (Phase 2), TanStack Query will own the server state.

## Current State Model

| State                               | Where                         | How                                              |
| ----------------------------------- | ----------------------------- | ------------------------------------------------ |
| View variant (active vs onboarding) | `HomePage` — Server Component | Derived from `userSetupComplete` flag in session |
| Setup task statuses                 | `OnboardingView` — props      | Passed from Server Component; no local mutation  |
| Recent activities                   | `RecentActivities` — props    | `RECENT_ACTIVITIES` constant; no fetch yet       |

## Component-Level State

- `ActivityItem` — stateless; pure presentational.
- `QuickActionCard` — stateless; pure presentational.
- `OnboardingHeader` — stateless; derives progress percentage from `completedSteps / totalSteps`.

## Future State (Phase 2)

```ts
// TanStack Query key (to be registered in src/lib/react-query/query-keys.ts)
queryKeys.home.activities(employeeId);

// Hook location
hooks / use - recent - activities.ts;
```
