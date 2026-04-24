# Admin Employee Module — API Error Handling

_Error codes, HTTP status mapping, and UI response rules for the employee module._

## Error Response Shape

All errors follow RFC 7807 Problem Details:

```json
{
  "type": "https://hris.example.com/errors/<error-slug>",
  "title": "Human-readable title",
  "status": 422,
  "detail": "Sentence describing what went wrong.",
  "errors": [
    {
      "field": "email",
      "code": "DUPLICATE_EMAIL",
      "message": "Already in use."
    }
  ]
}
```

`errors[]` is present only for validation and business-rule errors with field-level attribution.

---

## Error Code Registry

| HTTP Status | Code                     | Trigger                                               | UI Behaviour                                                             |
| ----------- | ------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| `400`       | `VALIDATION_ERROR`       | Request body fails schema validation                  | Map each `errors[].field` to its form field; show inline error           |
| `401`       | `UNAUTHENTICATED`        | Session expired                                       | Response interceptor → sign out + redirect to `/login`                   |
| `403`       | `FORBIDDEN`              | User lacks ADMIN or HR_MANAGER role                   | Show page-level "You don't have permission" banner                       |
| `404`       | `NOT_FOUND`              | Employee / document ID does not exist                 | Show inline not-found state on the profile page                          |
| `409`       | `DUPLICATE_EMAIL`        | `POST /employees` — email already taken               | Map to `email` form field: "An employee with this email already exists." |
| `422`       | `INVALID_TRANSITION`     | Status change not allowed by state machine            | Toast: "Cannot change status from X to Y."                               |
| `422`       | `INVALID_EFFECTIVE_DATE` | Effective date is in the past for certain transitions | Map to `effectiveDate` field: "Effective date cannot be in the past."    |
| `413`       | `FILE_TOO_LARGE`         | Document upload > 10 MB                               | Show under upload button: "File must be under 10 MB."                    |
| `415`       | `UNSUPPORTED_FILE_TYPE`  | Non-PDF/image uploaded                                | Show under upload button: "Only PDF, JPG, and PNG are accepted."         |
| `500`       | `INTERNAL_ERROR`         | Unexpected server error                               | Toast: "Something went wrong. Please try again." + Retry button on list  |

---

## Error Handling Rules

1. **Form field errors** — when `errors[].field` is present, set the error on that field via React Hook Form's `setError`; never show a top-level alert for correctable field errors.
2. **Duplicate email** — detected via `409`; mapped to the `email` field so the admin can correct it without re-filling the form.
3. **Invalid status transitions** — shown as a toast, not a field error (the status picker was already validated client-side; this is a server-side guard).
4. **Document upload errors** — shown inline beneath the upload button, not in a toast; the admin must be able to see the error while still looking at the upload area.
5. **List and profile load errors** — rendered as an in-page error state with a Retry button; never a full-page redirect.
6. **Optimistic update rollback** — on any mutation error, revert the optimistic state via `onError` handler and show a descriptive toast.
7. **Network errors** — TanStack Query's `retry: 2` handles transient failures; after 2 retries the `isError` state is set and the above rules apply.
