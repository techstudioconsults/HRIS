# Resources Module — Domain Events

_Events emitted by the Resources domain that other parts of the system may react to._

## Event Catalogue

### `resource.folder.created`

Emitted when an HR admin successfully creates a new folder.

| Field            | Type             | Description                       |
| ---------------- | ---------------- | --------------------------------- |
| `folderId`       | `string`         | UUID of the new folder            |
| `name`           | `string`         | Folder name                       |
| `parentId`       | `string \| null` | Parent folder ID or null for root |
| `createdBy`      | `string`         | User ID of the admin              |
| `organisationId` | `string`         | Org scoping                       |
| `timestamp`      | `string`         | ISO 8601                          |

### `resource.folder.deleted`

Emitted on soft-delete. Downstream handlers may clean up associated file records.

### `resource.file.uploaded`

Emitted when a file is successfully stored and its metadata persisted.

| Field            | Type     | Description            |
| ---------------- | -------- | ---------------------- |
| `fileId`         | `string` | UUID                   |
| `name`           | `string` | Original file name     |
| `mimeType`       | `string` | e.g. `application/pdf` |
| `sizeBytes`      | `number` |                        |
| `folderId`       | `string` |                        |
| `uploadedBy`     | `string` | User ID                |
| `organisationId` | `string` |                        |

### `resource.file.deleted`

Emitted on file deletion; storage cleanup can be handled asynchronously via this event.

## Frontend Behaviour on Events

The frontend does not consume domain events directly. It relies on TanStack Query cache invalidation after each successful mutation to reflect state changes in the UI.
