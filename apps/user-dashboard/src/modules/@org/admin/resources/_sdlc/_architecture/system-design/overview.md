# Resources Module — System Design Overview

_High-level architectural description of how the folder and file management system is structured._

## Module Boundaries

The Resources module is a frontend-only feature module (`@org/admin/resources`) that communicates exclusively with the backend via the `HttpAdapter` abstraction. It does not import from other feature modules; shared UI primitives come from `@org/ui`.

## Layering

```
_views/          ← ResourcesView (page shell), FolderDetailView
  └── components/  ← FolderCard, FileCard, ResourcesHeader, UploadDropzone
      └── hooks/   ← useResources, useFolders, useFiles, useUpload (via HttpAdapter)
          └── services/  ← resourcesService.ts (raw API calls)
              └── types/   ← ResourceFolder, ResourceFile, Zod schemas
```

## Key Interactions

1. `ResourcesView` renders the two-tab layout (Folders / Files).
2. The active tab drives which TanStack Query hook is active (`useFolders` or `useFiles`).
3. Folder navigation updates a URL query param (`?folderId=<id>`) so the browser back button works.
4. Mutations (create folder, upload file, delete) use TanStack Query `useMutation` with optimistic updates.
5. On mount, the module fetches the top-level folder list; drill-down fetches are triggered by tab/card interactions.

## Technology Choices

| Concern       | Choice                                  | Reason                                    |
| ------------- | --------------------------------------- | ----------------------------------------- |
| Data fetching | TanStack Query v5                       | Server state, caching, optimistic updates |
| File upload   | Native `FormData` via `HttpAdapter`     | No extra dependency; MSW-compatible       |
| Folder state  | URL query param                         | Shareable, browser-back-compatible        |
| Validation    | Zod                                     | Consistent with project-wide pattern      |
| UI components | `FolderCard`, `FileCard` from `@org/ui` | Reuse, design consistency                 |
