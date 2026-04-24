# Settings Module — Domain Events

## SettingsUpdated

Emitted when any settings domain record is modified.

| Field            | Type                | Description                                                                 |
| ---------------- | ------------------- | --------------------------------------------------------------------------- |
| `domain`         | `SettingsDomain`    | Which settings tab: `account`, `payroll`, `security`, `hr`, `notifications` |
| `organisationId` | `string`            | Organisation that owns the settings                                         |
| `changedFields`  | `string[]`          | Names of fields that changed                                                |
| `updatedBy`      | `string`            | Admin user ID                                                               |
| `occurredAt`     | `string (ISO 8601)` | Event timestamp                                                             |

**Subscribers**: Audit log service; Payroll context (on `payroll` domain change, re-evaluate next pay cycle config); Leave context (on `hr` domain change, re-evaluate carryover rules)

---

## RoleCreated

Emitted when a new custom role is persisted.

| Field            | Type                | Description                |
| ---------------- | ------------------- | -------------------------- |
| `roleId`         | `string`            | New role ID                |
| `name`           | `string`            | Role name                  |
| `permissions`    | `string[]`          | Assigned permission scopes |
| `organisationId` | `string`            | Owner organisation         |
| `createdBy`      | `string`            | Admin user ID              |
| `occurredAt`     | `string (ISO 8601)` | Event timestamp            |

**Subscribers**: Employee context (role list cache invalidation), Teams context

---

## RoleUpdated

Emitted when a custom role's name or permissions are modified.

| Field           | Type                | Description                 |
| --------------- | ------------------- | --------------------------- |
| `roleId`        | `string`            | Updated role ID             |
| `changedFields` | `string[]`          | `name` and/or `permissions` |
| `updatedBy`     | `string`            | Admin user ID               |
| `occurredAt`    | `string (ISO 8601)` | Event timestamp             |

---

## RoleDeleted

Emitted when a custom role is removed.

| Field            | Type                | Description        |
| ---------------- | ------------------- | ------------------ |
| `roleId`         | `string`            | Deleted role ID    |
| `organisationId` | `string`            | Owner organisation |
| `deletedBy`      | `string`            | Admin user ID      |
| `occurredAt`     | `string (ISO 8601)` | Event timestamp    |

**Pre-condition**: Backend must verify no employees are currently assigned this role before deletion. If employees are assigned, the API returns `409 ROLE_IN_USE`.

---

## LogoUploaded

Emitted when a new organisation logo is uploaded as part of an AccountSettings update.

| Field            | Type                | Description                      |
| ---------------- | ------------------- | -------------------------------- |
| `organisationId` | `string`            | Owner organisation               |
| `logoUrl`        | `string`            | New CDN URL of the uploaded logo |
| `uploadedBy`     | `string`            | Admin user ID                    |
| `occurredAt`     | `string (ISO 8601)` | Event timestamp                  |
