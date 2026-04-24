# Resources Module — Scope

_Defines what is in and out of scope for the company document and file management feature._

## In Scope

- **Folder management**: create, rename, delete, and navigate nested folder hierarchies.
- **File management**: upload, rename, move between folders, delete, and download files.
- **Dual-tab view**: a Folders tab (FolderCard grid) and a Files tab (FileCard list/grid) on the Resources landing page.
- **Document categories**: HR Policies, Employment Contracts, Onboarding Documents, Benefits Guides, and any custom categories admins define.
- **Breadcrumb navigation**: tracking the current folder path as the user drills into sub-folders.
- **Optimistic UI updates**: reflect create/delete actions immediately with rollback on error.
- **Audit metadata**: every file and folder records `createdBy`, `updatedBy`, `createdAt`, `updatedAt`.

## Out of Scope (v1)

- Full-text search within document content (search is limited to file/folder names).
- In-browser document preview (PDF viewer, image preview).
- Version history / file versioning.
- Shared public links or external sharing.
- Virus scanning on upload (planned for v2 — see known-issues.md).

## Boundary Conditions

- Maximum single file upload size is governed by the backend API configuration (default: 25 MB).
- Folder depth is not technically limited but UX guidance recommends no more than 5 levels deep.
- File types are not restricted client-side; backend enforces an allowlist of MIME types.
