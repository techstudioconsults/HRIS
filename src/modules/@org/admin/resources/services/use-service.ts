/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { ResourceService } from "./service";
import type { FileQueryParameters, FolderQueryParameters } from "./types";

export const useResourceService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<ResourceService>(dependencies.RESOURCE_SERVICE);

  // Queries - Folders
  const useGetAllFolders = (filters: FolderQueryParameters = {}, options?: any) =>
    useServiceQuery(queryKeys.folder.list(filters), (service) => service.getAllFolders(filters), options);

  const useGetFolderById = (id: string, options?: any) =>
    useServiceQuery(queryKeys.folder.details(id), (service) => service.getFolderById(id), options);

  // Queries - Files
  const useGetAllFiles = (filters: FileQueryParameters = {}, options?: any) =>
    useServiceQuery(queryKeys.file.list(filters), (service) => service.getAllFiles(filters), options);

  const useGetFilesByFolderId = (folderId: string, filters: FileQueryParameters = {}, options?: any) =>
    useServiceQuery(
      queryKeys.file.byFolder(folderId, filters),
      (service) => service.getFilesByFolderId(folderId, filters),
      options,
    );

  // Mutations - Folders
  const useDownloadFolder = () => useServiceMutation((service, id: string) => service.downloadFolder(id));

  const useCreateFolder = () =>
    useServiceMutation((service, data: { name: string; file: File[] }) => service.createFolder(data.name, data.file), {
      invalidateQueries: () => [
        ["folder", "list"],
        ["file", "list"],
      ],
    });

  const useUpdateFolder = () =>
    useServiceMutation(
      (service, { id, data }: { id: string; data: { name?: string; file?: File[] } }) => service.updateFolder(id, data),
      {
        invalidateQueries: (_, { id }) => [["folder", "list"], queryKeys.folder.details(id)],
      },
    );

  const useDeleteFolder = () =>
    useServiceMutation((service, id: string) => service.deleteFolder(id), {
      invalidateQueries: () => [
        ["folder", "list"],
        ["file", "list"],
      ],
    });

  // Mutations - Files
  const useDownloadFile = () => useServiceMutation((service, id: string) => service.downloadFile(id));

  const useAddFilesToFolder = () =>
    useServiceMutation(
      (service, { folderId, files }: { folderId?: string; files: File[] }) => service.addFilesToFolder(folderId, files),
      {
        invalidateQueries: (_, { folderId }) => [
          ["folder", "list"],
          ...(folderId ? [queryKeys.folder.details(folderId)] : []),
          ["file", "list"],
        ],
      },
    );

  // const useRemoveFileFromFolder = () =>
  //   useServiceMutation(
  //     (service, { folderId, fileId }: { folderId: string; fileId: string }) =>
  //       service.removeFileFromFolder(folderId, fileId),
  //     {
  //       invalidateQueries: (_, { folderId }) => [
  //         ["folder", "list"],
  //         queryKeys.folder.details(folderId),
  //         ["file", "list"],
  //       ],
  //     },
  //   );

  const useRemoveFileById = () =>
    useServiceMutation((service, fileId: string) => service.removeFileByID(fileId), {
      invalidateQueries: () => [
        ["file", "list"],
        ["folder", "list"],
      ],
    });

  return {
    // Queries - Folders
    useGetAllFolders,
    useGetFolderById,
    useDownloadFolder,
    // Queries - Files
    useGetAllFiles,
    useGetFilesByFolderId,
    useDownloadFile,
    // Mutations - Folders
    useCreateFolder,
    useUpdateFolder,
    useDeleteFolder,
    // Mutations - Files
    useAddFilesToFolder,
    // useRemoveFileFromFolder,
    useRemoveFileById,
  };
};
