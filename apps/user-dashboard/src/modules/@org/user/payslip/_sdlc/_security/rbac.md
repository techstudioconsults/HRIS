# User Payslip — RBAC Configuration

## Route Guards

| Route           | Required Permission                                                      |
| --------------- | ------------------------------------------------------------------------ |
| `/user/payslip` | Any authenticated user (`EMPLOYEE`, `HR_OFFICER`, `HR_MANAGER`, `ADMIN`) |

The payslip route is accessible to all authenticated employees. It lives within the `USER` module section and is guarded by `proxy.ts` which requires only a valid session — no additional permission scope is checked.

## Action-Level Permissions

| Action                           | EMPLOYEE | HR_OFFICER | HR_MANAGER | ADMIN                   |
| -------------------------------- | -------- | ---------- | ---------- | ----------------------- |
| View own payslip list            | ✅       | ✅         | ✅         | ✅                      |
| View own payslip detail          | ✅       | ✅         | ✅         | ✅                      |
| Download own payslip PDF         | ✅       | ✅         | ✅         | ✅                      |
| View another employee's payslips | ❌       | ❌         | ❌         | ❌ (admin/payroll only) |
| Create / edit / delete payslips  | ❌       | ❌         | ❌         | ❌ (admin/payroll only) |

## Data Scoping

The backend enforces employee-scoped data access via the JWT `sub` claim. The frontend never sends `employeeId` as a query parameter or path segment — the backend infers it from the authenticated token.

An employee cannot access another employee's payslip data regardless of any client-side manipulation (e.g., guessing another payslip ID returns `403 Forbidden`).

## Threat Model Notes

- Payslip IDs are opaque UUIDs — not sequential integers — reducing IDOR guessability.
- PDF blob URLs are created and immediately revoked in memory — no payslip data is persisted in the browser beyond the active session.
- No payslip data touches `localStorage` or `sessionStorage`.
