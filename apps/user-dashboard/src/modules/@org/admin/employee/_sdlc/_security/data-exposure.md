# Admin Employee Module — Data Exposure Controls

_Rules governing what employee data is exposed and how sensitive fields are protected._

## PII Classification

| Field                          | Sensitivity               | Exposure Rule                                                                                      |
| ------------------------------ | ------------------------- | -------------------------------------------------------------------------------------------------- |
| `nationalId` (NIN)             | High — PII                | Masked as `NIN-••••••••XX` in all list views; full value shown only on profile page for ADMIN role |
| `bankVerificationNumber` (BVN) | High — PII                | Never shown in the frontend; backend returns masked value only                                     |
| `dateOfBirth`                  | Medium — PII              | Not shown in list view; shown on profile page for ADMIN and HR_MANAGER                             |
| `phone`                        | Medium — PII              | Not shown in list view; shown on profile page                                                      |
| `email`                        | Low — PII                 | Shown in list view (required for identification)                                                   |
| `avatarUrl`                    | Low                       | Public-safe; shown in list and profile                                                             |
| `employeeNumber`               | None                      | Public-safe within the org                                                                         |
| `salary / bankDetails`         | High — not in this module | Not exposed by the employee module; owned by payroll context                                       |

## List View Masking

The `EmployeeListItem` type (used in the table) intentionally excludes:

- `nationalId`
- `bankVerificationNumber`
- `dateOfBirth`
- `phone`

These fields are only fetched on the individual profile view (`GET /employees/:id`).

## Document Download URLs

Document `url` fields contain short-lived signed URLs (typically 15 minutes). The frontend does not store or cache these URLs — they are fetched fresh on demand when the user opens the documents tab.

## Audit Trail Access

The audit trail (`GET /employees/:id/audit`) exposes `before`/`after` field snapshots. The backend must not include PII field values in audit log `before`/`after` snapshots — only field names and non-sensitive values.

## Transport Security

- All API calls are HTTPS; no mixed-content allowed.
- Multipart document uploads must also be over HTTPS.
- `Content-Security-Policy` headers are set at the Next.js middleware level.

## Data Retention

Terminated employee records are retained for the period required by Nigerian labour law. The frontend does not expose a delete-employee action — only `TERMINATED` status is supported as the end state.
