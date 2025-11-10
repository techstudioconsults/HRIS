"use client";

import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { More } from "iconsax-reactjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import type { ApiResponse, Folder, FolderFile } from "../services/service";
import { useResourceService } from "../services/use-service";

interface ResourcesBodyProperties {
  defaultView?: "folders" | "files";
  searchQuery?: string;
}

/**
 * Get file icon based on file type/extension
 */
const getFileIcon = (fileType?: string): string => {
  const iconMapping: Record<string, string> = {
    pdf: "/images/resources/pdf-icon.svg",
    doc: "/images/resources/doc-icon.svg",
    docx: "/images/resources/doc-icon.svg",
    xls: "/images/resources/xls-icon.svg",
    xlsx: "/images/resources/xls-icon.svg",
    jpg: "/images/resources/img-icon.svg",
    jpeg: "/images/resources/img-icon.svg",
    png: "/images/resources/img-icon.svg",
    default: "/images/resources/doc-icon.svg",
  };

  if (!fileType) return iconMapping.default;

  const extension = fileType.toLowerCase().split("/").pop() || "";
  return iconMapping[extension] || iconMapping.default;
};

/**
 * Format date to readable string
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

/**
 * Format file size to readable string
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, index)) * 100) / 100} ${sizes[index]}`;
};

/**
 * Handle file download
 */
const handleFileDownload = (file: FolderFile) => {
  if (file.url) {
    window.open(file.url, "_blank");
    toast.success("File download started");
  } else {
    toast.error("File download URL is not available");
  }
};

/**
 * Handle folder download
 */
const handleFolderDownload = async (folder: Folder) => {
  try {
    toast.info("Preparing folder download...");
    // Download implementation would go here
    toast.success(`Folder "${folder.name}" download started`);
  } catch {
    toast.error("Failed to download folder");
  }
};

export const ResourcesBody = ({ defaultView = "files", searchQuery = "" }: ResourcesBodyProperties) => {
  const router = useRouter();
  const { useGetAllFolders, useGetAllFiles, useDeleteFolder } = useResourceService();

  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);

  // Build query parameters - only include non-empty values
  const foldersQuery = {
    page: 1,
    limit: 100,
    ...(searchQuery && { search: searchQuery }),
  };

  const filesQuery = {
    page: 1,
    limit: 100,
    ...(searchQuery && { search: searchQuery }),
  };

  // Fetch folders
  const {
    data: foldersResponse,
    isLoading: foldersLoading,
    error: foldersError,
    isError: isFoldersError,
  } = useGetAllFolders(foldersQuery);

  // Fetch files
  const {
    data: filesResponse,
    isLoading: filesLoading,
    error: filesError,
    isError: isFilesError,
  } = useGetAllFiles(filesQuery);

  // Delete folder mutation
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

  // Extract data with type safety
  const folders = (foldersResponse as ApiResponse<Folder> | undefined)?.data?.items || [];
  const files = (filesResponse as ApiResponse<FolderFile> | undefined)?.data?.items || [];

  // Combined loading state
  const isLoading = foldersLoading || filesLoading;
  const hasError = isFoldersError || isFilesError;

  // Handlers
  const handleFolderClick = (folderId: string) => {
    router.push(`/admin/resources/${folderId}`);
  };

  const handleDeleteFolderClick = (folderId: string) => {
    setFolderToDelete(folderId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!folderToDelete) return;
    await deleteFolderMutation.mutateAsync(folderToDelete);
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setFolderToDelete(null);
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="border-primary mx-auto h-12 w-12 animate-spin rounded-full border-b-2"></div>
          <p className="text-muted-foreground mt-4">Loading resources...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (hasError) {
    const errorMessage = isFoldersError ? foldersError?.message : filesError?.message;
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3">
          <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-red-800">Error loading resources</h3>
        <p className="text-muted-foreground mt-2 text-sm">{errorMessage || "An unexpected error occurred"}</p>
        <MainButton className="mt-4" variant="primary" onClick={() => window.location.reload()}>
          Try Again
        </MainButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={defaultView} className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger value="files">Files ({files.length})</TabsTrigger>
          <TabsTrigger value="folders">Folders ({folders.length})</TabsTrigger>
        </TabsList>

        {/* Files Tab */}
        <TabsContent value="files" className="mt-6">
          {files.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-3">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-muted-foreground text-lg font-medium">No files found</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {searchQuery ? "Try adjusting your search" : "Upload files to folders to see them here"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {files.map((file: FolderFile) => (
                <div key={file.id} className="group rounded-lg border bg-white p-4 transition-all hover:shadow-md">
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
                        <DropdownMenuItem onClick={() => handleFileDownload(file)}>Download File</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => file.url && window.open(file.url, "_blank")}>
                          View File
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Folders Tab */}
        <TabsContent value="folders" className="mt-6">
          {folders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-3">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-muted-foreground text-lg font-medium">No folders found</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                {searchQuery ? "Try adjusting your search" : "Create your first folder to organize your files"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {folders.map((folder: Folder) => (
                <div
                  key={folder.id}
                  className="group cursor-pointer rounded-lg border bg-white p-4 transition-all hover:shadow-md"
                  onClick={() => handleFolderClick(folder.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <Image
                        src="/images/resources/folder.svg"
                        alt="Folder icon"
                        width={40}
                        height={40}
                        className="mt-1 h-10 w-10 flex-shrink-0 object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <h6 className="truncate font-medium text-gray-900" title={folder.name}>
                          {folder.name}
                        </h6>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {folder.fileCount || 0} files • {formatDate(folder.createdAt)}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Folder actions menu">
                          <More className="h-4 w-4 rotate-90" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48" onClick={(event) => event.stopPropagation()}>
                        <DropdownMenuItem onClick={() => handleFolderClick(folder.id)}>View Folder</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFolderDownload(folder)}>
                          Download Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteFolderClick(folder.id)} className="text-red-600">
                          Delete Folder
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <ReusableDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        trigger={null}
        title={undefined}
        description={undefined}
        img={undefined}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-red-100 p-3">
            <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Delete Folder</h3>
          <p className="text-muted-foreground text-sm">
            You&apos;re about to delete this folder and all its files. This action cannot be undone.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MainButton variant="outline" onClick={handleCancelDelete} isDisabled={deleteFolderMutation.isPending}>
            Cancel
          </MainButton>
          <MainButton variant="destructive" onClick={handleConfirmDelete} isDisabled={deleteFolderMutation.isPending}>
            {deleteFolderMutation.isPending ? "Deleting..." : "Delete Folder"}
          </MainButton>
        </div>
      </ReusableDialog>
    </div>
  );
};
