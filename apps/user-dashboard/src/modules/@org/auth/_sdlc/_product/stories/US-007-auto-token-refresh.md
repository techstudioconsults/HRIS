---
section: product
topic: user-story
id: US-007
epic: EPIC-001
version: 1.0
created: 2026-04-26
---

# US-007 — Automatic Token Refresh

## Story

As an authenticated user, I want my session to refresh automatically when my access
token expires so that I am never interrupted by unexpected logouts during active use.

## Acceptance Criteria

- [ ] On any `401` API response, the TokenManager calls `POST /api/auth/refresh` before surfacing the error.
- [ ] If refresh succeeds: original request is retried transparently — user sees no error.
- [ ] If refresh fails (`401` from `/api/auth/refresh`): cookies are cleared via `DELETE /api/auth/session`, user is redirected to `/login`.
- [ ] Concurrent requests that receive `401` simultaneously coalesce into a single refresh call — no double-refresh.
- [ ] The in-memory token cache is updated after a successful refresh.
- [ ] No NextAuth `getSession()` calls.

## Flow

```
Any API call → 401
  → httpConfig.ts interceptor (first occurrence only — _retried guard)
    → tokenManager.refreshAccessToken()
      → POST /api/auth/refresh (BFF)
        → reads __hris_rt cookie
        → POST /auth/refresh (backend) with { refreshToken }
        ← { accessToken, refreshToken }
        → sets new __hris_at, __hris_rt, __hris_meta cookies
        ← returns { accessToken, expiresAt }
      → update tokenManager cache
    → retry original request with new Bearer token
    ← original response returned to caller

  If refresh fails:
    → tokenManager.invalidate()
    → DELETE /api/auth/session (clear cookies)
    → window.location.replace('/login')
```

## Error Cases

| Scenario                     | Behaviour                                                           |
| ---------------------------- | ------------------------------------------------------------------- |
| Refresh token expired        | `POST /api/auth/refresh` returns 401 → forced logout                |
| Network error during refresh | Treat as refresh failure → forced logout                            |
| Concurrent 401s              | Only first triggers refresh; others await `pendingRequest` sentinel |
