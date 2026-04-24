# Leave Management — Data Exposure Analysis

_What data is visible in the admin leave module, to whom, and what controls prevent over-exposure._

## Data Displayed in This Module

| Data Field                     | Sensitivity | Visible To                | Control                                           |
| ------------------------------ | ----------- | ------------------------- | ------------------------------------------------- |
| Employee full name             | Low         | LEAVE_ADMIN, LEAVE_VIEWER | Role check on route                               |
| Employee department            | Low         | LEAVE_ADMIN, LEAVE_VIEWER | Role check on route                               |
| Leave type and dates           | Low         | LEAVE_ADMIN, LEAVE_VIEWER | Role check on route                               |
| Leave reason (employee-stated) | Medium      | LEAVE_ADMIN               | LEAVE_VIEWER does not see free-text reason field  |
| Leave decline reason           | Medium      | LEAVE_ADMIN               | Not shown in public-facing employee views         |
| Leave balance (used/remaining) | Medium      | LEAVE_ADMIN, LEAVE_VIEWER | Requires explicit balance fetch; not in list view |
| Medical documentation flag     | Medium      | LEAVE_ADMIN               | `requiresDocumentation` field on leave type only  |

## Sensitive Data Handling Rules

- **Medical notes or diagnoses**: never requested, stored, or displayed by this module. The `reason` field on sick leave requests is a free-text field — the system does not validate, categorise, or display it in list views; it is visible only in the detail drawer for `LEAVE_ADMIN` users.
- **Employee personal identifiers** (NIN, BVN, bank account): not present in any leave domain entity. Any accidental inclusion must be treated as a data leak and escalated.
- **Bulk data export**: leave request lists are paginated — no endpoint returns unbounded data. Any CSV export feature (future) must be gated behind `LEAVE_ADMIN` and rate-limited.

## API Response Minimisation

- The leave request list endpoint (`GET /api/v1/leave/requests`) returns only the fields required for the table view — it does not include the employee's `reason` field in list responses.
- The `reason` field is returned only from the single-request detail endpoint (`GET /api/v1/leave/requests/:id`), which requires the admin to explicitly open the drawer.

## Client-Side Storage

- No leave request data is stored in `localStorage` or `sessionStorage`.
- TanStack Query cache is in-memory only; it is cleared on page unload.
- Zustand stores are in-memory only; no `persist` middleware is used for stores containing employee data.
