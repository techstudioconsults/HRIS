import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

import type { FileQueryParameters, FolderQueryParameters, ResourceService } from "./service";

/**
 * Merge user filters with default pagination settings
 */
const mergeWithDefaultFilters = (filters?: FileQueryParameters): FileQueryParameters => {
  return {
    page: 1,
    limit: 10,
    ...filters,
  };
};

/**
 * Custom hooks for Resource Service operations
 * Provides React Query hooks for folders and files management
 */
export const useResourceService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<ResourceService>(dependencies.RESOURCE_SERVICE);

  // ===================
  // QUERY HOOKS
  // ===================

  /**
   * Fetch all folders with optional filters
   */
  const useGetAllFolders = <TError = Error>(
    filters: FolderQueryParameters = {},
    options?: Omit<UseQueryOptions<unknown, TError>, "queryKey" | "queryFn">,
  ) => useServiceQuery(queryKeys.folder.list(filters), (service) => service.getAllFolders(filters), options);

  /**
   * Fetch all files with optional filters
   */
  const useGetAllFiles = <TError = Error>(
    filters?: FileQueryParameters,
    options?: Omit<UseQueryOptions<unknown, TError>, "queryKey" | "queryFn">,
  ) => {
    const mergedFilters = mergeWithDefaultFilters(filters);

    return useServiceQuery(
      queryKeys.file.list(mergedFilters),
      (service) => service.getAllFiles(mergedFilters),
      options,
    );
  };

  /**
   * Fetch a single folder by ID
   */
  const useGetFolderById = <TError = Error>(
    id: string,
    options?: Omit<UseQueryOptions<unknown, TError>, "queryKey" | "queryFn">,
  ) => useServiceQuery(queryKeys.folder.details(id), (service) => service.getFolderById(id), options);

  /**
   * Download folder as zip (query-based for manual triggering)
   */
  const useDownloadFolder = <TError = Error>(
    id: string,
    options?: Omit<UseQueryOptions<unknown, TError>, "queryKey" | "queryFn">,
  ) =>
    useServiceQuery(queryKeys.folder.download(id), (service) => service.downloadFolder(id), {
      ...options,
      enabled: false, // Manual trigger only
      gcTime: 0,
      staleTime: 0,
    });

  // ===================
  // MUTATION HOOKS
  // ===================

  /**
   * Create a new folder with optional files
   */
  const useCreateFolder = <TError = Error>(
    options?: Omit<UseMutationOptions<unknown, TError, { name: string; file: File[] }>, "mutationFn">,
  ) =>
    useServiceMutation((service, data: { name: string; file: File[] }) => service.createFolder(data.name, data.file), {
      ...options,
      onSuccess: (responseData, variables, context) => {
        options?.onSuccess?.(responseData, variables, context);
        // Return query keys to invalidate - React Query will auto-refresh these
        return [queryKeys.folder.list()];
      },
    });

  /**
   * Update an existing folder (rename and/or add files)
   */
  const useUpdateFolder = <TError = Error>(
    options?: Omit<
      UseMutationOptions<unknown, TError, { id: string; data: { name?: string; file?: File[] } }>,
      "mutationFn"
    >,
  ) =>
    useServiceMutation(
      (service, { id, data }: { id: string; data: { name?: string; file?: File[] } }) => service.updateFolder(id, data),
      {
        ...options,
        onSuccess: (data, variables, context) => {
          options?.onSuccess?.(data, variables, context);
          // Invalidate both list and detail views
          return [queryKeys.folder.list(), queryKeys.folder.details(variables.id)];
        },
      },
    );

  /**
   * Delete a folder and all its contents
   */
  const useDeleteFolder = <TError = Error>(options?: Omit<UseMutationOptions<unknown, TError, string>, "mutationFn">) =>
    useServiceMutation((service, id: string) => service.deleteFolder(id), {
      ...options,
      onSuccess: (responseData, variables, context) => {
        options?.onSuccess?.(responseData, variables, context);
        // Invalidate folder list to reflect deletion
        return [queryKeys.folder.list()];
      },
    });

  /**
   * Add files to an existing folder
   */
  const useAddFilesToFolder = <TError = Error>(
    options?: Omit<UseMutationOptions<unknown, TError, { folderId: string; files: File[] }>, "mutationFn">,
  ) =>
    useServiceMutation(
      (service, { folderId, files }: { folderId: string; files: File[] }) => service.addFilesToFolder(folderId, files),
      {
        ...options,
        onSuccess: (data, variables, context) => {
          options?.onSuccess?.(data, variables, context);
          // Refresh both folder details and lists
          return [queryKeys.folder.list(), queryKeys.folder.details(variables.folderId), queryKeys.file.list()];
        },
      },
    );

  /**
   * Remove a file from a folder
   */
  const useRemoveFileFromFolder = <TError = Error>(
    options?: Omit<UseMutationOptions<unknown, TError, { folderId: string; fileId: string }>, "mutationFn">,
  ) =>
    useServiceMutation(
      (service, { folderId, fileId }: { folderId: string; fileId: string }) =>
        service.removeFileFromFolder(folderId, fileId),
      {
        ...options,
        onSuccess: (data, variables, context) => {
          options?.onSuccess?.(data, variables, context);
          // Refresh folder and file lists
          return [queryKeys.folder.list(), queryKeys.folder.details(variables.folderId), queryKeys.file.list()];
        },
      },
    );

  return {
    // Query Hooks
    useGetAllFolders,
    useGetFolderById,
    useDownloadFolder,
    useGetAllFiles,

    // Mutation Hooks
    useCreateFolder,
    useUpdateFolder,
    useDeleteFolder,
    useAddFilesToFolder,
    useRemoveFileFromFolder,
  };
};
