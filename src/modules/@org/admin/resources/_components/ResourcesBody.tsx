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
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Folder, FolderFile } from "../services/service";
import { useResourceService } from "../services/use-service";

interface ResourcesViewProperties {
  defaultView?: "folders" | "files";
}

// File icon mapping utility - FIXED: Handle undefined fileType
const getFileIcon = (fileType: string | undefined) => {
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

  // Handle undefined or null fileType
  if (!fileType) {
    return iconMapping.default;
  }

  // Extract file extension from type or name
  const extension = fileType.toLowerCase().split("/").pop() || "";
  return iconMapping[extension] || iconMapping.default;
};

// Format date utility
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return "Invalid date";
    }
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return "Invalid date";
  }
};

export const ResourcesBody = ({ defaultView = "files" }: ResourcesViewProperties) => {
  const router = useRouter();
  const { useGetAllFolders, useGetAllFiles, useDeleteFolder, useDownloadFolder } = useResourceService();
  const deleteFolderMutation = useDeleteFolder();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
  const [folderToDownload, setFolderToDownload] = useState<string | null>(null);
  const [allFiles, setAllFiles] = useState<FolderFile[]>([]);
  const [allFolders, setAllFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch all files
  const {
    data: filesResponse,
    isLoading: filesLoading,
    error: filesError,
    isError: isFilesError,
  } = useGetAllFiles({
    page: 1,
    limit: 100,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Fetch all folders
  const {
    data: foldersResponse,
    isLoading: foldersLoading,
    error: foldersError,
    isError: isFoldersError,
  } = useGetAllFolders({
    page: 1,
    limit: 50,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  useEffect(() => {
    // Check if both queries have completed (successfully or with error)
    const bothQueriesDone = !filesLoading && !foldersLoading;

    if (bothQueriesDone) {
      setIsLoading(false);

      // Handle errors
      if (isFilesError || isFoldersError) {
        setHasError(true);
        setErrorMessage(
          isFilesError
            ? filesError?.message || "Failed to load files"
            : foldersError?.message || "Failed to load folders",
        );
        return;
      }

      // Set data from successful responses
      if (filesResponse?.data?.items) {
        setAllFiles(filesResponse.data.items);
      } else {
        setAllFiles([]);
      }

      if (foldersResponse?.data?.items) {
        setAllFolders(foldersResponse.data.items);
      } else {
        setAllFolders([]);
      }

      setHasError(false);
    }
  }, [
    filesLoading,
    foldersLoading,
    filesResponse,
    foldersResponse,
    isFilesError,
    isFoldersError,
    filesError,
    foldersError,
  ]);

  // Download folder query
  const downloadFolderQuery = useDownloadFolder(folderToDownload || "");

  useEffect(() => {
    if (downloadFolderQuery.data && folderToDownload) {
      handleDownloadResponse(downloadFolderQuery.data, folderToDownload);
      setFolderToDownload(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downloadFolderQuery.data, folderToDownload]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDownloadResponse = (data: any, folderId: string) => {
    if (data instanceof Blob) {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      const folder = allFolders.find((f) => f.id === folderId);
      const folderName = folder?.name || "folder";
      link.setAttribute("download", `${folderName}.zip`);
      document.body.append(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Folder downloaded successfully");
    } else if (data?.url) {
      window.open(data.url, "_blank");
      toast.success("Folder download started");
    }
  };

  const handleFolderClick = (folderId: string) => {
    router.push(`/resources/folders/${folderId}`);
  };

  const handleFileDownload = async (file: FolderFile) => {
    if (file.url) {
      window.open(file.url, "_blank");
    } else {
      // console.log("Download file:", file.id);
      toast.error("File download URL is not available");
    }
  };

  // delete folder flow
  const handleDeleteFolderClick = (folderId: string) => {
    setFolderToDelete(folderId);
    setDialogOpen(true);
  };

  // delete folder flow
  const handleConfirmDelete = async () => {
    if (!folderToDelete) return;

    try {
      await deleteFolderMutation.mutateAsync(folderToDelete);
      toast.success("Folder deleted successfully");

      // Refresh the data after deletion
      window.location.reload();

      setDialogOpen(false);
      setFolderToDelete(null);
    } catch {
      toast.error("Failed to delete folder. Please try again.");
      setDialogOpen(false);
      setFolderToDelete(null);
    }
  };
  // delete folder flow
  const handleCancelDelete = () => {
    setDialogOpen(false);
    setFolderToDelete(null);
  };

  const handleFolderDownload = async (folderId: string) => {
    setFolderToDownload(folderId);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");
    window.location.reload();
  };

  // Loading state
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

  // Error state
  if (hasError) {
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
        <p className="text-muted-foreground mt-2 text-sm">{errorMessage}</p>
        <MainButton className="mt-4" variant="primary" onClick={handleRetry}>
          Try Again
        </MainButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={defaultView} className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger value="files">Files ({allFiles.length})</TabsTrigger>
          <TabsTrigger value="folders">Folders ({allFolders.length})</TabsTrigger>
        </TabsList>

        {/* Files Tab */}
        <TabsContent value="files" className="mt-6">
          {allFiles.length === 0 ? (
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
              <p className="text-muted-foreground mt-2 text-sm">Upload files to folders to see them here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allFiles.map((file) => (
                <div key={file.id} className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Image
                        src={getFileIcon(file.type)}
                        alt={`${file.type} icon`}
                        width={40}
                        height={40}
                        className="mt-1 h-10 w-8 object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <h6 className="truncate font-medium text-gray-900" title={file.name}>
                          {file.name}
                        </h6>
                        <p className="text-muted-foreground mt-1 text-sm">Created {formatDate(file.createdAt)}</p>
                        {/* {file.folderName && <p className="text-muted-foreground mt-1 text-xs">In: {file.folderName}</p>} */}
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
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete File</DropdownMenuItem>
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
          {allFolders.length === 0 ? (
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
              <p className="text-muted-foreground mt-2 text-sm">Create your first folder to organize your files</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {allFolders.map((folder) => (
                <div key={folder.id} className="rounded-lg border bg-white p-4 transition-shadow hover:shadow-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Image
                        src="/images/resources/folder.svg"
                        alt="Folder icon"
                        width={40}
                        height={40}
                        className="mt-1 h-10 w-10 object-contain"
                      />
                      <div className="min-w-0 flex-1">
                        <h6 className="truncate font-medium text-gray-900" title={folder.name}>
                          {folder.name}
                        </h6>
                        <p className="text-muted-foreground mt-1 text-sm">Created {formatDate(folder.createdAt)}</p>
                        <p className="text-muted-foreground mt-1 text-xs">
                          {/* {folder.fileCount || folder.file?.length || 0} files */}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Folder actions menu">
                          <More className="h-4 w-4 rotate-90" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleFolderClick(folder.id)}>View Folder</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFolderDownload(folder.id)}>
                          Download Folder
                        </DropdownMenuItem>
                        <DropdownMenuItem>Rename Folder</DropdownMenuItem>
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
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        trigger={null}
        title={undefined}
        description={undefined}
        img={undefined}
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Image src="/images/resources/warning.svg" alt="Warning" width={80} height={80} className="mb-4 h-20 w-20" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">Delete Folder</h3>
          <p className="text-muted-foreground text-sm">
            You&apos;re about to delete this folder and all the files in it. This action cannot be undone.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <MainButton
            variant="outline"
            onClick={handleCancelDelete}
            //  disabled={deleteFolderMutation.isPending}
          >
            Cancel
          </MainButton>

          <MainButton
            variant="destructive"
            onClick={handleConfirmDelete}
            // disabled={deleteFolderMutation.isPending}
          >
            {deleteFolderMutation.isPending ? "Deleting..." : "Delete Folder"}
          </MainButton>
        </div>
      </ReusableDialog>
    </div>
  );
};
