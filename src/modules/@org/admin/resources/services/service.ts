import { HttpAdapter } from "@/lib/http/http-adapter";

import type {
  ApiResponse,
  DeleteResponse,
  DownloadResponse,
  FileQueryParameters,
  Folder,
  FolderFile,
  FolderQueryParameters,
  UpdateFolderDto,
} from "./types";

/**
 * Resource Service Class
 * Handles all API operations for folders and files in the resources module
 */
export class ResourceService {
  private readonly http: HttpAdapter;

  // Default pagination filters
  private readonly DEFAULT_FOLDER_FILTERS: FolderQueryParameters = {
    page: 1,
    limit: 10,
  };

  private readonly DEFAULT_FILE_FILTERS: FileQueryParameters = {
    page: 1,
    limit: 10,
  };

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  /**
   * Create a new folder with optional files
   * @param name - Folder name
   * @param file - Optional array of files to upload with the folder
   * @returns Promise<Folder>
   */
  async createFolder(name: string, file: File[] = []): Promise<Folder> {
    const headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();
    formData.append("name", name);

    for (const singleFile of file) {
      formData.append("file", singleFile);
    }

    const response = await this.http.post<{ data: Folder }>("/folders", formData, headers);

    if (response?.status === 201 && response.data.data) {
      return response.data.data;
    }

    throw new Error("Failed to create folder");
  }

  /**
   * Get all folders with optional filters
   * @param filters - Optional query parameters for filtering, sorting, and pagination
   * @returns Promise<ApiResponse<Folder>>
   */
  async getAllFolders(filters?: FolderQueryParameters): Promise<ApiResponse<Folder>> {
    const response = await this.http.get<ApiResponse<Folder>>("/folders", {
      ...this.DEFAULT_FOLDER_FILTERS,
      ...filters,
    });

    if (response?.status === 200 && response.data) {
      return response.data;
    }

    throw new Error("Failed to fetch folders");
  }

  /**
   * Get a single folder by ID
   * @param id - Folder ID
   * @returns Promise<Folder>
   */
  async getFolderById(id: string): Promise<Folder> {
    const response = await this.http.get<{ data: Folder }>(`/folders/${id}`);

    if (response?.status === 200 && response.data.data) {
      return response.data.data;
    }

    throw new Error("Failed to fetch folder");
  }

  /**
   * Update a folder's name and/or add files to it
   * @param id - Folder ID
   * @param data - Update data containing name and/or files
   * @returns Promise<Folder>
   */
  async updateFolder(id: string, data: UpdateFolderDto): Promise<Folder> {
    const headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();

    if (data.name) {
      formData.append("name", data.name);
    }

    if (data.file && data.file.length > 0) {
      for (const singleFile of data.file) {
        formData.append("file", singleFile);
      }
    }

    const response = await this.http.patch<{ data: Folder }>(`/folders/${id}`, formData, headers);

    if (response?.status === 200 && response.data.data) {
      return response.data.data;
    }

    throw new Error("Failed to update folder");
  }

  /**
   * Delete a folder and all its contents
   * @param id - Folder ID
   * @returns Promise<DeleteResponse>
   */
  async deleteFolder(id: string): Promise<DeleteResponse> {
    const response = await this.http.delete<DeleteResponse>(`/folders/${id}`);

    if (response?.status === 200 && response.data) {
      return response.data;
    }

    throw new Error("Failed to delete folder");
  }

  /**
   * Add files to an existing folder
   * @param folderId - Folder ID to add files to
   * @param files - Array of files to upload
   * @returns Promise<Folder>
   */
  async addFilesToFolder(folderId: string, files: File[]): Promise<Folder> {
    const headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();

    for (const file of files) {
      formData.append("file", file);
    }

    formData.append("folderId", folderId);

    const response = await this.http.post<{ data: Folder }>("/files", formData, headers);

    if (response?.status === 201 && response.data.data) {
      return response.data.data;
    }

    throw new Error("Failed to add files to folder");
  }

  /**
   * Get all files with optional filters
   * @param filters - Optional query parameters for filtering, sorting, and pagination
   * @returns Promise<ApiResponse<FolderFile>>
   */
  async getAllFiles(filters?: FileQueryParameters): Promise<ApiResponse<FolderFile>> {
    const response = await this.http.get<ApiResponse<FolderFile>>("/files", {
      ...this.DEFAULT_FILE_FILTERS,
      ...filters,
    });

    if (response?.status === 200 && response.data) {
      return response.data;
    }

    throw new Error("Failed to fetch files");
  }

  /**
   * Remove a file from a folder
   * @param folderId - Folder ID
   * @param fileId - File ID to remove
   * @returns Promise<DeleteResponse>
   */
  async removeFileFromFolder(folderId: string, fileId: string): Promise<DeleteResponse> {
    const response = await this.http.delete<DeleteResponse>(`/folders/${folderId}/files/${fileId}`);

    if (response?.status === 200 && response.data) {
      return response.data;
    }

    throw new Error("Failed to remove file from folder");
  }

  /**
   * Download a single file
   * @param id - File ID
   * @returns Promise<DownloadResponse>
   */
  async downloadFile(id: string): Promise<DownloadResponse> {
    const response = await this.http.get<Blob>(`/file/${id}/download`, {
      responseType: "blob",
    });

    if (response?.status === 200 && response.data) {
      return response.data as DownloadResponse;
    }

    throw new Error("Failed to download file");
  }

  /**
   * Download a folder as a zip file
   * @param id - Folder ID
   * @returns Promise<DownloadResponse>
   */
  async downloadFolder(id: string): Promise<DownloadResponse> {
    const response = await this.http.get<Blob>(`/folders/${id}/download`, {
      responseType: "blob",
    });

    if (response?.status === 200 && response.data) {
      return response.data as DownloadResponse;
    }

    throw new Error("Failed to download folder");
  }
}

// Re-export types for convenience
export type {
  ApiResponse,
  CreateFolderDto,
  DeleteResponse,
  FileQueryParameters,
  Folder,
  FolderFile,
  FolderQueryParameters,
  UpdateFolderDto,
} from "./types";
