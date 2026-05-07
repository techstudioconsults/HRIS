'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { AlertModal } from '@workspace/ui/lib/dialog';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

import { useResourceService } from '../../services/use-service';
import { formatDate, getFileIcon, isImageMimetype } from '../../utils/format';
import type { FileCardProperties } from '../../types';
import { Separator } from '@workspace/ui/components/separator';
import { Card } from '@workspace/ui/components/card';
import { formatFileSize } from '@workspace/ui/lib/utils';

export const FileCard = ({ file }: FileCardProperties) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { useDownloadFile, useRemoveFileById } = useResourceService();

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
        window.open(file.url, '_blank');
      }
    } catch {
      // download errors are handled by the mutation
    }
  };

  const handleView = () => {
    if (file.url) {
      window.open(file.url, '_blank');
    }
  };

  const showImagePreview = isImageMimetype(file.mimetype) && file.url;

  return (
    <>
      <Card className="group cursor-pointer rounded-lg p-4 shadow transition-all hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <div className="bg-muted flex size-10 shrink-0 items-center justify-center rounded-md">
              {showImagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element -- file.url domain is dynamic and not constrainable via remotePatterns
                <img
                  src={file.url}
                  alt={file.name}
                  className="size-full rounded-md object-cover"
                />
              ) : (
                <Image
                  src={getFileIcon(file.mimetype)}
                  alt={`${file.mimetype} icon`}
                  width={28}
                  height={28}
                  className="size-7 object-contain"
                />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h6 className="truncate text-sm font-medium" title={file.name}>
                {file.name}
              </h6>
              <p className="text-muted-foreground mt-0.5 text-[10px]">
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
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 shadow-none">
              <DropdownMenuItem disabled onClick={handleDownload}>
                <Icon name="Download" size={16} className="mr-2" />
                Download File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleView}>
                <Icon name="Eye" size={16} className="mr-2" variant="Outline" />
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
                  variant="Outline"
                />
                Delete File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

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
