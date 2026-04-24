# Admin Payroll — RBAC Configuration

## Route Guards

| Route              | Required Permission |
| ------------------ | ------------------- |
| `/admin/payroll`   | `ADMIN` only        |
| `/admin/payroll/*` | `ADMIN` only        |

Enforced in `proxy.ts` via the `OWNER_ONLY` guard. Authenticated non-admin users are redirected to their dashboard.

## Action-Level Permissions

| Action                  | ADMIN | HR_MANAGER | EMPLOYEE |
| ----------------------- | ----- | ---------- | -------- |
| View payroll setup      | ✅    | ❌         | ❌       |
| Configure payroll setup | ✅    | ❌         | ❌       |
| Initiate payroll run    | ✅    | ❌         | ❌       |
| Approve payroll run     | ✅    | ❌         | ❌       |
| Add/remove adjustments  | ✅    | ❌         | ❌       |
| View roster + payslips  | ✅    | ❌         | ❌       |
| View wallet balance     | ✅    | ❌         | ❌       |
| Initiate wallet funding | ✅    | ❌         | ❌       |
| Schedule payroll run    | ✅    | ❌         | ❌       |

Payroll is the most sensitive module — `ADMIN` only, no `HR_MANAGER` access.
