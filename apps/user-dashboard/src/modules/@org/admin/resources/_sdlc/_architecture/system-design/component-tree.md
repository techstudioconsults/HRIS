# Resources Module — Component Tree

_Visual breakdown of the React component hierarchy for the Resources feature._

## Component Hierarchy

```
ResourcesView                          (page shell, tab state, current folderId)
├── ResourcesHeader                    (page title, "New Folder" / "Upload File" CTAs)
├── Tabs                               (shadcn/ui Tabs — Folders | Files)
│   ├── FoldersTab
│   │   ├── BreadcrumbNav              (current path: Resources > HR Policies > 2024)
│   │   ├── FolderCardGrid             (grid layout wrapping FolderCard list)
│   │   │   └── FolderCard[]           (name, icon, action menu: rename / delete)
│   │   └── EmptyFolderState           (shown when no folders exist in current scope)
│   └── FilesTab
│       ├── FileFilterBar              (sort, filter by type/date)
│       ├── FileCardList               (list or grid layout wrapping FileCard list)
│       │   └── FileCard[]             (name, MIME type icon, size, date, actions)
│       └── EmptyFileState             (shown when no files in current folder)
├── CreateFolderModal                  (controlled by ResourcesHeader CTA)
├── UploadFileDropzone                 (drag-and-drop overlay + progress indicator)
├── RenameFolderDialog                 (inline rename for FolderCard action)
├── DeleteConfirmDialog                (generic confirmation — reused for folder + file delete)
└── ResourcesSkeleton                  (full-page skeleton during initial fetch)
```

## Component Responsibilities

| Component            | Responsibility                                                           |
| -------------------- | ------------------------------------------------------------------------ |
| `ResourcesView`      | Owns `folderId` URL param, active tab, passes context to children        |
| `FolderCard`         | Displays folder metadata, triggers rename/delete via action menu         |
| `FileCard`           | Displays file metadata, triggers download/move/delete                    |
| `BreadcrumbNav`      | Reads folder path from query, renders clickable ancestor links           |
| `UploadFileDropzone` | Handles `dragover`, `drop`, and file input; calls `useUpload` mutation   |
| `CreateFolderModal`  | Contains validated form (React Hook Form + Zod), calls `useCreateFolder` |
