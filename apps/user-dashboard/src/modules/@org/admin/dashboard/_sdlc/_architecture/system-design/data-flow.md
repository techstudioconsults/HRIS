# Admin Dashboard — Data Flow

_How data moves from the backend APIs to the dashboard widgets._

## Overview

The dashboard is a read-only aggregation view. Data flows strictly in one direction: API → TanStack Query cache → React component. No user-initiated mutations originate from the dashboard itself.

## Data Sources

| Widget               | API Endpoint                                  | Cache Key                          | Stale Time       |
| -------------------- | --------------------------------------------- | ---------------------------------- | ---------------- |
| HeadcountWidget      | `GET /api/v1/dashboard/headcount`             | `['dashboard', 'headcount']`       | 5 minutes        |
| AttendanceRateWidget | `GET /api/v1/dashboard/attendance`            | `['dashboard', 'attendance']`      | 5 minutes        |
| PendingActionsWidget | `GET /api/v1/dashboard/pending-actions`       | `['dashboard', 'pending-actions']` | 2 minutes        |
| RecentActivityFeed   | `GET /api/v1/dashboard/activity?limit=10`     | `['dashboard', 'activity']`        | 2 minutes        |
| LeaveSummaryWidget   | `GET /api/v1/dashboard/leave-summary`         | `['dashboard', 'leave-summary']`   | 5 minutes        |
| PayrollSummaryWidget | `GET /api/v1/dashboard/payroll-summary`       | `['dashboard', 'payroll-summary']` | 10 minutes       |
| OnboardingBanner     | Organisation session context (no extra fetch) | N/A                                | Session lifetime |

## Cache Invalidation Strategy

- All dashboard queries refetch on window focus if data is stale.
- When a user approves a leave request from the `leave` module, the `pending-actions` and `activity` query keys are invalidated via `queryClient.invalidateQueries`.
- Payroll summary is invalidated after a payroll run is confirmed.

## Error Propagation

Each widget's `useQuery` error is handled locally — a widget-level error does not affect other widgets. See `sequence-diagrams/error-flow.md` for the full error handling sequence.
