---
section: api
topic: error-handling
---

# Auth — API Error Handling

## Error Shape (RFC 7807)

```json
{
  "type": "https://hris.example.com/errors/<code>",
  "title": "Human readable title",
  "status": 401,
  "detail": "Optional detail"
}
```

## Error Matrix

| Status | Scenario                 | UI Behaviour                                                                          |
| ------ | ------------------------ | ------------------------------------------------------------------------------------- |
| `400`  | OTP expired / invalid    | Field error: "Your code has expired. Request a new one."                              |
| `400`  | Reset token expired      | Root error: "This link has expired. Request a new one from the forgot password page." |
| `401`  | Invalid credentials      | Root error: "Invalid email or password."                                              |
| `409`  | Email already registered | Field error on `email`: "An account with this email already exists."                  |
| `409`  | Domain already taken     | Field error on `domain`: "This domain is already in use."                             |
| `422`  | Validation failure       | Map `errors[].field` to `form.setError(field, message)`                               |
| `429`  | Rate limited             | Root error: "Too many attempts. Please try again in 15 minutes."                      |
| `500`  | Server error             | Root error: "Something went wrong. Please try again."                                 |

## Special Cases

### Email Enumeration Prevention

`POST /auth/forgotpassword` always returns 200, even for unknown emails. The UI always shows `CheckMailCard` — never confirms whether the email exists. Do not add client-side logic that varies the response based on the email.

### NextAuth signIn Error Mapping

NextAuth wraps backend errors in `{ ok: false, error: string }`. The `error` string is the backend's `title` field. Map it in the `onSubmit` handler:

```typescript
const result = await signIn('credentials', {
  email,
  password,
  redirect: false,
});
if (!result?.ok) {
  form.setError('root', { message: result?.error ?? 'Login failed.' });
}
```

## Retry Policy

Auth mutations do NOT retry on failure. All are user-initiated actions — surface the error immediately and let the user decide to retry. No TanStack Query retry configuration needed.
