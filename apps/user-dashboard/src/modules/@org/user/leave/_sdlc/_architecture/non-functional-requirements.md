# User Leave — Non-Functional Requirements

_Quality attributes and constraints for the employee leave module._

## Performance

- Leave request history list renders within 300 ms from cache (TanStack Query stale-while-revalidate).
- Form submission response (POST round-trip) must complete within 2 s under normal conditions.
- Document uploads are limited to 5 MB to prevent slow submissions.

## Accessibility

- The leave request form is fully keyboard-accessible.
- Date pickers expose `aria-label` attributes for start and end date fields.
- Modal dialogs trap focus while open and return focus to the trigger element on close.
- Status badges use both colour and text to convey request status (no colour-only indication).
- Error messages from Zod validation are announced to screen readers via `aria-live` regions.

## Security

- An employee can only view, create, and edit their own leave requests.
- The backend enforces employee-scoped queries — the frontend must not pass other employees' IDs.
- File uploads must be validated on the backend (type, size, virus scan where applicable).
- The `rejectionReason` field is read-only for employees; it cannot be set by them.

## Reliability

- If the leave types API is unavailable, the form shows a graceful error and disables submission rather than allowing a request with an empty leave type.
- Failed submissions do not close the form; the employee can retry without re-entering data.

## Validation

- All form fields are validated client-side via `requestLeaveSchema` (Zod) before any API call is made.
- The backend also validates all inputs — the frontend validation is UX-first, not a security measure.
