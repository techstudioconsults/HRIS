# Settings Module — API Error Handling

## Error Code Registry

| HTTP Status | Code                    | Trigger                              | UI Behaviour                                                      |
| ----------- | ----------------------- | ------------------------------------ | ----------------------------------------------------------------- |
| `400`       | `VALIDATION_ERROR`      | Request body fails schema            | Map `errors[].field` to form fields; show inline errors           |
| `401`       | `UNAUTHENTICATED`       | Session expired                      | Interceptor → sign out + redirect to `/login`                     |
| `403`       | `FORBIDDEN`             | Insufficient role                    | Page-level "You don't have permission" banner                     |
| `403`       | `SYSTEM_ROLE_IMMUTABLE` | Attempt to edit/delete a system role | Toast: "System roles cannot be modified."                         |
| `409`       | `DUPLICATE_ROLE_NAME`   | Role name already exists             | Map to `name` field: "A role with this name already exists."      |
| `409`       | `ROLE_IN_USE`           | Delete role assigned to employees    | Toast: "Cannot delete — this role is assigned to employees."      |
| `413`       | `FILE_TOO_LARGE`        | Logo > 2 MB                          | Show under upload: "Logo must be smaller than 2 MB."              |
| `415`       | `UNSUPPORTED_FILE_TYPE` | Logo not PNG/JPG                     | Show under upload: "Logo must be a PNG or JPG image."             |
| `500`       | `INTERNAL_ERROR`        | Unexpected server error              | Toast: "Failed to save — please try again." Form values retained. |

## General Rules

1. Form field errors go inline below the field — never as a top-level alert.
2. Tab-level save errors show a toast; form values are always preserved on error.
3. Logo upload errors show inline beneath the upload control, not in a toast.
4. Role CRUD errors that are business-rule violations (ROLE_IN_USE, DUPLICATE_ROLE_NAME) are surfaced as toasts or field errors — never as full-page errors.
5. Settings tab load errors show a non-blocking error state with a Retry button.
