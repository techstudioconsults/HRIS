---
section: api
topic: endpoints
version: 2.0
updated: 2026-04-26
---

# Auth — API Reference

> **v2 — Custom Session (ADR-002)**
> NextAuth removed. Session is managed via BFF Route Handlers.
> Field name fix: `accessToken` and `refreshToken` are always singular.

---

## Backend Endpoints (External — HR Backend API)

Base: `/auth/*` — no versioning prefix. All are public (no `Authorization` required).

---

### POST /auth/onboard

Register a new company and owner account.

**Request Body**

| Field             | Type   | Validation                                    | Required |
| ----------------- | ------ | --------------------------------------------- | -------- |
| `companyName`     | string | min:2, max:100                                | ✅       |
| `domain`          | string | valid domain, unique                          | ✅       |
| `firstName`       | string | min:2, max:100                                | ✅       |
| `lastName`        | string | min:2, max:100                                | ✅       |
| `email`           | string | valid email, unique                           | ✅       |
| `password`        | string | uppercase + lowercase + number + special char | ✅       |
| `confirmPassword` | string | must match `password`                         | ✅       |

**Response 201**

```json
{ "success": true, "data": "company registered successfully" }
```

**Error Responses**

| Status | Scenario                           |
| ------ | ---------------------------------- |
| `400`  | Bad request / validation error     |
| `409`  | Email or domain already registered |
| `422`  | Field-level validation failure     |
| `500`  | Server error                       |

---

### POST /auth/login/password

Password-based login. Returns employee profile, JWT pair, and permissions.

**Request Body**

| Field      | Type   | Validation                                    | Required |
| ---------- | ------ | --------------------------------------------- | -------- |
| `email`    | string | valid email                                   | ✅       |
| `password` | string | uppercase + lowercase + number + special char | ✅       |

**Response 200**

```json
{
  "success": true,
  "data": {
    "employee": {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "role": { "id": "string", "name": "string" }
    },
    "tokens": {
      "accessToken": "string",
      "refreshToken": "string"
    },
    "permissions": ["string"]
  }
}
```

> Note: field is `accessToken` (singular) — the Sprint 1 doc had a typo `accessTokens`.

**Error Responses**

| Status | Scenario                 |
| ------ | ------------------------ |
| `400`  | Validation error         |
| `401`  | Invalid credentials      |
| `429`  | Too many failed attempts |
| `500`  | Server error             |

---

### POST /auth/login/requestotp

Request an OTP sent to the user's email.

**Request Body**

| Field   | Type                 | Required |
| ------- | -------------------- | -------- |
| `email` | string (valid email) | ✅       |

**Response 200**

```json
{ "success": true, "data": "OTP sent successfully" }
```

**Error Responses**: `400 · 422 · 500`

---

### POST /auth/login/otp

Verify OTP and obtain tokens. Response shape is identical to `/auth/login/password`.

**Request Body**

| Field      | Type   | Validation   | Required |
| ---------- | ------ | ------------ | -------- |
| `email`    | string | valid email  | ✅       |
| `password` | string | 6-digit code | ✅       |

> The OTP code is sent in the `password` field — this is the backend's field name.

**Response 200** — same shape as `POST /auth/login/password`

**Error Responses**

| Status | Scenario               |
| ------ | ---------------------- |
| `400`  | OTP expired or invalid |
| `429`  | Too many OTP attempts  |
| `500`  | Server error           |

---

### POST /auth/forgotpassword

Dispatch a password reset email.

**Request Body**

| Field   | Type                 | Required |
| ------- | -------------------- | -------- |
| `email` | string (valid email) | ✅       |

**Response 200**

```json
{ "success": true, "data": "Password link sent successfully" }
```

> Always returns 200 regardless of whether the email exists — prevents email enumeration.

**Error Responses**: `400 · 422 · 500`

---

### POST /auth/resetpassword

Set a new password using the reset token from the email link.

**Request Body**

| Field             | Type   | Validation                                    | Required |
| ----------------- | ------ | --------------------------------------------- | -------- |
| `password`        | string | uppercase + lowercase + number + special char | ✅       |
| `confirmPassword` | string | must match `password`                         | ✅       |
| `token`           | string | token from reset URL                          | ✅       |

**Response 200**

```json
{ "success": true, "data": "Password successfully reset" }
```

**Error Responses**

| Status | Scenario                      |
| ------ | ----------------------------- |
| `400`  | Token expired or already used |
| `422`  | Passwords do not match        |
| `500`  | Server error                  |

---

### POST /auth/refresh

Rotate the access token using the refresh token.

**Request Body**

| Field          | Type   | Validation  | Required |
| -------------- | ------ | ----------- | -------- |
| `refreshToken` | string | UUID string | ✅       |

**Response 200**

```json
{
  "success": true,
  "data": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

> Note: field is `accessToken` (singular) — the Sprint 1 doc had a typo `accessTokens`.

**Error Responses**

| Status | Scenario                         |
| ------ | -------------------------------- |
| `401`  | Refresh token expired or invalid |
| `500`  | Server error                     |

---

## BFF Route Handlers (Internal — Next.js)

These are **not** backend endpoints. They run inside the Next.js app and manage
the HTTP-only session cookies on behalf of the client.

---

### POST /api/auth/session

Set session cookies after a successful login. Called by the auth views after
`/auth/login/password` or `/auth/login/otp` returns successfully.

**Request Body**

```ts
{
  employee: { id: string; fullName: string; email: string; role: { id: string; name: string } };
  tokens: { accessToken: string; refreshToken: string };
  permissions: string[];
}
```

**Action**: Sets three HTTP-only cookies:

- `__hris_at` — access token
- `__hris_rt` — refresh token (Path=/api/auth)
- `__hris_meta` — HMAC-signed `{ id, role, permissions, exp }`

**Response 200**

```json
{ "ok": true }
```

---

### GET /api/auth/token

Returns the current access token for the client-side TokenManager.

**Action**: Reads `__hris_at` cookie server-side.

**Response 200**

```json
{ "accessToken": "string", "expiresAt": 1714000000000 }
```

**Response 401** — no cookie present

```json
{ "error": "unauthenticated" }
```

---

### DELETE /api/auth/session

Logout — clear all session cookies.

**Action**: Clears `__hris_at`, `__hris_rt`, `__hris_meta`.

**Response 200**

```json
{ "ok": true }
```

---

### POST /api/auth/refresh

Server-side token rotation. Called by the TokenManager when a 401 is received.

**Action**:

1. Reads `__hris_rt` cookie
2. Calls `POST /auth/refresh` on the backend with `{ refreshToken }`
3. On success: sets new `__hris_at`, `__hris_rt`, `__hris_meta` cookies
4. Returns `{ accessToken, expiresAt }` to the caller

**Response 200**

```json
{ "accessToken": "string", "expiresAt": 1714000000000 }
```

**Response 401** — refresh token expired or invalid

```json
{ "error": "session_expired" }
```

> On 401, the caller (httpConfig.ts) will call `DELETE /api/auth/session` and
> redirect to `/login`.
