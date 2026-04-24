# User Home — API Error Handling

_How the home dashboard handles API errors gracefully._

## Error Scenarios

| Scenario                               | HTTP Status   | Handling Strategy                                                                 |
| -------------------------------------- | ------------- | --------------------------------------------------------------------------------- |
| Unauthenticated request                | 401           | Next.js middleware redirects to `/auth/login` before the page renders             |
| Activity feed unavailable              | 500 / timeout | Render `RecentActivities` with empty array; show "No recent activity" empty state |
| Employee profile not found             | 404           | Default to onboarding view; log warning server-side                               |
| Network failure (client-side, Phase 2) | N/A           | TanStack Query retry logic (3 retries); show error toast if all retries fail      |

## Response Shape Validation

All API responses must conform to the standard envelope before being consumed:

```ts
{
  status: "success" | "error",
  data?: T,
  errors?: ErrorDetail[],
  timestamp: string
}
```

If `status` is `"error"`, the home module logs the error server-side and renders a graceful fallback — it never surfaces raw API error messages to the employee.

## Graceful Degradation

- The dashboard must always render. A partial failure (e.g., missing activities) must never prevent the quick-action cards or welcome header from appearing.
- Errors are caught at the Server Component boundary using try/catch around all async data fetches.
