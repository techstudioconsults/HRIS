# Resources Module — RBAC

_Defines role-based access control rules for folder and file management._

## Permission Scopes

| Scope                    | Description                                                           |
| ------------------------ | --------------------------------------------------------------------- |
| `admin:resources:read`   | View folders and files; download files                                |
| `admin:resources:write`  | Create, rename, move, and delete folders and files                    |
| `admin:resources:manage` | All write permissions plus ability to manage per-folder access grants |

## Role Assignments (Default)

| Role          | Scopes                                                                     |
| ------------- | -------------------------------------------------------------------------- |
| Super Admin   | `admin:resources:read`, `admin:resources:write`, `admin:resources:manage`  |
| HR Manager    | `admin:resources:read`, `admin:resources:write`                            |
| HR Officer    | `admin:resources:read`, `admin:resources:write`                            |
| Finance Admin | `admin:resources:read` (for Benefits Guides and Payroll folders only — v2) |
| Employee      | No access to the Resources admin module                                    |

## Sensitive Folder Protection

Some folders contain legally sensitive documents (e.g., Employment Contracts, Disciplinary Records). In v2, per-folder ACLs will restrict these folders to HR Manager and above even when the requesting user holds `admin:resources:read`.

## Frontend Enforcement

- The "New Folder" and "Upload File" buttons are hidden for users without `admin:resources:write`.
- Action menus on FolderCard and FileCard omit destructive options (rename, delete) for read-only users.
- Permission checks are performed by reading the JWT claims decoded from the auth context — not via a separate API call.
- Backend enforces all permissions independently; frontend guards are UX-only.
