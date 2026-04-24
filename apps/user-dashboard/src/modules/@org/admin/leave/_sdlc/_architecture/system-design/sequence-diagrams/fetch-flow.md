# Leave Management — Fetch Flow Sequence Diagram

_Sequence of events when the admin leave requests table loads or filters are changed._

## Diagram

```
Browser                 LeaveAdminPage        useLeaveRequests      leaveService         HttpAdapter           Backend API
  |                          |                      |                    |                    |                      |
  |-- navigate /admin/leave →|                      |                    |                    |                      |
  |                          |-- prefetch (SSR) ───→|                    |                    |                      |
  |                          |                      |── getLeaveRequests→|                    |                      |
  |                          |                      |                    |── GET /leave/req. →|                      |
  |                          |                      |                    |                    |── fetch ────────────→|
  |                          |                      |                    |                    |←─ 200 + paginated ───|
  |                          |                      |                    |←─ validated data ──|                      |
  |                          |                      |←── LeaveRequest[] ─|                    |                      |
  |                          |←─ hydrate cache ─────|                    |                    |                      |
  |←──── initial HTML ───────|                      |                    |                    |                      |
  |                          |                      |                    |                    |                      |
  |-- filter change ─────────────────────────────→  |                    |                    |                      |
  |                          |                      |                    |                    |                      |
  |              useLeaveFilterStore.setFilter()     |                    |                    |                      |
  |                          |                      |                    |                    |                      |
  |                          |── query re-fires ───→|                    |                    |                      |
  |                          |   (new filter params)|── getLeaveRequests→|                    |                      |
  |                          |                      |                    |── GET /leave/req. →|                      |
  |                          |                      |                    |   ?status=pending  |── fetch ────────────→|
  |                          |                      |                    |                    |←─ 200 + filtered ────|
  |                          |                      |                    |←─ validated data ──|                      |
  |                          |                      |←── LeaveRequest[] ─|                    |                      |
  |←──── table re-renders ───|                      |                    |                    |                      |
```

## Notes

- The SSR prefetch populates TanStack Query cache so the client never sees a loading spinner on first load.
- Cache key includes serialised filter params — a filter change always triggers a fresh fetch unless the exact combination was previously cached (default `staleTime: 30s`).
- If the fetch fails (network error, 5xx), TanStack Query retries up to 2 times with exponential backoff before surfacing an error state.
