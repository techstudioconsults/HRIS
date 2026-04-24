# Admin Dashboard — Fetch Flow Sequence Diagram

_Sequence of events when the admin loads the dashboard and widget data is fetched._

## Diagram

```
Admin Browser          Next.js App Shell       TanStack Query         Backend API
     |                        |                      |                      |
     |-- GET /admin/dashboard -->                     |                      |
     |                        |-- RSC render -------> |                      |
     |                        |   (DashboardPage)     |                      |
     |<-- HTML shell + JS ----|                      |                      |
     |                        |                      |                      |
     |-- Hydrate client ------>                       |                      |
     |   components mount      |                      |                      |
     |                        |                      |                      |
     |-- useQuery: headcount -->                      |                      |
     |-- useQuery: attendance ->                      |                      |
     |-- useQuery: pending-actions ->                 |                      |
     |   (all fire in parallel)                       |                      |
     |                        |                      |-- GET /api/v1/dashboard/headcount -->
     |                        |                      |-- GET /api/v1/dashboard/attendance -->
     |                        |                      |-- GET /api/v1/dashboard/pending-actions -->
     |                        |                      |                      |
     |                        |                      |<-- 200 { status, data } --
     |                        |                      |<-- 200 { status, data } --
     |                        |                      |<-- 200 { status, data } --
     |                        |                      |                      |
     |<-- widgets re-render with data --------------- |                      |
```

## Notes

- Skeleton loaders are shown from mount until each individual query resolves.
- Requests fire in parallel because widgets mount independently — no waterfall.
- TanStack Query deduplicates identical keys if the same query is triggered from multiple components.
