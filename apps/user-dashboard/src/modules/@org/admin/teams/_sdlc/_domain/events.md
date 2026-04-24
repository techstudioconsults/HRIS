---
section: domain
topic: events
---

# Admin Teams — Domain Events

## Produced

| Event                     | Trigger                                  | Consumers                                        |
| ------------------------- | ---------------------------------------- | ------------------------------------------------ |
| `TeamCreated`             | Admin creates a new team                 | Notifications (future)                           |
| `TeamUpdated`             | Admin edits team name/description/status | Audit log                                        |
| `TeamDeleted`             | Admin deletes a team                     | Employee module — remove team refs from profiles |
| `RoleCreated`             | Admin adds a role to a team              | Audit log                                        |
| `RoleUpdated`             | Admin changes role permissions           | Audit log                                        |
| `EmployeeAssignedToTeam`  | Admin assigns an employee with a role    | Notifications (future); employee profile         |
| `EmployeeRemovedFromTeam` | Admin removes a team member              | Notifications (future); employee profile         |

## Consumed

| Event                | Source           | Action                                                                  |
| -------------------- | ---------------- | ----------------------------------------------------------------------- |
| `EmployeeTerminated` | `admin/employee` | Backend removes employee from all teams; frontend refetches `['teams']` |

## Frontend Cache Invalidation

Events above are not published as domain events at the frontend layer — they manifest as TanStack Query cache invalidations:

- `TeamCreated` / `TeamDeleted` / `TeamUpdated` → invalidate `['teams']`
- `EmployeeAssignedToTeam` / `EmployeeRemovedFromTeam` → invalidate `['teams', teamId]`
- `RoleCreated` / `RoleUpdated` → invalidate `['teams', teamId, 'roles']`
