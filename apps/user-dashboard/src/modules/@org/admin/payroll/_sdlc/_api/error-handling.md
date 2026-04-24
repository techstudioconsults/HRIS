# Admin Payroll — API Error Handling

| Status | Code                   | UI Behaviour                                                         |
| ------ | ---------------------- | -------------------------------------------------------------------- |
| `409`  | `RUN_ALREADY_EXISTS`   | Toast: "A payroll run for this period already exists."               |
| `402`  | `INSUFFICIENT_BALANCE` | Blocking dialog: shows shortfall + "Fund Wallet" link                |
| `409`  | `RUN_NOT_APPROVABLE`   | Toast: "Run must be completed before approval."                      |
| `403`  | `RUN_LOCKED`           | Toast: "Adjustments cannot be made to an approved run."              |
| `422`  | `EXCEEDS_GROSS`        | Map to `amount` field: "Deduction cannot exceed employee gross pay." |
| `400`  | `VALIDATION_ERROR`     | Inline form errors per field                                         |
| `401`  | `UNAUTHENTICATED`      | Interceptor → sign out + redirect                                    |
| `500`  | `INTERNAL_ERROR`       | Toast: "Something went wrong. Please try again."                     |

## Adjustment Form Rules

- Client-side Zod validation catches empty label, zero/negative amount before any API call.
- Backend `EXCEEDS_GROSS` error is mapped to the `amount` field via React Hook Form `setError`.

## SSE Error Handling

- `EventSource.onerror` triggers reconnect logic (max 3 attempts with 3s backoff).
- After 3 failed reconnects: show banner "Lost connection to payroll progress. Please refresh."
- SSE `type: 'error'` event (application-level) shows error toast and closes the SSE connection.
