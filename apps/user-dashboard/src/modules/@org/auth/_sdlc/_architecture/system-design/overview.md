---
section: architecture
topic: system-design-overview
version: 2.0
updated: 2026-04-26
supersedes: v1.0 (NextAuth-based)
---

# Auth — System Design Overview (v2 — Custom Session)

> ADR-002 removed NextAuth. All session management is now owned by this codebase.
> See `decisions/ADR-002-remove-nextauth.md` for the full rationale.

---

## C4 — Level 1: System Context

```mermaid
C4Context
  title Auth System — Level 1: System Context

  Person(owner, "Company Owner", "Registers the company, manages HR settings")
  Person(employee, "HR Employee", "Logs in to access HR features")

  System(hris, "HRIS Web App", "Next.js 16 App Router — serves UI, manages session cookies via Route Handlers")

  System_Ext(backend, "HR Backend API", "NestJS — issues JWTs, validates credentials, manages business data")
  System_Ext(email, "Email Service", "Sends OTP codes and password reset links (backend-triggered)")

  Rel(owner, hris, "Registers, logs in, manages company")
  Rel(employee, hris, "Logs in, accesses HR features")
  Rel(hris, backend, "Auth calls: login, OTP, register, refresh", "HTTPS/REST")
  Rel(backend, email, "Sends OTP and reset emails", "SMTP/SendGrid")
```

---

## C4 — Level 2: Container

```mermaid
C4Container
  title Auth System — Level 2: Containers

  Person(user, "User (Owner / Employee)")

  System_Boundary(nextjs, "HRIS Web App (Next.js 16)") {
    Container(pages, "App Router Pages", "Next.js RSC + Client Components", "Auth UI: /login, /register, /forgot-password, /reset-password, /login/otp")
    Container(middleware, "Edge Middleware (proxy.ts)", "Next.js Middleware", "Route guard: reads __hris_meta cookie, enforces RBAC")
    Container(bff, "BFF Route Handlers", "Next.js Route Handlers", "POST /api/auth/session, GET /api/auth/token, DELETE /api/auth/session, POST /api/auth/refresh")
    Container(session_lib, "Session Library (src/lib/session)", "TypeScript", "useSession hook, SessionProvider, HMAC sign/verify, cookie constants")
    Container(http, "HTTP Layer (src/lib/http)", "Axios + TokenManager", "Attaches Bearer token to every API request, handles 401 refresh")
    ContainerDb(cookies, "HTTP-only Cookies", "Browser Cookie Store", "__hris_at (access token), __hris_rt (refresh token), __hris_meta (signed session metadata)")
  }

  System_Ext(backend, "HR Backend API", "NestJS — /auth/* endpoints")

  Rel(user, pages, "Interacts with auth forms", "HTTPS")
  Rel(pages, bff, "POST session on login / DELETE on logout")
  Rel(pages, session_lib, "useSession() to read user + permissions")
  Rel(middleware, cookies, "Reads __hris_meta, verifies HMAC")
  Rel(bff, cookies, "Sets / clears HTTP-only cookies")
  Rel(bff, backend, "Proxies /auth/refresh token rotation")
  Rel(http, bff, "GET /api/auth/token to read access token")
  Rel(http, backend, "API calls with Authorization: Bearer <token>")
```

---

## C4 — Level 3: Component (Auth Module)

