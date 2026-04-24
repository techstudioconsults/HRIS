# Resources Module — State Management

_Documents which state lives where and why._

## State Inventory

| State                        | Location                                 | Mechanism                     | Reason                                          |
| ---------------------------- | ---------------------------------------- | ----------------------------- | ----------------------------------------------- |
| Current folder ID            | URL query param `?folderId=`             | Next.js `useSearchParams`     | Shareable, bookmarkable, back-button compatible |
| Active tab (Folders / Files) | URL query param `?tab=`                  | Next.js `useSearchParams`     | Same — persist across navigation                |
| Folder list                  | TanStack Query cache                     | `useFolders(folderId)`        | Server state, auto-stale, background refetch    |
| File list                    | TanStack Query cache                     | `useFiles(folderId)`          | Server state, pagination-aware                  |
| Upload progress              | Local `useState` in `UploadFileDropzone` | `useState<UploadProgress[]>`  | Ephemeral, not needed beyond the session        |
| Modal open state             | Local `useState` in parent view          | `useState<boolean>`           | Short-lived UI toggle                           |
| Rename form state            | React Hook Form                          | `useForm<RenameFolderSchema>` | Controlled, validated                           |

## No Global Client Store

The Resources module intentionally does not use Zustand or Jotai. All persistent state is either server state (TanStack Query) or URL state (Next.js params). This follows the project's principle: URL state for navigation, TanStack Query for server data, local `useState` for ephemeral UI.

## TanStack Query Key Registration

All query keys are registered in `src/lib/react-query/query-keys.ts`:

```ts
resources: {
  folders: (parentId?: string) => ['resources', 'folders', parentId ?? 'root'],
  files:   (folderId?: string) => ['resources', 'files',   folderId ?? 'root'],
  detail:  (id: string)        => ['resources', 'detail',  id],
}
```
