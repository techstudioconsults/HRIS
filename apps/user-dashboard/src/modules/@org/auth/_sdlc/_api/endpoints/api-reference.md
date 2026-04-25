---
section: api
topic: endpoints
---

# Auth — API Reference

Base: no versioned prefix — `/auth/*` (differs from other modules which use `/api/v1/`)

Public endpoints — no `Authorization` header required unless noted.

---

## POST /auth/onboard

Register a new company and owner account.

**Request Body**

```json
{
  "companyName": "Acme Corp",
  "domain": "acme",
  "firstName": "Amara",
  "lastName": "Okafor",
  "email": "amara@acme.com",
  "password": "SecurePass123!"
}
```

**Response 201**

```json
{ "success": true, "data": "created" }
```

**Error Responses**

| Status | Scenario                                |
| ------ | --------------------------------------- |
| `409`  | Email or domain already registered      |
| `422`  | Validation failure (field-level errors) |

---

## POST /auth/login/password

Called by NextAuth's credentials provider — not directly from client.

**Request Body**

```json
{ "email": "amara@acme.com", "password": "SecurePass123!" }
```

**Response 200**

```json
{
  "employee": {
    "id": "emp_01",
    "firstName": "Amara",
    "lastName": "Okafor",
    "email": "amara@acme.com",
    "role": "owner",
    "fullName": "Amara Okafor",
    "createdAt": "...",
    "updatedAt": "..."
  },
  "tokens": { "accessToken": "eyJ...", "refreshToken": "eyJ..." },
  "permissions": ["admin:admin"]
}
```

**Error Responses**

| Status | Scenario                 |
| ------ | ------------------------ |
| `401`  | Invalid credentials      |
| `429`  | Too many failed attempts |

---

## POST /auth/login/requestotp

Request an OTP sent to the user's email.

**Request Body**

```json
{ "email": "amara@acme.com" }
```

**Response 200**

```json
{ "success": true, "data": "OTP sent" }
```

---

## POST /auth/login/otp

Verify OTP and obtain a session.

**Request Body**

```json
{ "email": "amara@acme.com", "otp": "123456" }
```

**Response 200** — same shape as `/auth/login/password`

**Error Responses**

| Status | Scenario               |
| ------ | ---------------------- |
| `400`  | OTP expired or invalid |
| `429`  | Too many OTP attempts  |

---

## POST /auth/forgotpassword

Dispatch a password reset email.

**Request Body**

```json
{ "email": "amara@acme.com" }
```

**Response 200**

```json
{ "success": true, "data": "Reset email sent" }
```

> Always returns 200 regardless of whether the email exists — prevents email enumeration.

---

## POST /auth/resetpassword

Set a new password using the reset token from the email link.

**Request Body**

```json
{
  "password": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!",
  "token": "<reset-token>"
}
```

**Response 200**

```json
{ "success": true, "data": "Password reset" }
```

**Error Responses**

| Status | Scenario                      |
| ------ | ----------------------------- |
| `400`  | Token expired or already used |
| `422`  | Passwords do not match        |
