# Admin Dashboard — Error Flow Sequence Diagram

_How errors from backend API calls are caught, contained, and surfaced to the admin._

## Widget-Level Error Containment

```
Admin Browser         Widget Component        TanStack Query          Backend API
     |                      |                      |                       |
     |-- page load -------> |                      |                       |
     |                      |-- useQuery fires --> |-- GET /api/v1/... --> |
     |                      |                      |                       |
     |                      |                      |                       X  500 error
     |                      |                      |<-- error response ----|
     |                      |<-- isError: true ----|                       |
     |                      |                      |                       |
     |<-- widget renders error state (not crash) --|                       |
     |   "Unable to load headcount data. [Retry]"  |                       |
     |                      |                      |                       |
     |-- admin clicks Retry ->                     |                       |
     |                      |-- refetch() -->      |-- GET /api/v1/... --> |
```

## Error Boundary (Catastrophic Failures)

```
Admin Browser       DashboardErrorBoundary     Widget Tree
     |                      |                      |
     |-- page load -------> |                      |
     |                      |- render children --> |
     |                      |                      X  unhandled render error
     |                      |<-- componentDidCatch |
     |                      |                      |
     |<-- fallback UI: "Something went wrong. Refresh the page." --|
     |   (with support contact link and error reference ID)         |
```

## Error Handling Rules

1. Every `useQuery` result must handle `isError` — no widget renders blank on error.
2. The error message shown to the admin must never include stack traces or internal error details.
3. Retry buttons call `refetch()` from TanStack Query — no custom retry logic.
4. `DashboardErrorBoundary` is the last line of defence; it logs the error to the observability service before showing the fallback UI.
5. Network timeouts (>10s) are treated as errors; widgets show their error state.
