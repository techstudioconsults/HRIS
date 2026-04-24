# Settings Module — Data Exposure Controls

## Sensitive Data Inventory

| Field                               | Sensitivity               | Exposure Rule                                                            |
| ----------------------------------- | ------------------------- | ------------------------------------------------------------------------ |
| `passwordPolicy` (SecuritySettings) | Medium                    | Only shown to ADMIN; never exposed to HR_MANAGER or Employee             |
| `enforce2FA`                        | Medium                    | Only shown to ADMIN                                                      |
| `deductions[].value`                | Medium — financial config | Only shown to ADMIN; never in employee-facing API responses              |
| `registrationNumber`                | Low-Medium — org identity | Only shown to ADMIN in Settings; not exposed in employee-facing contexts |
| `logoUrl`                           | None                      | Public-safe; used in email templates and login page                      |
| `organisationId`                    | None in itself            | Internal only; never displayed to the user                               |

## Logo Upload Security

- Logo files are validated for MIME type (PNG/JPG only) and size (max 2 MB) client-side AND server-side.
- Uploaded logos are stored in a private object storage bucket; served via a CDN with public read for the URL path.
- No executable file types are accepted.
- The stored file name is generated server-side (UUID-based) to prevent path traversal or filename injection.

## Permission Scopes Display

The `PermissionScope` strings shown in the Role Editor are human-readable labels. The raw scope strings (e.g., `admin:resources:write`) are sent to the API but not shown in plaintext to the admin — they are represented as labelled checkboxes in the UI.

## Audit Trail

Every settings mutation records `updatedBy` (user ID) and `updatedAt`. The settings API does not expose the audit history in its response — a separate audit log endpoint is the source of truth for compliance reporting.
