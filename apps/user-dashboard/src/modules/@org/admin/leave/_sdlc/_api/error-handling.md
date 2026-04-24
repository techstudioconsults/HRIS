# Leave Management — API Error Handling

_How the leave module handles and surfaces API errors to the user._

## Error Response Shape (RFC 7807)

All errors from the HRIS backend follow the RFC 7807 Problem Detail format:

```json
{
  "status": "error",
  "message": "Leave request not found",
  "errors": [
    {
      "type": "https://hris.example.com/errors/not-found",
      "title": "Not Found",
      "status": 404,
      "detail": "Leave request lr-999 does not exist",
      "instance": "/api/v1/leave/requests/lr-999"
    }
  ],
  "timestamp": "2026-04-23T10:00:00.000Z"
}
```

## HTTP Status Code Mapping

| Status | Scenario                                           | Frontend Behaviour                                                |
| ------ | -------------------------------------------------- | ----------------------------------------------------------------- |
| `400`  | Invalid query params or malformed request body     | Inline form validation error or query error banner                |
| `401`  | JWT expired or missing                             | Middleware redirects to `/login`; not caught at module level      |
| `403`  | User lacks `LEAVE_ADMIN` role                      | Error banner: "You do not have permission to perform this action" |
| `404`  | Leave request or leave type not found              | Error state in drawer: "This request no longer exists"            |
| `409`  | Request already approved/declined by another admin | Error toast: "This request has already been actioned"             |
| `422`  | Business rule violation (e.g. exceed allowance)    | Inline error in form or toast with the `detail` message           |
| `429`  | Rate limited                                       | Toast: "Too many requests, please try again in a moment"          |
| `500`  | Internal server error                              | Error banner with retry button; no internal details shown         |

## Retry Strategy

- TanStack Query retries queries up to **2 times** with exponential backoff (1s, 2s) on network errors or 5xx responses.
- Mutations are **not** retried automatically — the admin must manually re-trigger approve/decline to avoid accidental double-actions.
- On retry exhaustion, `isError: true` is surfaced and the appropriate UI error state renders.

## Error Display Patterns

| Scenario                          | Component                  | UX Pattern                                         |
| --------------------------------- | -------------------------- | -------------------------------------------------- |
| Leave requests list fails to load | `LeaveRequestTable`        | Inline error banner with "Retry" button            |
| Approve/decline mutation fails    | `LeaveRequestDetailDrawer` | Toast notification; drawer stays open for retry    |
| Leave type save fails             | `LeaveTypeFormDrawer`      | Toast notification; form data preserved            |
| Leave policy save fails           | `LeavePolicyForm`          | Toast notification; form data preserved            |
| Client-side validation fails      | Any form                   | Inline field-level error messages under each input |

## Security Note

The `detail` field from RFC 7807 responses is safe to display to users when it comes from the backend's controlled error vocabulary. Raw exception messages, database errors, or stack traces must never reach the frontend — this is enforced at the backend exception filter layer.
