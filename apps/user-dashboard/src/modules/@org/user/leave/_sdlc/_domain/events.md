# User Leave — Domain Events

## LeaveRequestSubmitted

Emitted when an employee successfully creates a new leave request.

| Field         | Type                | Description             |
| ------------- | ------------------- | ----------------------- |
| `requestId`   | `string`            | New leave request ID    |
| `employeeId`  | `string`            | Requesting employee     |
| `leaveTypeId` | `string`            | Leave type selected     |
| `startDate`   | `string (ISO 8601)` | Start date              |
| `endDate`     | `string (ISO 8601)` | End date                |
| `days`        | `number`            | Working days calculated |
| `occurredAt`  | `string (ISO 8601)` | Event timestamp         |

**Subscribers**: Admin Leave context (new pending request to action); Notification service (notify HR manager)

---

## LeaveRequestUpdated

Emitted when an employee edits a pending leave request.

| Field           | Type                | Description         |
| --------------- | ------------------- | ------------------- |
| `requestId`     | `string`            | Updated request ID  |
| `employeeId`    | `string`            | Requesting employee |
| `changedFields` | `string[]`          | Fields that changed |
| `occurredAt`    | `string (ISO 8601)` | Event timestamp     |

**Pre-condition**: Request must be in `pending` status — only pending requests can be updated.

---

## LeaveRequestDeleted

Emitted when an employee withdraws a pending leave request.

| Field        | Type                | Description         |
| ------------ | ------------------- | ------------------- |
| `requestId`  | `string`            | Deleted request ID  |
| `employeeId` | `string`            | Requesting employee |
| `occurredAt` | `string (ISO 8601)` | Event timestamp     |

**Pre-condition**: Request must be in `pending` status.

---

## Events This Context Consumes (Read-Only)

| Event                  | Source              | How Used                                                                                       |
| ---------------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| `LeaveRequestApproved` | Admin Leave context | TanStack Query cache invalidated — list refreshes to show `approved` status                    |
| `LeaveRequestRejected` | Admin Leave context | TanStack Query cache invalidated — list refreshes to show `rejected` status + rejection reason |
