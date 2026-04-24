# Leave Management — API Reference

_All backend endpoints consumed by the admin leave module. All routes require `Authorization: Bearer <jwt>` and the `LEAVE_ADMIN` role unless noted._

## Leave Requests

### GET /api/v1/leave/requests

Fetch a paginated list of leave requests.

**Query Parameters**

| Param          | Type   | Default           | Description                                      |
| -------------- | ------ | ----------------- | ------------------------------------------------ |
| `page`         | number | 1                 | Page number (1-indexed)                          |
| `size`         | number | 20                | Records per page (max 100)                       |
| `sort`         | string | `submittedAt:asc` | Sort field and direction                         |
| `status`       | string | —                 | Filter: `pending\|approved\|declined\|cancelled` |
| `leaveTypeId`  | string | —                 | Filter by leave type UUID                        |
| `departmentId` | string | —                 | Filter by department UUID                        |
| `from`         | string | —                 | Filter: start date range (YYYY-MM-DD)            |
| `to`           | string | —                 | Filter: end date range (YYYY-MM-DD)              |

**Response 200**

```json
{
  "status": "success",
  "data": {
    "items": [
      /* LeaveRequest[] */
    ],
    "total": 142,
    "page": 1,
    "size": 20,
    "totalPages": 8
  },
  "timestamp": "2026-04-23T10:00:00.000Z"
}
```

---

### PATCH /api/v1/leave/requests/:id/approve

Approve a pending leave request.

**Response 200**: Updated `LeaveRequest` with `status: 'approved'`.

**Errors**: `404` request not found · `409` already actioned · `403` insufficient role

---

### PATCH /api/v1/leave/requests/:id/decline

Decline a pending leave request.

**Request Body**

```json
{ "reason": "Insufficient staffing cover during requested dates" }
```

**Response 200**: Updated `LeaveRequest` with `status: 'declined'`.

---

## Leave Types

### GET /api/v1/leave/types

Fetch all leave types for the organisation (including archived if `?includeArchived=true`).

### POST /api/v1/leave/types

Create a new leave type.

**Request Body**: `CreateLeaveTypeDto` (see `types/leave.schemas.ts`).

### PUT /api/v1/leave/types/:id

Update an existing leave type.

### PATCH /api/v1/leave/types/:id/archive

Archive a leave type (soft delete). Existing requests are unaffected.

---

## Leave Policy

### GET /api/v1/leave/policy

Fetch the organisation's leave policy.

### PUT /api/v1/leave/policy

Update the organisation's leave policy.

---

## Employee Leave Balance

### GET /api/v1/leave/balance/:employeeId

Fetch all leave balances for a specific employee. Requires `LEAVE_ADMIN` or `LEAVE_VIEWER` role.

**Response 200**: Array of `LeaveBalance` objects, one per leave type.
