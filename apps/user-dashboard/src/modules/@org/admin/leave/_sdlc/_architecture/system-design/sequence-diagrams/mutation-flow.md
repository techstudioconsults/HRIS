# Leave Management — Mutation Flow Sequence Diagram

_Sequence of events when an HR admin approves or declines a leave request._

## Approve Leave Request

```
Admin                LeaveRequestDetailDrawer    useApproveLeaveRequest    leaveService       HttpAdapter        Backend API
  |                          |                           |                      |                  |                   |
  |── click "Approve" ──────→|                           |                      |                  |                   |
  |                          |── mutate(requestId) ─────→|                      |                  |                   |
  |                          |                           |                      |                  |                   |
  |                          | [optimistic update]        |                      |                  |                   |
  |                          |── set row status='approved' in cache              |                  |                   |
  |                          |                           |── approveRequest() ──→|                  |                   |
  |                          |                           |                      |── PATCH /approve →|                   |
  |                          |                           |                      |                  |── fetch ─────────→|
  |                          |                           |                      |                  |←─ 200 OK ─────────|
  |                          |                           |                      |←─ LeaveRequest ──|                   |
  |                          |                           |←── updated entity ───|                  |                   |
  |                          |  onSuccess:               |                      |                  |                   |
  |                          |  invalidate ['leave','requests', filters]         |                  |                   |
  |←── drawer closes ────────|                           |                      |                  |                   |
  |←── table refreshes ──────|                           |                      |                  |                   |
```

## Decline Leave Request (with mandatory reason)

```
Admin                DeclineForm            useDeclineLeaveRequest    leaveService       Backend API
  |                      |                          |                      |                  |
  |── type reason ───────→|                         |                      |                  |
  |── click "Decline" ───→|                         |                      |                  |
  |                       |── Zod validates reason  |                      |                  |
  |                       |   (min 10 chars)        |                      |                  |
  |                       |── mutate({ id, reason })→|                     |                  |
  |                       |                         |── declineRequest() ──→|                  |
  |                       |                         |                      |── PATCH /decline →|
  |                       |                         |                      |←─ 200 OK ─────────|
  |                       |                         |←── updated entity ───|                  |
  |                       |  onSuccess: invalidate + close drawer           |                  |
  |←── success toast ─────|                         |                      |                  |
```

## Error Handling on Mutation Failure

- If the PATCH returns 4xx/5xx, `onError` rolls back the optimistic update and shows an error toast.
- The drawer remains open so the admin can retry.
- Error message from the RFC 7807 `detail` field is displayed in the toast — never a raw stack trace.
