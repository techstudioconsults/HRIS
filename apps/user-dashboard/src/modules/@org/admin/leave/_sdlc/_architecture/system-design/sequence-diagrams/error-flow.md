# Leave Management — Error Flow Sequence Diagram

_How errors are surfaced from the API through to the user interface without leaking internal details._

## API Error Flow (Query)

```
useLeaveRequests                HttpAdapter           Backend API           ErrorBoundary / UI
      |                              |                     |                       |
      |── GET /leave/requests ──────→|                     |                       |
      |                              |── fetch ───────────→|                       |
      |                              |←─ 500 Internal ─────|                       |
      |                              |                     |                       |
      |  HttpAdapter throws ApiError |                     |                       |
      |  { status: 500,              |                     |                       |
      |    message: 'safe message',  |                     |                       |
      |    code: 'INTERNAL_ERROR' }  |                     |                       |
      |                              |                     |                       |
      | TanStack Query retries (×2)  |                     |                       |
      | backoff: 1s, 2s              |                     |                       |
      |                              |── fetch ───────────→|                       |
      |                              |←─ 500 again ────────|                       |
      |                              |                     |                       |
      | isError = true               |                     |                       |
      |──────────────────────────────────────────────────────────────────────────→|
      |                              |                     |  LeaveRequestsError   |
      |                              |                     |  Banner renders with  |
      |                              |                     |  "safe message" text  |
      |                              |                     |  + Retry button        |
```

## API Error Flow (Mutation — approve/decline)

```
useApproveLeaveRequest       HttpAdapter             Backend API         Toast / UI
        |                         |                       |                  |
        |── PATCH /approve ───────→|                      |                  |
        |                         |── fetch ─────────────→|                  |
        |                         |←─ 422 Unprocessable ──|                  |
        |                         |   { detail: 'Leave request is already   |
        |                         |     approved by another admin' }         |
        |  onError callback        |                       |                  |
        |  rollback optimistic update                       |                  |
        |──────────────────────────────────────────────────────────────────→|
        |                         |                       |  Error toast:    |
        |                         |                       |  "Leave request  |
        |                         |                       |  is already      |
        |                         |                       |  approved"       |
```

## Leave Type Form Validation Error (Client-Side)

```
Admin                LeaveTypeForm (RHF + Zod)                UI
  |                          |                                 |
  |── submit empty form ────→|                                 |
  |                          |── Zod validates                 |
  |                          |   name: required                |
  |                          |   allowanceDays: min(1)         |
  |                          |   cycle: required enum          |
  |                          |── validation fails              |
  |                          |   no API call made              |
  |←─ inline field errors ───|─────────────────────────────────|
  |   "Leave type name is required"
  |   "Allowance must be at least 1 day"
```

## Error Display Rules

- Query errors: inline error banner with retry button — never a full-page crash.
- Mutation errors: toast notification with the human-readable `detail` or `message` from the RFC 7807 response.
- Form errors: inline field-level messages from Zod; no API call is made until client-side validation passes.
- Never display stack traces, internal server paths, or database error messages to the user.
