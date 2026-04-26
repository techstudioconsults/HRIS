'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Separator } from '@workspace/ui/components/separator';
import { AlertModal, ReusableDialog } from '@workspace/ui/lib/dialog';
import { EmptyState } from '@workspace/ui/lib/empty-state';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useState } from 'react';

import empty1 from '~/images/empty-state.svg';
import type { FolderFile } from '../../services/types';
import { useResourceService } from '../../services/use-service';
import { formatDate } from '../../utils/format';
import type { FolderCardProperties } from '../../types';
import { EditFolderForm } from '../forms/edit-folder';
import { FileCard } from './FileCard';
import { Card } from '@workspace/ui/components/card';

export const FolderCard = ({ folder }: FolderCardProperties) => {
  const { useDeleteFolder, useGetFilesByFolderId } = useResourceService();
  const { mutateAsync: deleteFolderMutation, isPending: isDeleting } =
    useDeleteFolder();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameFolderDialog, setRenameFolderDialog] = useState(false);
  const [viewFolderDialog, setViewFolderDialog] = useState(false);

  const {
    data: folderFilesResponse,
    refetch: refetchFolderFiles,
    isFetching: isFetchingFolderFiles,
  } = useGetFilesByFolderId(
    folder.id,
    {},
    { enabled: false, onSuccess: () => setViewFolderDialog(true) }
  );

  const handleFolderClick = () => {
    setViewFolderDialog(true); // open modal immediately
    refetchFolderFiles(); // fetch files; onSuccess keeps modal open
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleRenameClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setRenameFolderDialog(true);
  };

  const handleConfirmDelete = async () => {
    await deleteFolderMutation(folder.id);
    setDeleteDialogOpen(false);
  };

  const handleCloseRename = () => {
    setRenameFolderDialog(false);
  };

  // Add: treat modal as loading until we receive the first response
  const isLoadingFiles =
    isFetchingFolderFiles || (viewFolderDialog && !folderFilesResponse);

  // Normalize response -> files array (supports { data: { items: [...] } } shape)
  const files: FolderFile[] = (() => {
    const response = folderFilesResponse;
    if (Array.isArray(response?.data?.items)) return response.data.items; // primary expected shape
    return [];
  })();

  return (
    <>
      <Card
        className="group cursor-pointer rounded-lg p-4 shadow transition-all hover:shadow-md"
        onClick={handleFolderClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span>
              <Icon name="Folder" size={20} className="text-primary" />
            </span>
            <div className="min-w-0 flex-1">
              <h6 className="truncate text-sm font-medium" title={folder.name}>
                {folder.name}
              </h6>
              <p className="text-muted-foreground mt-1 text-[8px] lg:text-xs">
                {formatDate(folder.createdAt)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(event) => event.stopPropagation()}
            >
              <MainButton
                variant="ghost"
                className="size-8 rotate-90 p-0"
                aria-label="Folder actions menu"
                icon={<Icon name="More" size={16} variant={`Outline`} />}
                isIconOnly
                size={`icon`}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 shadow-none"
              onClick={(event) => event.stopPropagation()}
            >
              <DropdownMenuItem onClick={handleFolderClick}>
                <Icon
                  name="Eye"
                  size={16}
                  className="mr-2"
                  variant={`Outline`}
                />
                {isFetchingFolderFiles ? 'Loading...' : 'View Folder'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleRenameClick}>
                <Icon
                  name="Edit"
                  size={16}
                  className="mr-2"
                  variant={`Outline`}
                />
                Rename Folder
              </DropdownMenuItem>
              <Separator className="bg-border/40 my-1" />
              <DropdownMenuItem
                onClick={handleDeleteClick}
                className="text-destructive"
              >
                <Icon
                  name="Trash"
                  size={16}
                  className="text-destructive mr-2"
                  variant={`Outline`}
                />
                Delete Folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Delete Folder Dialog */}
      <AlertModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Folder"
        description={`You're about to delete "${folder.name}" and all its files. This action cannot be undone.`}
        confirmText="Delete Folder"
        type="warning"
        cancelText="Cancel"
      />

      {/* View Folder Files Dialog */}
      <ReusableDialog
        open={viewFolderDialog}
        onOpenChange={setViewFolderDialog}
        title={`${folder.name} Files`}
        description={isLoadingFiles ? 'Loading files...' : undefined}
        trigger={null}
        icon={<Icon name="FolderOpen" size={32} className="text-primary" />}
        className="lg:min-w-5xl"
        wrapperClassName={`text-left`}
      >
        {isLoadingFiles ? (
          <div className="text-muted-foreground py-6 text-sm">
            Loading files...
          </div>
        ) : files.length === 0 ? (
          <div className="text-muted-foreground py-6 text-sm">
            <EmptyState
              className="bg-background"
              images={[
                { src: empty1.src, alt: 'No files', width: 80, height: 80 },
              ]}
              title="No File found"
              description={'Upload files to this folder to see them here'}
            />
          </div>
        ) : (
          <div className="grid gap-2 lg:gap-3 grid-cols-2">
            {files.map((f) => (
              <FileCard key={f.id} file={f} />
            ))}
          </div>
        )}
      </ReusableDialog>

      {/* Rename Folder Dialog */}
      <ReusableDialog
        open={renameFolderDialog}
        onOpenChange={setRenameFolderDialog}
        title="Rename Folder"
        description="Enter a new name for this folder"
        wrapperClassName={`text-left`}
        trigger={null}
        className="lg:min-w-2xl"
      >
        <EditFolderForm
          folderId={folder.id}
          currentName={folder.name}
          onClose={handleCloseRename}
        />
      </ReusableDialog>
    </>
  );
};
