# User Leave — Fetch Flow Sequence

_Sequence diagram for loading the employee leave page._

## Initial Page Load

```
Browser          LeaveView (Client)    TanStack Query     Backend API
   |                   |                   |                   |
   |  navigate to /user/leave              |                   |
   |──────────────────>|                   |                   |
   |                   |  mount            |                   |
   |                   |──────────────────>|                   |
   |                   |  GET /leaves      |                   |
   |                   |───────────────────────────────────────>
   |                   |  LeaveType[]      |                   |
   |                   |<───────────────────────────────────────
   |                   |  GET /leave-request (page=1, size=20) |
   |                   |───────────────────────────────────────>
   |                   |  PaginatedApiResponse<LeaveRequest>   |
   |                   |<───────────────────────────────────────
   |  LeaveView rendered with LeaveBody + LeaveCards           |
   |<──────────────────|                   |                   |
```

## Subsequent Loads (Cache Hit)

```
Browser          LeaveView          TanStack Query cache
   |                   |                   |
   |  navigate to /user/leave              |
   |──────────────────>|                   |
   |                   |  cache hit        |
   |                   |──────────────────>|
   |                   |  LeaveRequest[] from cache
   |                   |<──────────────────|
   |  Immediate render (stale-while-revalidate)
   |<──────────────────|                   |
```
