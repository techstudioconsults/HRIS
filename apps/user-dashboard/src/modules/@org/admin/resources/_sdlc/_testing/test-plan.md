# Resources Module — Test Plan

_Coverage strategy for the folder and file management feature._

## Testing Layers

| Layer         | Tool                           | Scope                                                                  |
| ------------- | ------------------------------ | ---------------------------------------------------------------------- |
| Unit          | Vitest + React Testing Library | Hooks, utility functions, component rendering                          |
| Integration   | Vitest + MSW                   | Hook + API mock interaction; mutation flows                            |
| E2E           | Playwright                     | Critical user journeys: create folder, upload file, navigate hierarchy |
| Accessibility | axe-core + Playwright          | WCAG 2.1 AA compliance on key pages                                    |

## Critical Test Scenarios

### Unit

- `useFolders` returns correctly typed folder list from TanStack Query cache.
- `useCreateFolder` fires optimistic update and rolls back on error.
- `FolderCard` renders folder name, child count, and action menu.
- `CreateFolderModal` validates name field (empty, too long, forbidden characters).
- `BreadcrumbNav` renders correct ancestor chain from folder path.

### Integration

- Create folder → API mock returns 201 → FolderCard appears in grid.
- Create folder → API mock returns 409 → Inline error on name field, no new card added.
- Upload file → API mock returns 201 → File appears in Files tab.
- Delete folder → API mock returns 200 → FolderCard removed from grid.

### E2E

- HR admin navigates to Resources, sees root folders, creates a new folder, navigates into it.
- HR admin uploads a PDF to the "HR Policies" folder, file appears in Files tab.
- HR admin deletes an empty folder, confirmation dialog shown, folder removed.

### Accessibility

- No critical or serious violations on the Resources landing page (axe-core).
- Upload dropzone is keyboard-activatable.
- Delete confirmation dialog traps focus.

## Coverage Target

- Domain logic and hooks: > 80% line coverage.
- UI components: happy path + error state covered.
