---
section: product
topic: user-story
id: US-006
epic: EPIC-001
version: 1.0
created: 2026-04-26
---

# US-006 — Logout

## Story

As an authenticated user, I want to securely log out so that my session is fully
cleared and no one else can access my account from this device.

## Acceptance Criteria

- [ ] Logout is triggered from the top bar "Sign Out" action.
- [ ] On logout: `DELETE /api/auth/session` clears all 3 HTTP-only cookies.
- [ ] `useAuthStore.logout()` is called — in-memory user state cleared.
- [ ] TanStack Query cache is cleared (prevent stale data on next login).
- [ ] User is redirected to `/login` after cookie clear.
- [ ] If the DELETE call fails, user is still redirected to `/login` — fail-safe logout.
- [ ] Zero NextAuth `signOut()` imports.

## Flow

```
User clicks "Sign Out" (TopBar)
  → useLogout() hook
    → DELETE /api/auth/session (BFF Route Handler)
      → clears __hris_at, __hris_rt, __hris_meta cookies
    → tokenManager.invalidate() — clear in-memory token cache
    → useAuthStore.logout() — clear user state
    → queryClient.clear() — clear all TanStack Query cache
    → router.push('/login')
```

## Error Cases

| Scenario                    | UI Behaviour                                                        |
| --------------------------- | ------------------------------------------------------------------- |
| DELETE call fails (network) | Still clear store + cache + navigate to /login (client-side logout) |
| Already logged out          | No error — idempotent; `/login` is a no-op redirect                 |
