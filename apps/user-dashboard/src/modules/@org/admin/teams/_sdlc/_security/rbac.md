---
section: security
topic: rbac
---

# Admin Teams — RBAC Configuration

## Route Guards

| Route            | Required Permission |
| ---------------- | ------------------- |
| `/admin/teams`   | `ADMIN` only        |
| `/admin/teams/*` | `ADMIN` only        |

Enforced in `proxy.ts` via the `OWNER_ONLY` guard. Authenticated non-admin users are redirected to their dashboard.

## Action-Level Permissions

| Action                  | ADMIN | HR_MANAGER | EMPLOYEE |
| ----------------------- | ----- | ---------- | -------- |
| View teams list         | ✅    | ❌         | ❌       |
| Create team             | ✅    | ❌         | ❌       |
| Edit team               | ✅    | ❌         | ❌       |
| Delete team             | ✅    | ❌         | ❌       |
| Create role in team     | ✅    | ❌         | ❌       |
| Edit role permissions   | ✅    | ❌         | ❌       |
| Assign employee to team | ✅    | ❌         | ❌       |
| Remove member from team | ✅    | ❌         | ❌       |
| Export team roster      | ✅    | ❌         | ❌       |
| View team details       | ✅    | ❌         | ❌       |

## Team-Level Permissions vs System RBAC

Team roles (Manager, Lead, Member, Observer) are **intra-team permissions** — they govern what a member can do within their team (future: team features). They do not affect system-level ADMIN/HR_MANAGER/EMPLOYEE access. Only `ADMIN` system role can manage teams at all.
