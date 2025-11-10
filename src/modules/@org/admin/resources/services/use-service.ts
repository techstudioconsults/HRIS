import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { FileQueryParameters, FolderQueryParameters, ResourceService } from "./service";

const mergeWithDefaultFilters = (filters?: FileQueryParameters): FileQueryParameters => {
  return {
    page: 1,
    limit: 10,
    ...filters,
  };
};

export const useResourceService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<ResourceService>(dependencies.RESOURCE_SERVICE);

  // Queries
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useGetAllFolders = (filters: FolderQueryParameters = {}, options?: any) =>
    useServiceQuery(queryKeys.folder.list(filters), (service) => service.getAllFolders(filters), options);

  // const useGetAllFiles = (filters: FileQueryParameters = { page: 1, limit: 10 }, options?: any) =>
  //   useServiceQuery(queryKeys.file.list(filters), (service) => service.getAllFiles(filters), options);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useGetAllFiles = (filters?: FileQueryParameters, options?: any) => {
    const mergedFilters = mergeWithDefaultFilters(filters);

    return useServiceQuery(
      queryKeys.file.list(mergedFilters),
      (service) => service.getAllFiles(mergedFilters),
      options,
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useGetFolderById = (id: string, options?: any) =>
    useServiceQuery(queryKeys.folder.details(id), (service) => service.getFolderById(id), options);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const useDownloadFolder = (id: string, options?: any) =>
    useServiceQuery(queryKeys.folder.download(id), (service) => service.downloadFolder(id), {
      ...options,
      // Typically download queries shouldn't be cached
      cacheTime: 0,
      staleTime: 0,
    });

  // Mutations with proper cache invalidation
  const useCreateFolder = () =>
    useServiceMutation((service, data: { name: string; file: File[] }) => service.createFolder(data.name, data.file), {
      onSuccess: () => {
        // Invalidate all folder list queries
        return [queryKeys.folder.list()];
      },
    });

  const useUpdateFolder = () =>
    useServiceMutation(
      (service, { id, data }: { id: string; data: { name?: string; file?: File[] } }) => service.updateFolder(id, data),
      {
        onSuccess: (_, { id }) => {
          // Invalidate folder list and specific folder details
          return [queryKeys.folder.list(), queryKeys.folder.details(id)];
        },
      },
    );

  const useDeleteFolder = () =>
    useServiceMutation((service, id: string) => service.deleteFolder(id), {
      onSuccess: () => {
        // Invalidate all folder list queries
        return [queryKeys.folder.list()];
      },
    });

  const useAddFilesToFolder = () =>
    useServiceMutation(
      (service, { folderId, files }: { folderId: string; files: File[] }) => service.addFilesToFolder(folderId, files),
      {
        onSuccess: (data, { folderId }) => {
          // console.log("Files added successfully:", data);
          // Invalidate folder list and specific folder details
          return [queryKeys.folder.list(), queryKeys.folder.details(folderId)];
        },
        onError: (error) => {
          // console.error("Failed to add files:", error);
          throw error; // Rethrow the error for further handling if needed
        },
      },
    );

  const useRemoveFileFromFolder = () =>
    useServiceMutation(
      (service, { folderId, fileId }: { folderId: string; fileId: string }) =>
        service.removeFileFromFolder(folderId, fileId),
      {
        onSuccess: (_, { folderId }) => {
          // Invalidate folder list and specific folder details when files are removed
          return [queryKeys.folder.list(), queryKeys.folder.details(folderId)];
        },
      },
    );

  return {
    // Queries
    useGetAllFolders,
    useGetFolderById,
    useDownloadFolder,
    useGetAllFiles,

    // Mutations
    useCreateFolder,
    useUpdateFolder,
    useDeleteFolder,
    useAddFilesToFolder,
    useRemoveFileFromFolder,
  };
};
