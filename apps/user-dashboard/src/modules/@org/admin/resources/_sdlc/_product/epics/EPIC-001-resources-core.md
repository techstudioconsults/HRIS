# EPIC-001 — Resources Core: Folder and File Management

_Deliver a complete folder hierarchy and file upload/management workflow for HR document storage._

## Goal

Provide HR admins with the ability to organise all company documents into a browsable folder tree, upload files into those folders, and perform CRUD operations on both folders and files — all within the HRIS admin dashboard.

## Business Value

- Replaces ad-hoc external storage (Google Drive, Dropbox) with a governed, permission-aware document store embedded in the HRIS.
- Reduces time-to-find for HR documents from minutes to seconds.
- Establishes an audit trail for document creation, modification, and deletion.

## Acceptance Criteria (high level)

- [ ] HR admin can create a top-level folder and navigate into it.
- [ ] HR admin can upload one or more files into any folder.
- [ ] HR admin can rename or delete a folder (with confirmation for non-empty folders).
- [ ] HR admin can rename, move, or delete a file.
- [ ] Folders View and Files View tabs are functional and independently browsable.
- [ ] All operations reflect immediately in the UI (optimistic updates) and sync with the backend.
- [ ] Audit fields (`createdBy`, `updatedAt`) are present on all folder and file records.

## User Stories

- US-001 — Create a new folder
- US-002 — Upload a file to a folder
- US-003 — Rename a folder
- US-004 — Delete a folder
- US-005 — Download a file
- US-006 — Move a file between folders
- US-007 — Browse sub-folders via breadcrumb navigation

## Dependencies

- Backend: `/api/v1/resources/folders` and `/api/v1/resources/files` endpoints (CRUD + upload).
- Shared UI: `FolderCard` and `FileCard` components from `@org/ui`.
- Auth: JWT token with `admin:resources:write` permission scope.

## Estimated Effort

| Phase                       | Estimate |
| --------------------------- | -------- |
| Architecture & API contract | 1 day    |
| Backend implementation      | 3 days   |
| Frontend implementation     | 3 days   |
| Testing & review            | 2 days   |
