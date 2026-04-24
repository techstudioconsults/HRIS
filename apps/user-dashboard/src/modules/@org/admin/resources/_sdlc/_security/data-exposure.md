# Resources Module — Data Exposure Analysis

_Identifies data handled by this module and the risk level of each field._

## Data Inventory

| Field            | Entity           | Sensitivity | Exposure                                                                             |
| ---------------- | ---------------- | ----------- | ------------------------------------------------------------------------------------ |
| Folder name      | `ResourceFolder` | Low         | Displayed in UI; included in API responses                                           |
| File name        | `ResourceFile`   | Low–Medium  | May reveal employee names in contract files (e.g., "John-Smith-Contract.pdf")        |
| `storageKey`     | `ResourceFile`   | High        | NEVER returned to frontend; internal backend field only                              |
| `downloadUrl`    | `ResourceFile`   | Medium      | Pre-signed URL with short TTL; must not be cached or logged                          |
| `createdBy`      | Both             | Medium      | User ID (UUID) — not a name; safe to expose within organisation scope                |
| `organisationId` | Both             | Medium      | Scoped to the authenticated org; validated server-side on every request              |
| File contents    | `ResourceFile`   | Variable    | Not served through the API — fetched directly from object storage via pre-signed URL |

## Risks and Mitigations

- **Risk**: File names embedded in Employment Contracts folder may expose employee names.
  **Mitigation**: File names are only visible to users with `admin:resources:read` — employees cannot see this module.

- **Risk**: Pre-signed download URL leakage via browser history or referrer header.
  **Mitigation**: TTL of 5 minutes; HTTPS-only; referrer policy set to `strict-origin`.

- **Risk**: Unbounded file size could cause denial-of-service on upload endpoints.
  **Mitigation**: 25 MB server-side limit; client-side pre-check for immediate feedback.

- **Risk**: Insecure Direct Object Reference (IDOR) — accessing another org's folder/file by guessing UUID.
  **Mitigation**: All queries are filtered by `organisationId` extracted from the JWT, not from the request body.
