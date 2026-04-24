# User Home — Error Flow Sequence

_How errors are surfaced to the employee in the home dashboard._

## Activity Feed Fetch Error

```
Browser          Next.js Server       Activities API
   |                   |                   |
   |  GET /user/dashboard                  |
   |──────────────────>|                   |
   |                   |  GET /employees/{id}/activities
   |                   |──────────────────>|
   |                   |  500 / timeout    |
   |                   |<──────────────────|
   |                   |  [error caught — graceful fallback]
   |                   |  render: empty activity feed with message
   |  ActiveUserView (partial — no activities, no crash)
   |<──────────────────|                   |
```

## Session Unavailable (Unauthenticated Access)

```
Browser          Next.js Middleware
   |                   |
   |  GET /user/dashboard (no valid session)
   |──────────────────>|
   |                   |  redirect to /auth/login
   |<──────────────────|
```

## Graceful Degradation Rules

- If the activity feed API fails, show an empty state ("No recent activity") — do not crash the dashboard.
- If the `userSetupComplete` flag is missing from the session, default to rendering the onboarding view (safer assumption for new accounts).
- All errors must be caught at the Server Component level; no unhandled promise rejections.
