# User Home — Data Flow

_How data moves from the server to the employee's home dashboard._

## Current Data Flow (MVP)

```
Session (NextAuth / JWT)
  └── employee.name, employee.userSetupComplete
        └── HomePage (Server Component)
              ├── [complete]   → ActiveUserView
              │     ├── QuickActions: static config array
              │     └── RecentActivities: RECENT_ACTIVITIES constant (mock)
              └── [incomplete] → OnboardingView
                    └── SetupTasks: derived from employee.setupTaskStatus
```

## Future Data Flow (Phase 2)

```
HomePage (Server Component) — prefetches activity data
  └── ActiveUserView (Client Component boundary)
        └── useRecentActivities() [TanStack Query]
              └── GET /api/v1/employees/{id}/activities
                    └── ActivityItem[]
```

## State Ownership

| Data                 | Owner                         | Type                               |
| -------------------- | ----------------------------- | ---------------------------------- |
| Employee name        | Auth session                  | Server-side                        |
| `userSetupComplete`  | Auth session / profile API    | Server-side                        |
| `SetupTask[]` status | Onboarding module             | Props passed into `OnboardingView` |
| `Activity[]`         | Home module (future API hook) | Currently static constant          |
| `QuickAction[]`      | Home module config            | Static array — never fetched       |
