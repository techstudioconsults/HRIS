# Resources — Mutation Flow Sequence Diagram

_Illustrates the sequence for create, rename, and delete operations on folders and files._

## Create Folder (Optimistic)

```
HR Admin submits CreateFolderModal (name="2024 Leave Policies", parentId="folder-hr-uuid")
  useCreateFolder.mutate(payload)
    onMutate:
      snapshot = queryClient.getQueryData(['resources','folders','folder-hr-uuid'])
      queryClient.setQueryData([...], [...snapshot, { id:'temp-id', name:'2024 Leave Policies', ...optimisticDefaults }])
      return { snapshot }
    HttpAdapter.post('/api/v1/resources/folders', payload)
      Backend: INSERT INTO resource_folders ...
      Backend: 201 { status:'success', data: Folder }
    onSuccess:
      queryClient.invalidateQueries(['resources','folders','folder-hr-uuid'])
      toast.success("Folder created")
    onError(err, _, context):
      queryClient.setQueryData([...], context.snapshot)
      toast.error("Failed to create folder — please try again")
```

## Upload File

```
HR Admin drops "employment-contract.pdf" onto UploadFileDropzone (folderId="folder-contracts-uuid")
  UploadFileDropzone: builds FormData { file, folderId }
  useUpload.mutate(formData)
    uploadProgress state → [{ name:'employment-contract.pdf', progress:0, status:'uploading' }]
    HttpAdapter.post('/api/v1/resources/files/upload', formData, { onUploadProgress })
      Backend: validates MIME type (application/pdf ✓), saves to object storage
      Backend: 201 { status:'success', data: ResourceFile }
    onSuccess:
      queryClient.invalidateQueries(['resources','files','folder-contracts-uuid'])
      uploadProgress state → [{ ..., progress:100, status:'done' }]
    onError:
      uploadProgress state → [{ ..., status:'error', error:'Upload failed' }]
```

## Delete Folder

```
HR Admin clicks "Delete" on FolderCard ("2023 Archived")
  DeleteConfirmDialog opens (non-empty folder warning shown if children > 0)
  HR Admin confirms
  useDeleteFolder.mutate(folderId)
    HttpAdapter.delete('/api/v1/resources/folders/folder-uuid')
      Backend: soft-delete folder and all children
      Backend: 200 { status:'success' }
    onSuccess:
      queryClient.invalidateQueries(['resources','folders', parentId])
      toast.success("Folder deleted")
```
