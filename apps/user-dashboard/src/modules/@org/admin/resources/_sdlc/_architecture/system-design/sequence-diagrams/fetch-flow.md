# Resources — Fetch Flow Sequence Diagram

_Illustrates the data-fetching sequence when an HR admin opens the Resources page._

## Folder List Fetch

```
HR Admin → Browser → ResourcesView (Server Component)
  ResourcesView → useFolders(parentId='root')
    useFolders → TanStack Query
      [cache miss] → HttpAdapter.get('/api/v1/resources/folders?parentId=root')
        HttpAdapter → Backend API (with Authorization: Bearer <JWT>)
          Backend → PostgreSQL (SELECT * FROM resource_folders WHERE parent_id IS NULL)
          Backend → HttpAdapter: 200 { status:'success', data: Folder[], timestamp }
        HttpAdapter → useFolders: Folder[]
      TanStack Query: cache set ['resources','folders','root']
      useFolders → FolderCardGrid: folders[]
        FolderCardGrid → FolderCard[]: render each folder
```

## Sub-folder Drill-down Fetch

```
HR Admin clicks FolderCard ("HR Policies")
  FolderCard → router.push('?folderId=folder-uuid-123')
    ResourcesView detects folderId change
      useFolders('folder-uuid-123') fires
        [cache miss] → HttpAdapter.get('/api/v1/resources/folders?parentId=folder-uuid-123')
          Backend returns sub-folder list
        TanStack Query: cache set ['resources','folders','folder-uuid-123']
        BreadcrumbNav: Resources > HR Policies
        FolderCardGrid: renders sub-folders
```

## Stale-While-Revalidate Behaviour

On returning to a previously visited folder:

1. TanStack Query serves the cached data immediately (no loading skeleton).
2. A background refetch is fired if the data is older than `staleTime` (default: 60 seconds).
3. If the background fetch returns new data, the UI updates without a loading flash.
