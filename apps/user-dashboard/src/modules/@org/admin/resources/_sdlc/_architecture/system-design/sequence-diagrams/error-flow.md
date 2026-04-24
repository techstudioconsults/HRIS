# Resources — Error Flow Sequence Diagram

_Covers how errors from the API and network layer are caught, surfaced, and recovered from._

## API Error (4xx)

```
HR Admin submits CreateFolderModal ("HR Policies" — duplicate name)
  HttpAdapter.post('/api/v1/resources/folders', payload)
    Backend: 409 { status:'error', message:'A folder with this name already exists.' }
  useCreateFolder.onError(err):
    if (err.status === 409):
      setError('name', { message: err.message })   ← maps back to RHF field
      toast.error("Folder name already exists in this location")
    else:
      toast.error("An unexpected error occurred. Please try again.")
    queryClient.setQueryData([...], context.snapshot)  ← rollback optimistic update
```

## Network Error (no response)

```
HR Admin uploads file — network goes offline mid-upload
  HttpAdapter throws NetworkError (fetch rejected)
  useUpload.onError:
    uploadProgress state → { status:'error', error:'Network unavailable — check your connection' }
    FileCard shows retry button
    Retry button re-calls useUpload.mutate with the same payload
```

## Session Expiry (401)

```
Any mutation called after JWT expiry
  Backend: 401 { status:'error', message:'Unauthorized' }
  HttpAdapter: throws AuthError
  Global query error handler (in QueryClient config):
    router.push('/login?returnTo=/admin/resources')
    toast.info("Your session has expired. Please sign in again.")
```

## Error Boundary (unexpected render error)

```
ResourcesView throws unexpected JS error during render
  React Error Boundary catches
  ResourcesErrorFallback renders:
    "Something went wrong loading Resources."
    [Reload page] button → location.reload()
    Error detail shown in dev mode only (never in production)
```