```mermaid
C4Component
  title Auth Module — Level 3: Components

  Container_Boundary(auth_mod, "Auth Module (src/modules/@org/auth)") {
    Component(login_view, "LoginView", "Client Component", "Password login form — RHF + Zod + useLoginWithPassword mutation")
    Component(otp_request_view, "OtpLoginView", "Client Component", "Email-only form — triggers requestOTP mutation")
    Component(otp_verify_view, "InputOtpCard", "Client Component", "6-digit OTP input — triggers loginWithOTP mutation")
    Component(register_view, "RegisterView", "Client Component", "Company registration form — useSignUp mutation")
    Component(forgot_view, "ForgotPasswordView", "Client Component", "Email form — useForgotPassword mutation")
    Component(reset_view, "ResetPasswordView", "Client Component", "New password form — useResetPassword mutation")
    Component(auth_service, "AuthService", "TypeScript Class", "Calls backend /auth/* endpoints via HttpAdapter")
    Component(use_auth_service, "useAuthService", "React Hook", "TanStack Query mutation wrappers around AuthService methods")
    Component(use_logout, "useLogout", "React Hook", "Calls DELETE /api/auth/session, invalidates store, navigates to /login")
    Component(auth_store, "useAuthStore", "Zustand Store", "In-memory UI state: { user, isAuthenticated, sessionExpiry }")
  }

  Container_Boundary(session, "Session Library (src/lib/session)") {
    Component(session_ctx, "SessionProvider", "React Context", "Fetches session on mount via GET /api/auth/token; hydrates store")
    Component(use_session, "useSession()", "React Hook", "Returns { data: session, status } — drop-in for next-auth/react")
    Component(get_session, "getSession()", "Async Function", "Server-safe session fetch")
    Component(session_mgr, "SessionManager", "TypeScript Module", "HMAC-SHA256 sign/verify for __hris_meta using Web Crypto API")
  }

  Container_Boundary(bff_handlers, "BFF Route Handlers") {
    Component(session_route, "POST /api/auth/session", "Route Handler", "Receives { employee, tokens, permissions }, sets 3 HTTP-only cookies")
    Component(token_route, "GET /api/auth/token", "Route Handler", "Reads __hris_at cookie, returns { accessToken, expiresAt }")
    Component(logout_route, "DELETE /api/auth/session", "Route Handler", "Clears all 3 cookies")
    Component(refresh_route, "POST /api/auth/refresh", "Route Handler", "Reads __hris_rt, calls backend /auth/refresh, rotates cookies")
  }

  Rel(login_view, use_auth_service, "useLoginWithPassword()")
  Rel(otp_verify_view, use_auth_service, "useLoginWithOTP()")
  Rel(use_auth_service, auth_service, "delegates HTTP calls")
  Rel(auth_service, session_route, "POST session after successful login")
  Rel(use_logout, logout_route, "DELETE /api/auth/session")
  Rel(use_logout, auth_store, "clearUser()")
  Rel(session_ctx, token_route, "GET /api/auth/token on mount")
  Rel(session_ctx, auth_store, "setUser() with session data")
  Rel(use_session, session_ctx, "reads context value")
```

---

## Key Design Decisions

### 1. Route Handlers as BFF (Backend For Frontend)

Auth tokens never touch client-side JavaScript after login. The sequence is:

```
LoginView
  → useLoginWithPassword()
    → AuthService.loginWithPassword() → POST /auth/login/password (backend)
    ← { employee, tokens, permissions }
  → POST /api/auth/session (Route Handler)
    → sets __hris_at, __hris_rt, __hris_meta as HTTP-only cookies
  → router.push('/login/continue')
```

### 2. Session Metadata Cookie for Middleware

`proxy.ts` runs at the Edge on every request. It cannot make async backend calls.
`__hris_meta` is a compact signed cookie `{ id, role, permissions, exp }` that the
middleware can verify synchronously using the Web Crypto API.

```
proxy.ts
  → request.cookies.get('__hris_meta')
  → SessionManager.verify(cookie, AUTH_SECRET)
  → extract { role, permissions }
  → enforce ACCESS_LEVELS rules
```

### 3. TokenManager reads via Route Handler

Axios interceptor needs the access token for every API call. The token is in an
HTTP-only cookie — JavaScript cannot read it. The TokenManager calls
`GET /api/auth/token`, which reads the cookie server-side and returns the token.
The result is cached in memory with a 5-minute expiry buffer.

### 4. Drop-in `useSession()` Compatibility

All 17 existing `useSession()` consumers require only an import path change:

```ts
// Before
import { useSession } from 'next-auth/react';
// After
import { useSession } from '@/lib/session';
```

The returned `{ data, status }` shape is identical.

### 5. Zustand Store is Secondary

`useAuthStore` holds `{ user, isAuthenticated }` for synchronous in-component reads
(e.g. rendering a user avatar without an async call). The `SessionProvider` populates
it from the session on mount. **The cookie is the source of truth** — the store is
a cache.

### 6. Unified Session Path for OTP + Password

Both login flows call `POST /api/auth/session` after success. The session
establishment is identical regardless of how the user authenticated.

---

## Component Tree

```
RootLayout
└── SessionProvider          ← populates useAuthStore on mount
    └── StoreProvider
        └── (private) layout
            └── (org) layout  ← useSession() for user display
                └── [feature pages]
```

Auth pages (`/login`, `/register`, etc.) sit outside the session-requiring layout.
`proxy.ts` handles all redirects.
