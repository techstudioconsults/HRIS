# US-001: View Leave Balance Per Leave Type

_As an employee, I want to see my remaining leave days for each leave type so that I know how many days I can still take._

## Story

**As** an employee,
**I want** to see a breakdown of my leave balance for each leave type (Annual Leave, Sick Leave, Casual Leave, etc.),
**So that** I can make informed decisions about when to submit a leave request without accidentally exceeding my entitlement.

## Acceptance Criteria

- The leave page displays a balance card/section for each leave type the employee is entitled to.
- Each balance shows: `leaveTypeName`, `total` days, `used` days, `remaining` days, and `pending` days.
- Balances are fetched from `GET /leaves` (leave type list) and `GET /leave-request` (to derive used/pending counts) or a dedicated balance endpoint.
- If no leave types are available, a graceful empty state is shown.
- Balances update after a new leave request is successfully submitted (TanStack Query cache invalidation).

## Notes

- Component: `LeaveHeader` or a dedicated balance section in `leave.tsx` view.
- The `LeaveBalance` interface in `types/index.ts` defines the shape.
