---
section: api
topic: error-handling
---

# User Payslip — API Error Handling

## Error Shape (RFC 7807)

```json
{
  "type": "https://hris.example.com/errors/<error-code>",
  "title": "Human readable title",
  "status": 404,
  "detail": "Optional detail message"
}
```

## Error Matrix

| Status | Error Code          | Title                 | UI Behaviour                                                                      |
| ------ | ------------------- | --------------------- | --------------------------------------------------------------------------------- |
| `401`  | `unauthorized`      | Unauthorized          | Interceptor: refresh token → retry. On second 401: signOut + redirect to `/login` |
| `403`  | `forbidden`         | Forbidden             | This should not occur (backend scopes to JWT). If it does: toast "Access denied." |
| `404`  | `payslip-not-found` | Payslip Not Found     | Detail fetch: toast "Payslip not found."; modal does not open                     |
| `404`  | `payslip-not-found` | Payslip Not Found     | Download: toast "Payslip not found."                                              |
| `500`  | `server-error`      | Internal Server Error | Toast "Something went wrong. Please try again."                                   |

## Retry Policy

| Operation    | Retries                    | Retry Condition                                     |
| ------------ | -------------------------- | --------------------------------------------------- |
| List fetch   | 2 (TanStack Query default) | Network errors only; not on 4xx                     |
| Detail fetch | 2                          | Network errors only                                 |
| PDF download | 0                          | User-initiated; show error toast and let user retry |

## 401 Handling Detail

The `HttpAdapter` interceptor handles 401 globally. This module does not need special 401 handling — the interceptor will either refresh and retry transparently, or sign the user out and redirect.

The `_retried` flag on the Axios request config prevents the interceptor from creating an infinite refresh loop.
