# User Leave — API Reference

_All backend endpoints consumed by the employee leave self-service module._

## Base URL

`/api/v1`

---

## Leave Types

### List Leave Types

`GET /leaves`

Response `200 OK`:

```json
{
  "status": "success",
  "data": [
    {
      "id": "lt_annual",
      "name": "Annual Leave",
      "days": 20,
      "cycle": "annual",
      "carryOver": true,
      "maxLeaveDaysPerRequest": 10,
      "description": "Standard annual leave entitlement"
    }
  ]
}
```

---

## Leave Requests

### List Employee's Leave Requests

`GET /leave-request`

Returns only the authenticated employee's own requests (scoped by JWT).

Query parameters:
| Param | Type | Description |
|-------|------|-------------|
| `page` | `number` | Page number (default: 1) |
| `size` | `number` | Page size (default: 20) |
| `status` | `'pending' \| 'approved' \| 'rejected'` | Filter by status |

Response `200 OK`:

```json
{
  "status": "success",
  "data": [
    {
      "id": "lr_01",
      "employeeId": "emp_01",
      "leaveTypeId": "lt_annual",
      "type": "Annual Leave",
      "startDate": "2025-07-14",
      "endDate": "2025-07-18",
      "days": 5,
      "reason": "Family vacation",
      "status": "pending",
      "createdAt": "2025-06-01T10:00:00Z",
      "updatedAt": "2025-06-01T10:00:00Z"
    }
  ],
  "pagination": { "total": 12, "page": 1, "size": 20, "totalPages": 1 }
}
```

---

### Create Leave Request

`POST /leave-request`

Request: `multipart/form-data`

| Field       | Type                  | Required |
| ----------- | --------------------- | -------- |
| `leaveId`   | `string`              | Yes      |
| `startDate` | `string (YYYY-MM-DD)` | Yes      |
| `endDate`   | `string (YYYY-MM-DD)` | Yes      |
| `reason`    | `string`              | Yes      |
| `document`  | `File`                | No       |

Response `201 Created`:

```json
{
  "status": "success",
  "data": { "id": "lr_new", "status": "pending", "...": "full LeaveRequest" }
}
```

Error `422 Unprocessable Entity` — validation or business rule failure:

```json
{
  "type": "https://hris.example.com/errors/validation-error",
  "title": "Validation Error",
  "status": 422,
  "errors": [
    {
      "field": "endDate",
      "code": "END_BEFORE_START",
      "message": "End date must be after start date."
    }
  ]
}
```

---

### Update Pending Leave Request

`PATCH /leave-request/:id`

Request: `multipart/form-data` — same fields as create; only changed fields required.

Pre-condition: Request must have `status === 'pending'`. Backend returns `409` if not pending.

Response `200 OK`: Updated `LeaveRequest` object.

---

### Delete Pending Leave Request

`DELETE /leave-request/:id`

Pre-condition: Request must have `status === 'pending'`.

Response `204 No Content`.

Error `409 Conflict` — request not pending:

```json
{
  "type": "https://hris.example.com/errors/request-not-pending",
  "title": "Request Not Pending",
  "status": 409,
  "detail": "Only pending leave requests can be deleted."
}
```
