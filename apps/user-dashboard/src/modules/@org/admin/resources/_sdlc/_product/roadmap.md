# Resources Module — Roadmap

_Phased delivery plan for the company document and file management capability._

## Phase 1 — Core CRUD (Current)

**Goal**: HR admins can create, navigate, and delete folders and upload/download files.

| Story                              | Status      |
| ---------------------------------- | ----------- |
| US-001 Create a new folder         | In Progress |
| US-002 Upload a file to a folder   | Planned     |
| US-003 Rename a folder             | Planned     |
| US-004 Delete a folder             | Planned     |
| US-005 Download a file             | Planned     |
| US-006 Move a file between folders | Planned     |
| US-007 Breadcrumb navigation       | Planned     |

## Phase 2 — Search and Preview

**Goal**: Reduce document retrieval time with name-based search and in-browser PDF/image preview.

- Folder and file search by name across the full hierarchy.
- PDF preview pane (embedded viewer, no download required).
- Image thumbnail preview on FileCard hover.
- File version history (upload a new version, retain previous).

## Phase 3 — Access Control and Sharing

**Goal**: Restrict sensitive document categories to specific roles.

- Per-folder RBAC: grant `view` or `manage` access to custom roles.
- Employment Contracts folder restricted to HR Manager and above by default.
- Expiring share links for external stakeholders (auditors, legal counsel).

## Phase 4 — Compliance and Retention

**Goal**: Support regulatory compliance for document retention policies.

- Configurable document retention periods per folder category.
- Automated archival of expired documents to a read-only archive folder.
- Deletion audit log with approval workflow for permanent deletes.
