# Leave Management — Authentication & Authorisation Guards

_How authentication and authorisation are enforced for the admin leave module._

## Authentication

- All pages under `/admin/leave` require a valid JWT session.
- Next.js middleware intercepts unauthenticated requests before they reach the page component and redirects to `/login?callbackUrl=/admin/leave`.
- JWT is validated server-side on every request; the middleware does not trust client-side session cookies without verification.

## Route-Level Guard

The middleware at `apps/user-dashboard/src/middleware.ts` handles:

1. Check for valid session (`getServerSession` or equivalent).
2. If no session → redirect to `/login`.
3. If session exists but user lacks `LEAVE_ADMIN` or `LEAVE_VIEWER` role → redirect to `/403`.
4. If session valid and role satisfied → pass through to page.

## Component-Level Guards

- Approve/Decline buttons check `user.role` from session context and apply `disabled` + `aria-disabled="true"` for non-admin viewers.
- The Setup Wizard entry point is not rendered for `LEAVE_VIEWER` roles — the wizard link/button is conditionally removed from the DOM.
- These are **UX guards only** — backend enforces the real authorization on every API call.

## Server Action / Route Handler Guards

- Any Server Actions within this module must call `requireRole('LEAVE_ADMIN')` as the first line — before any data processing.
- Route Handlers under `app/api/` that proxy leave mutations must validate the session role before forwarding to the backend.

## Session Token Handling

- JWT is never stored in `localStorage` — it lives in an `httpOnly` secure cookie managed by the auth library.
- The HttpAdapter attaches the token from the server-side session to every outbound API request header — frontend components never handle raw tokens.
- Token refresh is handled transparently by the auth middleware; the leave module does not implement any token refresh logic.
