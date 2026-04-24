# Resources Module — API Error Handling

_Defines how each API error scenario is caught, mapped, and presented to the user._

## Error Response Shape

All errors follow the project-wide RFC 7807-style envelope:

```json
{
  "status": "error",
  "message": "Human-readable description",
  "errors": [{ "field": "name", "message": "Folder name is required." }],
  "timestamp": "2026-04-23T10:00:00Z"
}
```

## Error Mapping Table

| HTTP Status                  | Scenario                                                  | UI Response                                                                        |
| ---------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `400 Bad Request`            | Invalid payload (malformed JSON, missing required fields) | Toast error: "Invalid request. Please check your input."                           |
| `401 Unauthorized`           | Expired or missing JWT                                    | Redirect to `/login?returnTo=/admin/resources`; session expiry toast               |
| `403 Forbidden`              | User lacks `admin:resources:write` permission             | Toast error: "You do not have permission to perform this action."                  |
| `404 Not Found`              | Parent folder deleted between page load and create        | Toast error: "The folder no longer exists. Refreshing…"; then `invalidateQueries`  |
| `409 Conflict`               | Duplicate folder name within parent                       | Inline RHF field error: "A folder with this name already exists in this location." |
| `413 Payload Too Large`      | File upload exceeds size limit                            | Per-file error in dropzone: "File exceeds the 25 MB upload limit."                 |
| `415 Unsupported Media Type` | File MIME type not in allowlist                           | Per-file error in dropzone: "This file type is not supported."                     |
| `500 Internal Server Error`  | Unexpected backend failure                                | Toast error: "Something went wrong on our end. Please try again."                  |

## Retry Logic

- File uploads: user-initiated retry (retry button per failed file, no automatic retry).
- Read queries: TanStack Query automatic retry (3 attempts, exponential backoff) — disabled for 4xx errors.
- Mutations: no automatic retry; user must re-trigger.

## Error Logging

All `4xx` and `5xx` responses from the Resources API are logged client-side via the structured logger with `folderId`, `fileId`, and `userId` context — never raw file contents or personal data.
