---
section: domain
topic: entities
---

# Auth — Domain Entities

## User

The authenticated employee as known to the auth domain.

```typescript
interface User {
  id: string; // Employee UUID
  firstName: string;
  lastName: string;
  fullName: string; // Derived: firstName + lastName
  email: string;
  role: string; // Role name: "owner" | "hr_manager" | "welfare_officer" | "employee"
  createdAt: string; // ISO 8601
  updatedAt: string;
}
```

## Tokens

The token pair issued on successful authentication.

```typescript
interface Tokens {
  accessToken: string; // Short-lived JWT — sent as Bearer on every API call
  refreshToken: string; // Long-lived token — used by tokenManager to renew accessToken
}
```

## AuthResponseData

The payload returned by the backend on successful login or OTP verify.

```typescript
interface AuthResponseData {
  user: User;
  tokens: Tokens;
  permissions: string[]; // e.g. ["payroll:read", "employee:manage", "admin:admin"]
}
```

## Session (NextAuth JWT)

What NextAuth stores in the HTTP-only cookie and exposes via `useSession()`.

```typescript
interface Session {
  id: string;
  employee: User;
  tokens: Tokens;
  permissions: string[];
  expires: string; // ISO 8601
}
```

## RegisterPayload

What the register form sends to `/auth/onboard`.

```typescript
interface RegisterPayload {
  companyName: string;
  domain: string; // Unique company subdomain
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
```

## Password Reset

```typescript
interface ForgotPasswordPayload {
  email: string;
}
interface ResetPasswordPayload {
  password: string;
  confirmPassword: string;
  token: string;
}
```

## OTP Request

```typescript
interface OtpRequestPayload {
  email: string;
}
interface OtpVerifyPayload {
  email: string;
  otp: string;
}
```

## Role Enum (from `lib/auth-types.ts`)

```typescript
enum Role {
  OWNER = 'owner',
  HR_MANAGER = 'hr_manager',
  WELFARE_OFFICER = 'welfare_officer',
  EMPLOYEE = 'employee',
}
```

## Permission Format

Permissions follow the pattern `{module}:{action}`:

```
payroll:read    payroll:create  payroll:edit    payroll:delete  payroll:manage
leave:read      leave:create    leave:edit      leave:delete    leave:manage
employee:read   employee:create employee:edit   employee:delete employee:manage
attendance:*    company:*       teams:*
admin:admin     (superuser — grants all access)
```
