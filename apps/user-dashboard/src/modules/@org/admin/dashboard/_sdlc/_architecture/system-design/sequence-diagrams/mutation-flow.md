# Admin Dashboard — Mutation Flow Sequence Diagram

_The dashboard is read-only; mutations are triggered by navigating to their owning modules. This document describes the cross-module cache invalidation pattern triggered after a mutation elsewhere affects dashboard data._

## Scenario: Admin Approves a Leave Request (from Leave Module)

```
Admin Browser       Leave Module          TanStack Query          Dashboard Widgets
     |                    |                     |                        |
     |-- Approve leave --> |                     |                        |
     |                    |-- POST /api/v1/leave/:id/approve -->          |
     |                    |<-- 200 approved ---- |                        |
     |                    |                     |                        |
     |                    |-- invalidateQueries(['dashboard','pending-actions']) -->
     |                    |-- invalidateQueries(['dashboard','activity']) -------->
     |                    |                     |                        |
     |                    |                     |-- background refetch -->|
     |                    |                     |-- background refetch -->|
     |                    |                     |                        |
     |                    |                     |<-- fresh data ----------|
     |<-- dashboard widgets update automatically with new counts ---------|
```

## Cache Invalidation Registry

The following mutations in other modules must invalidate dashboard query keys:

| Module   | Mutation             | Dashboard Keys Invalidated                       |
| -------- | -------------------- | ------------------------------------------------ |
| Leave    | Approve/reject leave | `pending-actions`, `activity`, `leave-summary`   |
| Leave    | Submit leave request | `pending-actions`, `activity`                    |
| Payroll  | Confirm payroll run  | `payroll-summary`, `activity`, `pending-actions` |
| Employee | Add new employee     | `headcount`, `activity`                          |
| Employee | Terminate employee   | `headcount`, `activity`                          |

## Notes

- Cross-module invalidation is implemented in each module's mutation `onSuccess` handler.
- The dashboard module itself does not contain any mutation logic.
