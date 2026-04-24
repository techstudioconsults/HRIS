# Admin Dashboard — API Error Handling

_How the dashboard module handles error responses from backend APIs._

## Error Response Shape

All dashboard API errors follow the standard HRIS response envelope:

```json
{
  "status": "error",
  "errors": [{ "code": "ERROR_CODE", "message": "Human-readable description" }],
  "timestamp": "2026-04-23T08:00:01Z"
}
```

## Error Codes and Frontend Handling

| HTTP Status     | Error Code       | Dashboard Behaviour                                                        |
| --------------- | ---------------- | -------------------------------------------------------------------------- |
| 401             | `UNAUTHORIZED`   | Redirect to `/login` via auth middleware (handled app-wide)                |
| 403             | `FORBIDDEN`      | Show "You do not have permission to view this data" in the affected widget |
| 404             | `NOT_FOUND`      | Treat as empty data — show empty state, not an error                       |
| 429             | `RATE_LIMITED`   | Show "Too many requests, please wait" with a countdown before auto-retry   |
| 500/503         | `INTERNAL_ERROR` | Show widget-level error state with a manual retry button                   |
| Network timeout | —                | Treated as 503; same error state as above                                  |

## TanStack Query Retry Configuration

```typescript
// Applied globally in the QueryClient configuration
{
  retry: 1,              // One automatic retry on network error
  retryDelay: 1000,      // 1 second delay before retry
  staleTime: 5 * 60 * 1000,  // 5 minutes default; overridden per query
}
```

## Widget-Level Error UI Requirements

- Error messages must be user-friendly — no error codes or stack traces visible to admins.
- Each error state must include a "Retry" button that calls `refetch()`.
- Errors must not cause layout shift — the widget maintains its reserved space during error state.
- Error states must be distinguishable from loading and empty states visually.
