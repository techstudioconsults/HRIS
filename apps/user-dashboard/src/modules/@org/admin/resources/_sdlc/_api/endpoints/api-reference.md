# Resources Module — API Reference

_Documents all backend endpoints consumed by the Resources frontend module._

## Base URL

`/api/v1/resources`

All endpoints require `Authorization: Bearer <JWT>` with `admin:resources:read` or `admin:resources:write` scope.

---

## Folders

### `GET /folders`

List folders within a parent scope.

**Query params**:
| Param | Type | Default | Description |
|---|---|---|---|
| `parentId` | `string \| null` | `null` | Filter by parent folder; null returns root-level folders |
| `page` | `number` | `1` | Page number |
| `size` | `number` | `25` | Items per page (max 100) |

**Response** `200`:

```json
{
  "status": "success",
  "data": {
    "items": [ResourceFolder],
    "total": 12,
    "page": 1,
    "size": 25,
    "totalPages": 1
  },
  "timestamp": "2026-04-23T10:00:00Z"
}
```

### `POST /folders`

Create a new folder.

**Body**: `{ name: string, parentId: string | null }`

**Response** `201`: `{ status, data: ResourceFolder, timestamp }`

**Errors**: `409` (duplicate name), `404` (parent not found), `403` (insufficient permissions)

### `PATCH /folders/:id`

Rename a folder. Body: `{ name: string }`

### `DELETE /folders/:id`

Soft-delete a folder and all children. Returns `200` on success.

---

## Files

### `GET /files`

List files within a folder.

**Query params**: `folderId` (required), `page`, `size`

### `POST /files/upload`

Upload one or more files. `Content-Type: multipart/form-data`

**Form fields**: `folderId` (string), `files` (File[])

**Response** `201`: `{ status, data: ResourceFile[], timestamp }`

### `PATCH /files/:id`

Rename or move a file. Body: `{ name?: string, folderId?: string }`

### `DELETE /files/:id`

Soft-delete a file. Returns `200` on success.

### `GET /files/:id/download`

Returns a short-lived pre-signed download URL. Response: `{ status, data: { downloadUrl: string }, timestamp }`
