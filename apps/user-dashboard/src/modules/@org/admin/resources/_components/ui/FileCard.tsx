'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { AlertModal, MainButton } from '@workspace/ui/lib';
import { Icon } from '@workspace/ui/lib/icons/icon';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import type { FolderFile } from '../../services/types';
import { useResourceService } from '../../services/use-service';
import { formatDate, formatFileSize, getFileIcon } from '../../utils/format';
import { Separator } from '@workspace/ui/components/separator';

interface FileCardProperties {
  file: FolderFile;
}

export const FileCard = ({ file }: FileCardProperties) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { useDownloadFile, useRemoveFileById } = useResourceService();

  // Delete file mutation
  const { mutateAsync: removeFileMutation, isPending } = useRemoveFileById();
  const { mutateAsync: downloadFileMutation } = useDownloadFile();

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!file.id) return;
    await removeFileMutation(file.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        toast.success(`File "${file.name}" has been deleted.`);
      },
    });
  };

  const handleDownload = async () => {
    try {
      if (file.id) {
        await downloadFileMutation(file.id);
      } else if (file.url) {
        // Fallback: open the file URL if no id
        window.open(file.url, '_blank');
      }
    } catch {
      // ...optionally handle error (toast/snackbar)...
    }
  };

  const handleView = () => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  return (
    <>
      <div className="group bg-background rounded-lg p-4 shadow transition-all">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Image
              src={getFileIcon(file.mimetype)}
              alt={`${file.mimetype} icon`}
              width={500}
              height={500}
              className="mt-1 size-5 lg:size-10 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <h6 className="truncate text-sm font-medium" title={file.name}>
                {file.name}
              </h6>
              <p className="text-muted-foreground mt-1 text-[8px] lg:text-xs">
                {formatFileSize(file.size)} • {formatDate(file.createdAt)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <MainButton
                variant="ghost"
                className="rotate-90"
                aria-label="File actions menu"
                icon={<Icon name="More" size={16} variant={`Outline`} />}
                isIconOnly
                size={`icon`}
              ></MainButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 shadow-none">
              <DropdownMenuItem disabled onClick={handleDownload}>
                <Icon name="Download" size={16} className="mr-2" />
                Download File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleView}>
                <Icon
                  name="Eye"
                  size={16}
                  className="mr-2"
                  variant={`Outline`}
                />
                View File
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
                Delete File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete File Dialog */}
      <AlertModal
        type="warning"
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isPending}
        title="Delete File"
        description={`You're about to delete "${file.name}". This action cannot be undone.`}
        confirmText="Delete File"
        cancelText="Cancel"
      />
    </>
  );
};
