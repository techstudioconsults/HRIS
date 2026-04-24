---
section: security
topic: data-exposure
---

# Admin Teams — Data Exposure Controls

## Data in Scope

| Field                    | Classification | Exposure Rule                                |
| ------------------------ | -------------- | -------------------------------------------- |
| Employee name            | PII            | Visible in member list; omit from error logs |
| Employee number          | Internal ID    | Safe to log                                  |
| Team name                | Org-internal   | Safe to log                                  |
| Custom permissions array | Auth-sensitive | Log only at debug level                      |
| JWT sub / organisationId | Auth           | Debug level only                             |

## Frontend Controls

- The team roster export is triggered as a blob download — the CSV is never held in React state.
- Custom permissions for a member are only shown on the assignment form — not stored in the Zustand store after the workflow completes.
- `multipart/form-data` requests include only the fields the user has filled — no extra metadata.

## Network Controls

- All teams API calls are HTTPS only.
- No team data is written to `localStorage` or `sessionStorage`.
- TanStack Query cache is cleared on `signOut`.

## organisationId Scoping

Backend derives `organisationId` from JWT. The frontend never passes `organisationId` as a query param, preventing horizontal privilege escalation.
