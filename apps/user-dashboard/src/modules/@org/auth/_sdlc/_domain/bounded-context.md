---
section: domain
topic: bounded-context
---

# Auth — Bounded Context

## Context Name

**IdentityAndAccess**

## Responsibility

Handles all aspects of user identity: who you are (authentication), proof of identity (credentials / OTP / session), and the issuance of access tokens that downstream contexts use to enforce authorization.

## Context Boundary

```
┌───────────────────────────────────────────────────────┐
│  IdentityAndAccess                                    │
│                                                       │
│  Aggregates: Session, PasswordCredential, OTPRequest  │
│  Services:   AuthService, NextAuth credentials handler│
│  Operations: login, requestOTP, verifyOTP,            │
│              register, forgotPassword, resetPassword   │
│  State:      useAuthStore (Zustand, UI only)          │
└───────────────────────────────────────────────────────┘
         │ provides
         ▼
┌───────────────────────────────────────────────────────┐
│  RBAC / RouteGuard (proxy.ts)                         │
│  Consumes: JWT session (isAuthenticated, permissions) │
└───────────────────────────────────────────────────────┘
         │ provides identity to
         ▼
┌───────────────────────────────────────────────────────┐
│  All other modules (admin/*, user/*)                  │
│  Consume: accessToken via tokenManager → HttpAdapter  │
└───────────────────────────────────────────────────────┘
```

## Upstream Dependencies

| Context     | What We Consume                                            |
| ----------- | ---------------------------------------------------------- |
| Backend API | `/auth/*` endpoints — validates credentials, issues tokens |
| NextAuth    | Session management, JWT cookie lifecycle                   |

## Downstream Consumers

| Context       | What They Use                                                         |
| ------------- | --------------------------------------------------------------------- |
| `proxy.ts`    | Session `isAuthenticated` + `permissions` for route-level enforcement |
| `HttpAdapter` | `accessToken` via `tokenManager` for all API calls                    |
| All modules   | Implicitly depend on a valid session being present                    |

## Anti-Corruption Notes

- Auth tokens are never passed as props or stored in React context by this module — they live in the NextAuth session only.
- `useAuthStore` is UI convenience state; it never makes auth decisions. The proxy and HttpAdapter use the NextAuth session directly.
- No other module imports from `auth/services/` or `auth/stores/` — auth state is consumed via NextAuth's `useSession()` / `getServerSession()`.
