"use client";

import { ConfirmDialog } from "@/components/shared/dialog/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { More } from "iconsax-reactjs";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

import type { FolderFile } from "../../services/types";
import { useResourceService } from "../../services/use-service";
import { formatDate, formatFileSize, getFileIcon } from "../../utils/format";

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
        window.open(file.url, "_blank");
      }
    } catch {
      // ...optionally handle error (toast/snackbar)...
    }
  };

  const handleView = () => {
    if (file.url) {
      window.open(file.url, "_blank");
    }
  };

  return (
    <>
      <div className="group bg-background rounded-lg p-4 shadow transition-all">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Image
              src={getFileIcon(file.type)}
              alt={`${file.type} icon`}
              width={40}
              height={40}
              className="mt-1 h-10 w-10 flex-shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <h6 className="truncate font-medium text-gray-900" title={file.name}>
                {file.name}
              </h6>
              <p className="text-muted-foreground mt-1 text-sm">
                {formatFileSize(file.size)} • {formatDate(file.createdAt)}
              </p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" aria-label="File actions menu">
                <More className="h-4 w-4 rotate-90" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled onClick={handleDownload}>
                Download File
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleView}>View File</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteClick} className="text-red-600">
                Delete File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete File Dialog */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={isPending}
        title="Delete File"
        description={`You're about to delete "${file.name}". This action cannot be undone.`}
        confirmText="Delete File"
        variant="destructive"
      />
    </>
  );
};
