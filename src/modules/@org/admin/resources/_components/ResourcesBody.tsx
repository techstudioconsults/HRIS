"use client";

import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { ApiResponse, Folder, FolderFile } from "../services/types";
import { useResourceService } from "../services/use-service";
import { EditFolderForm } from "./forms/edit-folder";
import { FilesTab } from "./tabs/FilesTab";
import { FoldersTab } from "./tabs/FoldersTab";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { ErrorState } from "./ui/ErrorState";
import { LoadingState } from "./ui/LoadingState";

interface ResourcesBodyProperties {
  defaultView?: "folders" | "files";
  searchQuery?: string;
}

export const ResourcesBody = ({ defaultView = "files", searchQuery = "" }: ResourcesBodyProperties) => {
  const router = useRouter();
  const { useGetAllFolders, useGetAllFiles, useDeleteFolder, useRemoveFileFromFolder } = useResourceService();

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [renameFolderDialog, setRenameFolderDialog] = useState<{ open: boolean; folder: Folder | null }>({
    open: false,
    folder: null,
  });
  const [deleteFileDialog, setDeleteFileDialog] = useState<{
    open: boolean;
    file: FolderFile | null;
  }>({
    open: false,
    file: null,
  });

  // Build query parameters
  const queryParameters = {
    page: 1,
    limit: 100,
    ...(searchQuery && { search: searchQuery }),
  };

  // Fetch data
  const {
    data: foldersResponse,
    isLoading: foldersLoading,
    error: foldersError,
    isError: isFoldersError,
  } = useGetAllFolders(queryParameters);

  const {
    data: filesResponse,
    isLoading: filesLoading,
    error: filesError,
    isError: isFilesError,
  } = useGetAllFiles(queryParameters);

  // Mutations
  const deleteFolderMutation = useDeleteFolder({
    onSuccess: () => {
      toast.success("Folder deleted successfully");
      setDeleteDialogOpen(false);
      setFolderToDelete(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete folder. Please try again.");
      setDeleteDialogOpen(false);
      setFolderToDelete(null);
    },
  });

  const removeFileMutation = useRemoveFileFromFolder({
    onSuccess: () => {
      toast.success("File deleted successfully");
      setDeleteFileDialog({ open: false, file: null });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete file. Please try again.");
      setDeleteFileDialog({ open: false, file: null });
    },
  });

  // Extract data
  const folders = (foldersResponse as ApiResponse<Folder> | undefined)?.data?.items || [];
  const files = (filesResponse as ApiResponse<FolderFile> | undefined)?.data?.items || [];

  // Handlers
  const handleFolderClick = (folderId: string) => {
    router.push(`/admin/resources/${folderId}`);
  };

  const handleDeleteFolderClick = (folderId: string) => {
    setFolderToDelete(folderId);
    setDeleteDialogOpen(true);
  };

  const handleRenameFolderClick = (folder: Folder) => {
    setRenameFolderDialog({ open: true, folder });
  };

  const handleDeleteFileClick = (file: FolderFile) => {
    setDeleteFileDialog({ open: true, file });
  };

  const handleConfirmDeleteFolder = async () => {
    if (!folderToDelete) return;
    await deleteFolderMutation.mutateAsync(folderToDelete);
  };

  const handleConfirmDeleteFile = async () => {
    if (!deleteFileDialog.file?.folderId || !deleteFileDialog.file?.id) return;
    await removeFileMutation.mutateAsync({
      folderId: deleteFileDialog.file.folderId,
      fileId: deleteFileDialog.file.id,
    });
  };

  // Loading and error states
  const isLoading = foldersLoading || filesLoading;
  const hasError = isFoldersError || isFilesError;
  const errorMessage = isFoldersError ? foldersError?.message : filesError?.message;

  if (isLoading) {
    return <LoadingState />;
  }

  if (hasError) {
    return <ErrorState message={errorMessage} onRetry={() => window.location.reload()} />;
  }

  return (
    <>
      <div className="space-y-6">
        <Tabs defaultValue={defaultView} className="w-full">
          <TabsList className="bg-transparent">
            <TabsTrigger value="files">Files ({files.length})</TabsTrigger>
            <TabsTrigger value="folders">Folders ({folders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-6">
            <FilesTab files={files} searchQuery={searchQuery} onDeleteFile={handleDeleteFileClick} />
          </TabsContent>

          <TabsContent value="folders" className="mt-6">
            <FoldersTab
              folders={folders}
              searchQuery={searchQuery}
              onFolderClick={handleFolderClick}
              onRenameFolder={handleRenameFolderClick}
              onDeleteFolder={handleDeleteFolderClick}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Folder Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Folder"
        description="You're about to delete this folder and all its files. This action cannot be undone."
        onConfirm={handleConfirmDeleteFolder}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setFolderToDelete(null);
        }}
        confirmText="Delete Folder"
        isLoading={deleteFolderMutation.isPending}
        variant="destructive"
      />

      {/* Delete File Dialog */}
      <ConfirmDialog
        open={deleteFileDialog.open}
        onOpenChange={(open) => setDeleteFileDialog({ open, file: deleteFileDialog.file })}
        title="Delete File"
        description={`You're about to delete "${deleteFileDialog.file?.name}". This action cannot be undone.`}
        onConfirm={handleConfirmDeleteFile}
        onCancel={() => setDeleteFileDialog({ open: false, file: null })}
        confirmText="Delete File"
        isLoading={removeFileMutation.isPending}
        variant="destructive"
      />

      {/* Rename Folder Dialog */}
      <ReusableDialog
        open={renameFolderDialog.open}
        onOpenChange={(open) => setRenameFolderDialog({ open, folder: renameFolderDialog.folder })}
        title="Rename Folder"
        description="Enter a new name for this folder"
        trigger={null}
      >
        {renameFolderDialog.folder && (
          <EditFolderForm
            folderId={renameFolderDialog.folder.id}
            currentName={renameFolderDialog.folder.name}
            onClose={() => setRenameFolderDialog({ open: false, folder: null })}
          />
        )}
      </ReusableDialog>
    </>
  );
};
