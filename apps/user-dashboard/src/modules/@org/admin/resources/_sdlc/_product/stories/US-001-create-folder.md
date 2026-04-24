# US-001 — Create a New Folder

_As an HR admin, I want to create a named folder so that I can organise company documents into logical categories._

## Story

**As an** HR admin,
**I want to** create a new folder at the top level or inside an existing folder,
**So that** I can establish a document hierarchy that mirrors our company's organisational structure (e.g., HR Policies > 2024 > Leave).

## Acceptance Criteria

- [ ] A "New Folder" button is visible on the Folders View tab.
- [ ] Clicking "New Folder" opens an inline input or modal prompting for a folder name.
- [ ] Folder names are validated: non-empty, max 100 characters, no leading/trailing whitespace.
- [ ] On submit, the folder appears immediately in the UI (optimistic update).
- [ ] On API error, the optimistic update is rolled back and an error toast is shown.
- [ ] The folder is persisted with `createdBy` set to the current authenticated user's ID.
- [ ] Duplicate folder names within the same parent are rejected with a clear validation message.

## Edge Cases

- Submitting an empty name shows inline validation, not an API call.
- Network failure after optimistic insert rolls back the new FolderCard and shows a retry option.
- Creating a sub-folder inside a deleted folder (race condition) returns a 404 from the API; the UI navigates back to the parent level.

## Related

- EPIC-001
- AC-001-folder-creation-validation
