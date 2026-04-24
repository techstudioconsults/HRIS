# User Home — RBAC

_Role-based access control for the employee home dashboard._

## Access Matrix

| Role            | Access                           | Notes                                 |
| --------------- | -------------------------------- | ------------------------------------- |
| `EMPLOYEE`      | Full access to `/user/dashboard` | Sees their own data only              |
| `ADMIN`         | Not applicable                   | Admins use `@org/admin/dashboard`     |
| Unauthenticated | Blocked                          | Middleware redirects to `/auth/login` |

## Data Scope

- An employee can only see their own activities and profile data on the home dashboard.
- The backend API must enforce employee-scoped queries — the frontend must never pass another employee's ID.
- Quick-action cards navigate to modules where further RBAC checks apply (leave, payslip).

## Route Guard

The `/user/dashboard` route is protected by the Next.js middleware in `middleware.ts`. The guard validates the JWT before the Server Component renders, ensuring no data is fetched for unauthenticated requests.
