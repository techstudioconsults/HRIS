# User Home — System Design Overview

_Architecture summary for the employee home dashboard module._

## Module Boundaries

The `home` module is a **read-only view module**. It fetches employee profile state (to determine which view to render) and activity data, but it does not own any mutations. All write operations are delegated to the `leave` and `onboarding` modules via navigation.

## View Routing Logic

```
/user/dashboard
  └── HomePage (Server Component — determines view variant)
        ├── userSetupComplete === true  → ActiveUserView
        └── userSetupComplete === false → OnboardingView
```

## Component Layers

| Layer                  | Components                                                                     |
| ---------------------- | ------------------------------------------------------------------------------ |
| **View**               | `home-page.tsx`, `_views/active-user/index.tsx`, `_views/onboarding/index.tsx` |
| **Feature components** | `QuickActionCard`, `ActivityItem`, `UserDashboardCard`, `OnboardingHeader`     |
| **Data**               | `constants/recent-activities.ts` (static mock; to be replaced by API hook)     |
| **Types**              | `types/index.ts` — `Activity`, `QuickAction`, `SetupTask`, `SetupPageState`    |

## Data Flow

1. Server Component (`home-page.tsx`) reads the authenticated employee's session.
2. If setup is incomplete, `OnboardingView` receives `SetupTask[]` as props.
3. If setup is complete, `ActiveUserView` receives `Activity[]` and `QuickAction[]` as props.
4. No client-side data fetching currently; `RECENT_ACTIVITIES` constant used as placeholder.
