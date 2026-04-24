# Leave Management — RBAC (Role-Based Access Control)

_Defines which roles can perform which actions within the admin leave module._

## Roles

| Role           | Description                                                                        |
| -------------- | ---------------------------------------------------------------------------------- |
| `LEAVE_ADMIN`  | Full access: configure leave types, manage policies, approve/decline requests      |
| `LEAVE_VIEWER` | Read-only: view requests and leave types; cannot approve, decline, or configure    |
| `ORG_ADMIN`    | Inherits all permissions of `LEAVE_ADMIN` across all modules                       |
| `EMPLOYEE`     | No access to admin leave module; only to their own requests in the employee module |

## Permission Matrix

| Action                      | LEAVE_ADMIN | LEAVE_VIEWER | ORG_ADMIN | EMPLOYEE |
| --------------------------- | ----------- | ------------ | --------- | -------- |
| View leave request list     | Yes         | Yes          | Yes       | No       |
| View leave request detail   | Yes         | Yes          | Yes       | No       |
| Approve leave request       | Yes         | No           | Yes       | No       |
| Decline leave request       | Yes         | No           | Yes       | No       |
| Bulk approve requests       | Yes         | No           | Yes       | No       |
| View leave types            | Yes         | Yes          | Yes       | No       |
| Create leave type           | Yes         | No           | Yes       | No       |
| Edit leave type             | Yes         | No           | Yes       | No       |
| Archive leave type          | Yes         | No           | Yes       | No       |
| View leave policy           | Yes         | Yes          | Yes       | No       |
| Edit leave policy           | Yes         | No           | Yes       | No       |
| Run first-run setup wizard  | Yes         | No           | Yes       | No       |
| View employee leave balance | Yes         | Yes          | Yes       | No       |

## Frontend Enforcement

- Route middleware (`middleware.ts`) checks the user's role before rendering any page under `/admin/leave`. Users without `LEAVE_ADMIN` or `LEAVE_VIEWER` are redirected to `/403`.
- Action buttons (Approve, Decline, Save) are **disabled** (not hidden) for `LEAVE_VIEWER` users — this maintains layout consistency and provides accessible feedback via `aria-disabled`.
- The first-run setup wizard link is not rendered for `LEAVE_VIEWER` — the wizard mutates data.

## Important: Frontend Enforcement Is Not the Authority

All role checks on the frontend are UX conveniences only. The authoritative enforcement is on the backend — every mutation endpoint validates the JWT claims and role before processing. A determined actor bypassing the UI would still receive a `403` from the API.
