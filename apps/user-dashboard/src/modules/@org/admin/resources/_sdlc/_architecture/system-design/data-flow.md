# Resources Module — Data Flow

_Describes how data moves between the backend API, TanStack Query cache, and UI components._

## Read Flow (Folder List)

```
ResourcesView mounts
  → useFolders(folderId) fires
    → HttpAdapter.get('/api/v1/resources/folders?parentId=<folderId>')
      → API returns { status, data: Folder[], timestamp }
        → TanStack Query caches under key ['resources', 'folders', folderId]
          → FolderCardGrid receives folders[]
            → FolderCard renders per folder
```

## Write Flow (Create Folder)

```
HR admin submits CreateFolderModal
  → useCreateFolder.mutate({ name, parentId })
    → Optimistic update: queryClient.setQueryData(['resources', 'folders', parentId], prev => [...prev, optimisticFolder])
      → HttpAdapter.post('/api/v1/resources/folders', payload)
        → On success: queryClient.invalidateQueries(['resources', 'folders', parentId])
        → On error: queryClient.setQueryData(key, previousSnapshot) + toast error
```

## Upload Flow (File Upload)

```
HR admin drops files onto UploadFileDropzone
  → useUpload.mutate({ files: FileList, folderId })
    → Progress state tracked per file via XHR / fetch streaming
      → HttpAdapter.post('/api/v1/resources/files/upload', FormData)
        → On success: invalidate ['resources', 'files', folderId]
        → On error: per-file error state shown in dropzone UI
```

## Cache Invalidation Strategy

| Action        | Keys Invalidated                                                                   |
| ------------- | ---------------------------------------------------------------------------------- |
| Create folder | `['resources', 'folders', parentId]`                                               |
| Delete folder | `['resources', 'folders', parentId]`                                               |
| Upload file   | `['resources', 'files', folderId]`                                                 |
| Move file     | `['resources', 'files', sourceFolderId]`, `['resources', 'files', targetFolderId]` |
