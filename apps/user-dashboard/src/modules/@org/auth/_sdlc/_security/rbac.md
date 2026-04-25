# Auth — RBAC Configuration

## Auth Pages Access Model

Auth pages (`/login`, `/register`, `/forgot-password`, `/reset-password`, `/login/otp`, `/login/otp-verify`) are **PUBLIC** — no authentication required. `proxy.ts` only enforces that **already-authenticated** users cannot access them (redirect to dashboard).

| Route               | Who Can Access       |
| ------------------- | -------------------- |
| `/login`            | Unauthenticated only |
| `/login/otp`        | Unauthenticated only |
| `/login/otp-verify` | Unauthenticated only |
| `/register`         | Unauthenticated only |
| `/forgot-password`  | Unauthenticated only |
| `/reset-password`   | Unauthenticated only |

## Post-Login Routing by Role

After successful authentication, `proxy.ts` routes based on the user's role:

| Role                                              | Redirect Destination |
| ------------------------------------------------- | -------------------- |
| `owner` (has `admin:admin`)                       | `/admin/dashboard`   |
| `hr_manager`, `welfare_officer` (has admin perms) | `/admin/dashboard`   |
| `employee` (no admin perms)                       | `/user/home`         |

## Permission Issuance

Permissions are NOT managed by this module. The backend issues permissions on login as part of the `AuthResponseData.permissions` array. This module stores them in the NextAuth session. The proxy and individual module guards consume them.

## What This Module Does NOT Control

- Which features a logged-in user can access — that's `proxy.ts` + individual module RBAC.
- Employee account creation / deactivation — that's `admin/employee`.
- Password change for authenticated users — that's user profile settings.
