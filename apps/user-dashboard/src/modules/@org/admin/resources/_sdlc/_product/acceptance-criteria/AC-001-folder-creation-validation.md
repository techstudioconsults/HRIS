# AC-001 — Folder Creation Validation

_Defines the precise validation rules that must pass before a folder creation request is submitted to the API._

## Validation Rules

### Client-Side (Zod schema, enforced before API call)

| Rule                  | Condition                | Error Message                                  |
| --------------------- | ------------------------ | ---------------------------------------------- |
| Name required         | `name.trim().length > 0` | "Folder name is required."                     |
| Max length            | `name.length <= 100`     | "Folder name must be 100 characters or fewer." |
| No path separators    | `!/[/\\]/.test(name)`    | "Folder name cannot contain `/` or `\`."       |
| No control characters | `/^[\x20-\x7E -￿]+$/`    | "Folder name contains invalid characters."     |

### Server-Side (enforced by API)

| Rule                             | HTTP Status     | Response                                                                  |
| -------------------------------- | --------------- | ------------------------------------------------------------------------- |
| Unique name within parent        | `409 Conflict`  | `{ status: "error", message: "A folder with this name already exists." }` |
| Parent folder exists             | `404 Not Found` | `{ status: "error", message: "Parent folder not found." }`                |
| User has `admin:resources:write` | `403 Forbidden` | `{ status: "error", message: "Insufficient permissions." }`               |

## UI Behaviour

- Validation errors appear as inline messages beneath the input field, not as toast notifications.
- The submit button is disabled while the form has unresolved validation errors.
- On a `409` response from the API, the error is mapped back to the name input field (not a generic toast).

## Test Scenarios

- Given name is blank → submit button disabled, inline error shown.
- Given name is 101 characters → inline error shown before API call.
- Given name is "HR/Policies" → inline error shown before API call.
- Given a duplicate name at root level → API returns 409 → inline error appears on name field.
- Given a valid unique name → folder is created, FolderCard appears, success toast shown.
