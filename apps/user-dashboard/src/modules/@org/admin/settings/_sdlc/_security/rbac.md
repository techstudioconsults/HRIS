# Settings Module — RBAC Configuration

## Route Guards

| Route                   | Required Permission        |
| ----------------------- | -------------------------- |
| `/admin/settings`       | `ADMIN` (Super Admin only) |
| `/admin/settings?tab=*` | `ADMIN`                    |

The Settings module is restricted to the `ADMIN` role only. `HR_MANAGER` cannot access settings. Enforced in `proxy.ts` via the `OWNER_ONLY` guard pattern — authenticated non-admin users are redirected to their dashboard, not to `/login`.

## Action-Level Permissions

| Action                        | ADMIN | HR_MANAGER | EMPLOYEE |
| ----------------------------- | ----- | ---------- | -------- |
| View any settings tab         | ✅    | ❌         | ❌       |
| Update Account Settings       | ✅    | ❌         | ❌       |
| Update Payroll Settings       | ✅    | ❌         | ❌       |
| Update Security Settings      | ✅    | ❌         | ❌       |
| Update HR Settings            | ✅    | ❌         | ❌       |
| Update Notification Settings  | ✅    | ❌         | ❌       |
| Create custom role            | ✅    | ❌         | ❌       |
| Edit custom role              | ✅    | ❌         | ❌       |
| Delete custom role            | ✅    | ❌         | ❌       |
| View system roles (read-only) | ✅    | ❌         | ❌       |

## System Role Protection

System roles (`Super Admin`, `HR Manager`, `HR Officer`, `Employee`) are read-only. The backend returns `403 SYSTEM_ROLE_IMMUTABLE` for any attempt to PATCH or DELETE a system role. The frontend hides edit/delete actions for system roles in the UI, but the backend is the authoritative enforcement point.
