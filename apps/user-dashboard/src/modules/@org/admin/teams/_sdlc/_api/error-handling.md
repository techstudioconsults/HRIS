---
section: api
topic: error-handling
---

# Admin Teams — API Error Handling

| Status | Code                    | UI Behaviour                                                             |
| ------ | ----------------------- | ------------------------------------------------------------------------ |
| `409`  | `TEAM_NAME_EXISTS`      | Inline error on name field: "A team with this name already exists."      |
| `409`  | `TEAM_HAS_MEMBERS`      | Toast: "Remove all members before deleting a team."                      |
| `409`  | `MEMBER_ALREADY_EXISTS` | Toast: "This employee is already a member of this team."                 |
| `409`  | `ROLE_NAME_EXISTS`      | Inline error on role name field: "A role with this name already exists." |
| `422`  | `MAX_MEMBERS_EXCEEDED`  | Toast: "This team has reached its maximum of 50 members."                |
| `422`  | `MAX_ROLES_EXCEEDED`    | Toast: "This team already has the maximum of 20 roles."                  |
| `404`  | `EMPLOYEE_NOT_FOUND`    | Toast: "Employee not found. Please search again."                        |
| `400`  | `EMPLOYEE_TERMINATED`   | Toast: "Terminated employees cannot be added to teams."                  |
| `400`  | `VALIDATION_ERROR`      | Per-field inline errors via React Hook Form `setError`                   |
| `401`  | `UNAUTHENTICATED`       | Interceptor → sign out + redirect to login                               |
| `500`  | `INTERNAL_ERROR`        | Toast: "Something went wrong. Please try again."                         |

## Form Validation Rules

All form validation uses Zod schemas as single source of truth:

- `CreateTeamSchema` — name 2–100 chars, description 10–500 chars
- `CreateRoleSchema` — name required, at least one permission selected
- `AssignEmployeeSchema` — employee and role both required

Client-side validation fires on submit before any API call.
