---
section: api
topic: endpoints
---

# Admin Teams — API Reference

Base path: `/api/v1`

## Teams

### GET /teams

List all teams (paginated).

Query params: `page`, `limit`, `search`, `teamId`, `roleId`

Response `200`:

```json
{
  "data": [
    {
      "id": "team_01",
      "organisationId": "org_01",
      "name": "Engineering",
      "description": "Product engineering team",
      "status": "active",
      "memberCount": 8,
      "createdBy": "admin_01",
      "createdAt": "2026-01-10T08:00:00Z",
      "updatedAt": "2026-04-01T09:00:00Z"
    }
  ],
  "total": 5,
  "page": 1,
  "size": 20,
  "totalPages": 1
}
```

### POST /Teams

Create a new team. Body: `multipart/form-data` with `name`, `description`, optional `parentTeamId`.

Response `201`: `{ "data": Team }`

Errors: `409 TEAM_NAME_EXISTS`, `400 VALIDATION_ERROR`

### GET /teams/:id

Get a single team by ID.

Response `200`: `{ "data": Team }`

### PATCH /teams/:id

Update team. Body: `FormData` with changed fields.

Response `200`: `{ "data": Team }`

### DELETE /teams/:id

Delete a team.

Response `200`: `{ "success": true }`

Errors: `409 TEAM_HAS_MEMBERS` (cannot delete team with active members)

### GET /teams/export

Export team roster as CSV/Excel blob.

Query params: same filters as `GET /teams`

Response `200`: `Blob` (Content-Type: `text/csv` or `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

## Team Roles

### GET /teams/:id/roles

List roles for a team.

Response `200`: `{ "data": TeamRole[] }`

### POST /teams/:id/roles

Create a role for a team. Body JSON: `{ name, permissions[] }`.

Response `201`: `{ "data": TeamRole }`

Errors: `409 ROLE_NAME_EXISTS`, `422 MAX_ROLES_EXCEEDED`

### PATCH /teams/:id/roles/:roleId

Update a role's name or permissions.

Response `200`: `{ "data": TeamRole }`

## Team Members

### POST /teams/:id/employees

Assign an employee to a team.

Body JSON:

```json
{
  "employeeId": "emp_01",
  "roleId": "role_01",
  "customPermissions": ["read", "write"]
}
```

Response `201`: `{ "data": { "success": true } }`

Errors: `409 MEMBER_ALREADY_EXISTS`, `422 MAX_MEMBERS_EXCEEDED`, `404 EMPLOYEE_NOT_FOUND`, `400 EMPLOYEE_TERMINATED`
