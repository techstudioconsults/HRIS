---
section: product
topic: user-story
id: US-008
epic: EPIC-001
version: 1.0
created: 2026-04-26
---

# US-008 — Route Protection

## Story

As the system, I want to enforce access control on every route request so that
unauthenticated users cannot access protected pages and authenticated users are
always directed to the appropriate dashboard for their role.

## Acceptance Criteria

- [ ] **Unauthenticated → protected route**: redirect to `/login?callbackUrl=<path>`.
- [ ] **Authenticated → auth page** (`/login`, `/register`, `/forgot-password`, etc.): redirect to role-appropriate dashboard.
- [ ] **Admin on `/user/*`**: redirect to `/admin/dashboard`.
- [ ] **Non-admin on `/admin/*`**: redirect to `/user/dashboard`.
- [ ] **`OWNER` role on `OWNER_ONLY` route**: permitted.
- [ ] **Non-owner on `OWNER_ONLY` route**: redirect to role dashboard.
- [ ] **`PERMISSION_BASED` route**: check `__hris_meta.permissions` against required permissions; redirect if missing.
- [ ] **`PUBLIC` route**: always permitted — no cookie check.
- [ ] Zero NextAuth `getToken()` calls — uses `__hris_meta` cookie + Web Crypto HMAC verify.
- [ ] Tampered or missing `__hris_meta` cookie treated as unauthenticated.

## Access Level Matrix

| Route Group                 | Access Level       | Auth Required | Permission Required |
| --------------------------- | ------------------ | :-----------: | :-----------------: |
| `/login`, `/register`, etc. | `PUBLIC`           |      ❌       |         ❌          |
| `/user/*`                   | `AUTHENTICATED`    |      ✅       |         ❌          |
| `/admin/*`                  | `PERMISSION_BASED` |      ✅       |       `admin`       |
| `/admin/settings/roles`     | `OWNER_ONLY`       |      ✅       |    `admin:admin`    |

## Flow

```
Every request → proxy.ts (Edge Middleware)

1. Skip static assets, /api/*, /_ next/*
2. Read __hris_meta cookie
3. If missing/invalid: treat as unauthenticated
4. If valid: extract { role, permissions, exp }
5. Check exp — if expired: treat as unauthenticated
6. Apply access level rules:
   - PUBLIC → next()
   - AUTHENTICATED → authenticated ? next() : redirect(/login?callbackUrl=...)
   - OWNER_ONLY → owner+admin ? next() : redirect(dashboard)
   - PERMISSION_BASED → hasPermissions ? next() : redirect(dashboard)
7. Auth-page guard: authenticated + auth page → redirect(dashboard)
8. Role routing: admin on /user → /admin/dashboard; non-admin on /admin → /user/dashboard
```
