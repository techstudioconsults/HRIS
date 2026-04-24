# User Home — Auth Guards

_Authentication and authorisation guards protecting the employee home dashboard._

## Middleware Route Guard

The Next.js middleware (`middleware.ts` at the app root) validates the employee's JWT on every request to `/user/*` routes, including `/user/dashboard`.

- If the token is absent or expired, the request is redirected to `/auth/login` before any Server Component renders.
- The guard runs at the edge — no database queries are made during this check.

## Server Component Session Check

Inside `HomePage` (Server Component), the session is read via the auth helper. If for any reason the session is missing despite passing the middleware (race condition during token refresh), the component falls back to the onboarding view and logs a warning — it does not throw.

## Client-Side Protection

The home module contains no client-side data fetching at MVP. When Phase 2 TanStack Query hooks are added, each hook must include the auth header from the session; 401 responses trigger a session refresh or redirect.

## Setup Task Button Guards

- Buttons for `locked` setup tasks are rendered with `disabled={true}` and no `onClick` handler.
- The `buttonAction` for a completed task is a no-op; clicking it again has no effect.
