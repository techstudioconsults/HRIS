# Resources Module — Domain Entities

_Describes the core data models for the company document management domain._

## ResourceFolder

Represents a named container for files or other sub-folders.

```ts
interface ResourceFolder {
  readonly id: string; // UUID
  readonly name: string; // max 100 chars, unique within parent
  readonly parentId: string | null; // null = top-level folder
  readonly organisationId: string;
  readonly createdBy: string; // user ID
  readonly updatedBy: string;
  readonly createdAt: string; // ISO 8601
  readonly updatedAt: string;
  readonly childCount: number; // denormalised count for "non-empty" warning
  readonly fileCount: number;
}
```

## ResourceFile

Represents an uploaded document within a folder.

```ts
interface ResourceFile {
  readonly id: string; // UUID
  readonly name: string; // original file name
  readonly mimeType: string; // e.g. 'application/pdf'
  readonly sizeBytes: number;
  readonly folderId: string; // must reference an existing ResourceFolder
  readonly storageKey: string; // opaque key for object storage (never exposed to frontend)
  readonly downloadUrl: string; // pre-signed URL, short-lived
  readonly organisationId: string;
  readonly createdBy: string;
  readonly updatedBy: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
```

## Invariants

- A `ResourceFolder` with `parentId: null` is a root-level folder.
- A `ResourceFile` must always reference a valid, non-deleted `ResourceFolder`.
- Deleting a folder cascades to all child folders and files (soft-delete only in v1).
- `storageKey` is backend-only — the frontend only ever receives `downloadUrl`.

## Value Objects

| Name            | Type       | Description                                                                |
| --------------- | ---------- | -------------------------------------------------------------------------- |
| `FolderPath`    | `string[]` | Ordered list of ancestor folder names for breadcrumb rendering             |
| `FileSize`      | `number`   | Bytes; formatted to KB/MB/GB in the UI                                     |
| `MimeTypeLabel` | `string`   | Human-readable label derived from MIME type (e.g., "PDF", "Word Document") |
