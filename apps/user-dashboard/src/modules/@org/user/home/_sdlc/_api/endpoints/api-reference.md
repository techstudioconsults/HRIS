# User Home — API Reference

_Planned and current API endpoints consumed by the employee home dashboard._

## Current State

The home module does not yet call live endpoints. `RECENT_ACTIVITIES` in `constants/recent-activities.ts` is a static mock placeholder. The endpoints below are the **planned** contracts for Phase 2.

---

## GET /api/v1/employees/{id}/activities

Fetch the authenticated employee's recent HR activity feed.

**Auth**: Bearer JWT (employee scope — returns only the requesting employee's activities)

**Query Parameters**

| Param  | Type   | Default | Description             |
| ------ | ------ | ------- | ----------------------- |
| `page` | number | 1       | Page number             |
| `size` | number | 20      | Items per page (max 50) |

**Response 200**

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "activity-1",
        "type": "approved",
        "title": "Leave Request Approved",
        "message": "Your annual leave for Oct 18-21 was approved.",
        "timestamp": "2025-10-18T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "size": 20,
    "totalPages": 1
  },
  "timestamp": "2025-10-18T10:00:00.000Z"
}
```

**Response 401** — unauthenticated; redirect to `/auth/login`.

---

## GET /api/v1/employees/{id}/profile

Returns the employee's profile-completion state (used to determine view variant).

**Response 200** (relevant fields)

```json
{
  "status": "success",
  "data": {
    "id": "emp-001",
    "firstName": "Jane",
    "userSetupComplete": true
  },
  "timestamp": "2025-10-18T10:00:00.000Z"
}
```
