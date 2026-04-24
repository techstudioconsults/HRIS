# User Leave — Scope

_Defines what is included in and explicitly excluded from the employee leave self-service module._

## In Scope

- **Leave balance display**: per leave type, showing `total`, `used`, `remaining`, and `pending` days.
- **Leave request submission**: form with leave type selector, date range picker (start/end date), reason textarea, and optional supporting document upload. Validated with the `requestLeaveSchema` Zod schema.
- **Request history**: paginated list of the employee's own leave requests, showing status badges (`pending`, `approved`, `rejected`).
- **Request details modal**: `LeaveDetailsModal` showing full request details for a selected leave card.
- **Edit request modal**: allows editing a pending leave request via `RequestLeaveModal` with `initialRequest` pre-filled.
- **Submission confirmation modal**: `LeaveRequestSubmittedModal` shown after a successful `POST /leave-request`.
- Route: `/user/leave`.

## Out of Scope

- Leave approval or rejection by managers — that belongs in `@org/admin/leave`.
- Creating or configuring leave types — admin responsibility.
- Leave calendar or team leave overview — admin and team lead features.
- Carry-over balance adjustments — backend-managed, not user-actionable.

## Boundaries

This module owns the `/user/leave` route. It uses `UserLeaveService` for all API calls, which goes through the `HttpAdapter`. The module does not share state with the home or payslip modules.
