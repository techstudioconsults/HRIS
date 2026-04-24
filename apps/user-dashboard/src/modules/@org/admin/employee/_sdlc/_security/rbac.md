# Admin Employee Module — RBAC Configuration

_Role-based access control rules for the employee management module._

## Route Guards

| Route                       | Required Permission     |
| --------------------------- | ----------------------- |
| `/admin/employee`           | `ADMIN` or `HR_MANAGER` |
| `/admin/employee/new`       | `ADMIN` or `HR_MANAGER` |
| `/admin/employee/[id]`      | `ADMIN` or `HR_MANAGER` |
| `/admin/employee/[id]/edit` | `ADMIN` or `HR_MANAGER` |

All routes above are within the `ADMIN` module section and are protected by `proxy.ts` via the `PERMISSION_BASED` guard. An authenticated user without `ADMIN` or `HR_MANAGER` permission is redirected to their dashboard, not to `/login`.

## Action-Level Permissions

| Action                     | ADMIN | HR_MANAGER | EMPLOYEE |
| -------------------------- | ----- | ---------- | -------- |
| View employee list         | ✅    | ✅         | ❌       |
| View employee profile      | ✅    | ✅         | ❌       |
| Create employee            | ✅    | ✅         | ❌       |
| Edit employee              | ✅    | ✅         | ❌       |
| Change employment status   | ✅    | ✅         | ❌       |
| Upload document            | ✅    | ✅         | ❌       |
| Delete document            | ✅    | ❌         | ❌       |
| View audit trail           | ✅    | ✅         | ❌       |
| View PII fields (NIN, BVN) | ✅    | ✅         | ❌       |

`HR_MANAGER` cannot delete documents — only `ADMIN` can perform destructive document operations.

## Implementation Notes

- Route-level guard: enforced in `proxy.ts` middleware using `getToken()` to read the NextAuth session.
- Action-level guard: enforced in API route handlers on the backend; the frontend hides delete buttons for `HR_MANAGER` but the backend is the authoritative enforcement point.
- PII masking: `nationalId` and `bankVerificationNumber` fields are masked in API responses for `HR_MANAGER` if the organisation has enabled the PII masking setting. Always masked in the employee list view regardless of role.
