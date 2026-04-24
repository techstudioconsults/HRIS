# Resources Module — Non-Functional Requirements

_Quality attributes that must be satisfied alongside functional requirements._

## Performance

- Folder list (top-level) must render within 200 ms from a warm TanStack Query cache.
- File upload progress must update at least every 500 ms for files larger than 1 MB.
- Pagination: file lists exceeding 50 items must use cursor or page-based pagination — no unbounded `SELECT *`.
- FolderCard and FileCard grids must not cause layout jank; use CSS Grid with fixed card dimensions.

## Accessibility

- All interactive elements (FolderCard action menus, upload button, dialogs) must be keyboard-navigable.
- `aria-label` on icon-only buttons (e.g., delete icon button).
- Focus must be trapped inside modals (`CreateFolderModal`, `DeleteConfirmDialog`) while open.
- Upload progress must be announced to screen readers via `aria-live="polite"`.

## Security

- File uploads validated by MIME type allowlist on the backend; client-side type check is advisory only.
- Maximum file size enforced server-side; client provides a pre-upload size check for UX.
- All API requests include `Authorization: Bearer <JWT>`; 401 responses trigger session expiry flow.
- Folder and file IDs are opaque UUIDs — no sequential integer IDs exposed in the URL.

## Reliability

- Optimistic updates must always be rolled back on API failure with no data loss.
- Upload failures are retryable without re-selecting the file.
- A React Error Boundary wraps `ResourcesView` to prevent a broken resource tree from crashing the entire dashboard.

## Observability

- Key mutations (create folder, upload file, delete) emit structured log entries with `folderId`, `fileId`, `userId`, and `organisationId`.
- Upload failures are tracked as errors (not warnings) with file name and error reason.
