"use client";

import Loading from "@/app/Loading";
import { ErrorEmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useResourceService } from "../services/use-service";
import { FilesTab } from "./tabs/FilesTab";
import { FoldersTab } from "./tabs/FoldersTab";

interface ResourcesBodyProperties {
  defaultView?: "folders" | "files";
  searchQuery?: string;
}

export const ResourcesBody = ({ defaultView = "files", searchQuery = "" }: ResourcesBodyProperties) => {
  const { useGetAllFolders, useGetAllFiles } = useResourceService();

  // Build query parameters
  const queryParameters = {
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

  // Extract data
  const folders = foldersResponse?.data?.items || [];
  const files = filesResponse?.data?.items || [];

  // Loading and error states
  const isLoading = foldersLoading || filesLoading;
  const hasError = isFoldersError || isFilesError;
  const errorMessage = isFoldersError ? foldersError?.message : filesError?.message;

  if (isLoading) {
    return <Loading text="Loading Resources..." />;
  }

  if (hasError) {
    return <ErrorEmptyState description={errorMessage} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue={defaultView} className="w-full">
        <TabsList className="bg-transparent">
          <TabsTrigger value="files">Files ({files.length})</TabsTrigger>
          <TabsTrigger value="folders">Folders ({folders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="files" className="mt-6">
          <FilesTab files={files} searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="folders" className="mt-6">
          <FoldersTab folders={folders} searchQuery={searchQuery} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
