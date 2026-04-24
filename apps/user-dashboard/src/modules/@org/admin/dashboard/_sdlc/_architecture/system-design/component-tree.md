# Admin Dashboard — Component Tree

_Visual breakdown of the dashboard component hierarchy._

## Component Hierarchy

```
DashboardPage (RSC — app/admin/dashboard/page.tsx)
├── DashboardShell (layout wrapper, Tailwind grid)
│   ├── OnboardingBanner (Client Component — conditional render)
│   │   └── SetupStepList
│   │       └── SetupStepItem[]
│   ├── MetricsSummaryRow
│   │   ├── HeadcountWidget (Client Component)
│   │   │   └── MetricCard
│   │   ├── AttendanceRateWidget (Client Component)
│   │   │   └── MetricCard + SparklineChart
│   │   └── PendingActionsWidget (Client Component)
│   │       └── ActionBadgeList
│   ├── DashboardMainContent (two-column layout)
│   │   ├── RecentActivityFeed (Client Component)
│   │   │   └── ActivityFeedItem[]
│   │   └── SummaryWidgetColumn
│   │       ├── LeaveSummaryWidget (Client Component)
│   │       │   └── LeaveByDepartmentRow[]
│   │       └── PayrollSummaryWidget (Client Component)
│   │           └── PayrollRunCard
└── DashboardErrorBoundary (wraps entire shell)
```

## Component Responsibilities

| Component              | Type   | Responsibility                                          |
| ---------------------- | ------ | ------------------------------------------------------- |
| `DashboardPage`        | RSC    | Route entry point; passes session/org context as props  |
| `DashboardShell`       | RSC    | Grid layout; no data logic                              |
| `OnboardingBanner`     | Client | Reads org setup status from session; renders checklist  |
| `HeadcountWidget`      | Client | Fetches and renders headcount metrics                   |
| `AttendanceRateWidget` | Client | Fetches and renders attendance % with sparkline         |
| `PendingActionsWidget` | Client | Fetches and renders pending leave/payroll action counts |
| `RecentActivityFeed`   | Client | Fetches and renders last 10 HR events                   |
| `LeaveSummaryWidget`   | Client | Fetches and renders this-week leaves by department      |
| `PayrollSummaryWidget` | Client | Fetches and renders next payroll run info               |

## Notes

- All `Client Components` use TanStack Query and render their own loading/error states
- `DashboardErrorBoundary` catches unhandled render errors and shows a recovery prompt
