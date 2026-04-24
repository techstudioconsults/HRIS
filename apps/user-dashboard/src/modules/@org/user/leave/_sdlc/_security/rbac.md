# User Leave — RBAC Configuration

## Route Guards

| Route         | Required Permission                                                      |
| ------------- | ------------------------------------------------------------------------ |
| `/user/leave` | Any authenticated user (`EMPLOYEE`, `HR_OFFICER`, `HR_MANAGER`, `ADMIN`) |

The user leave route is accessible to all authenticated employees. It is within the `USER` module section, guarded by `proxy.ts` which only requires a valid session — no specific permission scope needed.

## Action-Level Permissions

| Action                         | EMPLOYEE | HR_OFFICER | HR_MANAGER        | ADMIN                  |
| ------------------------------ | -------- | ---------- | ----------------- | ---------------------- |
| View own leave requests        | ✅       | ✅         | ✅                | ✅                     |
| Submit a leave request         | ✅       | ✅         | ✅                | ✅                     |
| Edit own pending request       | ✅       | ✅         | ✅                | ✅                     |
| Delete own pending request     | ✅       | ✅         | ✅                | ✅                     |
| View other employees' requests | ❌       | ❌         | ❌                | ❌ (admin module only) |
| Approve / reject requests      | ❌       | ❌         | ✅ (admin module) | ✅ (admin module)      |

## Data Scoping

The backend enforces employee-scoped data access via the JWT `sub` claim. The frontend never constructs requests with explicit `employeeId` parameters — the backend infers the scope from the authenticated token. An employee cannot access another employee's leave data regardless of client-side manipulation.
