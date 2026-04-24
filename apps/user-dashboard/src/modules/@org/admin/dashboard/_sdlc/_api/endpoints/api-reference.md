# Admin Dashboard — API Reference

_Backend endpoints consumed by the dashboard module._

## Base URL

`/api/v1/dashboard`

All endpoints require a valid `Authorization: Bearer <token>` header. Responses follow the standard envelope: `{ status, message, data, errors, timestamp }`.

---

## GET /api/v1/dashboard/headcount

Returns the current headcount snapshot for the authenticated organisation.

**Response 200**

```json
{
  "status": "success",
  "data": {
    "total": 142,
    "active": 138,
    "onLeave": 4,
    "terminatedThisMonth": 2,
    "asOf": "2026-04-23T08:00:00Z"
  },
  "timestamp": "2026-04-23T08:00:01Z"
}
```

---

## GET /api/v1/dashboard/attendance

Returns the attendance rate for the current pay period and trend data.

**Response 200**

```json
{
  "status": "success",
  "data": {
    "ratePercent": 94.2,
    "payPeriodStart": "2026-04-01",
    "payPeriodEnd": "2026-04-30",
    "trend": [
      { "period": "2026-03", "ratePercent": 92.1 },
      { "period": "2026-02", "ratePercent": 95.0 }
    ]
  },
  "timestamp": "2026-04-23T08:00:01Z"
}
```

---

## GET /api/v1/dashboard/pending-actions

Returns counts of items awaiting admin action.

**Response 200**

```json
{
  "status": "success",
  "data": {
    "leaveRequestCount": 5,
    "payrollApprovalCount": 1,
    "documentExpiryCount": 3
  },
  "timestamp": "2026-04-23T08:00:01Z"
}
```

---

## GET /api/v1/dashboard/activity

Returns the most recent HR events. Supports `?limit=N` (default 10, max 50).

**Response 200**

```json
{
  "status": "success",
  "data": [
    {
      "id": "evt_001",
      "eventType": "HIRE",
      "actorName": "Jane Admin",
      "subjectName": "John Doe",
      "occurredAt": "2026-04-22T14:30:00Z",
      "moduleLink": "/admin/employee/emp_456"
    }
  ],
  "timestamp": "2026-04-23T08:00:01Z"
}
```

---

## GET /api/v1/dashboard/leave-summary

Returns upcoming leaves grouped by department for the current week.

---

## GET /api/v1/dashboard/payroll-summary

Returns the next and last payroll run details.

---

## Error Responses

All endpoints return RFC 7807-style errors on failure:

```json
{
  "status": "error",
  "errors": [{ "code": "UNAUTHORIZED", "message": "Authentication required" }],
  "timestamp": "2026-04-23T08:00:01Z"
}
```
