# Settings Module — API Reference

_All backend endpoints consumed by the settings module._

## Base URL

`/api/v1/settings`

---

## Account Settings

### Get Account Settings

`GET /settings/account`

Response `200 OK`: `AccountSettings` object.

### Update Account Settings

`PATCH /settings/account`

Request body: `AccountSettingsSchema` (JSON or multipart/form-data if logo included).
Response `200 OK`: Updated `AccountSettings` object.

### Upload Logo (part of account update)

Logo is sent as `file` in a `multipart/form-data` PATCH to `/settings/account`.

Errors:

- `413` — file > 2 MB
- `415` — file type not PNG/JPG

---

## Payroll Settings

### Get Payroll Settings

`GET /settings/payroll`

Response `200 OK`: `PayrollSettings` object.

### Update Payroll Settings

`PATCH /settings/payroll`

Request body: `PayrollSettingsSchema`.
Response `200 OK`: Updated `PayrollSettings` object.

---

## Security Settings

### Get Security Settings

`GET /settings/security`

Response `200 OK`: `SecuritySettings` object.

### Update Security Settings

`PATCH /settings/security`

Request body: `SecuritySettingsSchema`.
Response `200 OK`: Updated `SecuritySettings` object.

---

## HR Settings

### Get HR Settings

`GET /settings/hr`

Response `200 OK`: `HRSettings` object.

### Update HR Settings

`PATCH /settings/hr`

Request body: `HRSettingsSchema`.
Response `200 OK`: Updated `HRSettings` object.

---

## Notification Settings

### Get Notification Settings

`GET /settings/notifications`

Response `200 OK`: `NotificationSettings` object.

### Update Notification Settings

`PATCH /settings/notifications`

Request body: partial `NotificationSettings` — array of updated `events[]`.
Response `200 OK`: Updated `NotificationSettings` object.

---

## Roles

### List Roles

`GET /settings/roles`

Response `200 OK`:

```json
{
  "data": {
    "system": [
      {
        "id": "role_super_admin",
        "name": "Super Admin",
        "isSystem": true,
        "permissions": ["..."]
      }
    ],
    "custom": [
      {
        "id": "role_custom_01",
        "name": "Recruitment Lead",
        "isSystem": false,
        "permissions": ["admin:employees:read"]
      }
    ]
  }
}
```

### Create Custom Role

`POST /settings/roles`

Request body: `RoleFormSchema`.
Response `201 Created`: `Role` object.

Error `409 Conflict` — duplicate role name:

```json
{
  "type": "https://hris.example.com/errors/duplicate-role-name",
  "title": "Duplicate Role Name",
  "status": 409,
  "errors": [{ "field": "name", "code": "DUPLICATE_ROLE_NAME" }]
}
```

### Update Custom Role

`PATCH /settings/roles/:id`

Request body: Partial `RoleFormSchema`.
Response `200 OK`: Updated `Role` object.

Error `403` — attempt to update a system role.

### Delete Custom Role

`DELETE /settings/roles/:id`

Response `204 No Content`.

Error `409 Conflict` — role is assigned to employees:

```json
{
  "type": "https://hris.example.com/errors/role-in-use",
  "title": "Role In Use",
  "status": 409,
  "detail": "Cannot delete a role that is currently assigned to employees."
}
```
