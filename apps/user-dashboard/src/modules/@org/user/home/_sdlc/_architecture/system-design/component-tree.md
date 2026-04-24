# User Home — Component Tree

_Visual representation of the component hierarchy for the employee home dashboard._

## Active-User View Tree

```
HomePage (Server Component)
└── ActiveUserView
    ├── WelcomeHeader
    │   └── employee name from session
    ├── QuickActionCard  (× 3)
    │   ├── Icon
    │   ├── Title
    │   ├── Description
    │   └── Button → navigates to /user/leave | /user/payslip | team URL
    └── RecentActivities
        └── ActivityItem  (× n)
            ├── ActivityType icon (approved | rejected | available | submitted)
            ├── Title
            ├── Message
            └── Timestamp (relative)
```

## Onboarding View Tree

```
HomePage (Server Component)
└── OnboardingView
    ├── OnboardingHeader
    │   ├── completedSteps / totalSteps progress
    │   └── Progress bar
    └── SetupTask  (× 4)
        ├── Icon + DecorativeIcon
        ├── Title + Description
        ├── Status badge (pending | completed | locked)
        └── Button (buttonLabel, buttonAction)
```

## Shared Components

- `UserDashboardCard` — base card wrapper used by multiple home sub-components.
- `ActivityItem` — standalone, receives `ActivityItemProps`; no internal state.
- `QuickActionCard` — standalone, receives `QuickActionCardProps`; no internal state.
