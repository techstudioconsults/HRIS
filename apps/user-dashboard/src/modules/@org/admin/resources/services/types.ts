/**
 * Global API Response Type
 */
export interface ApiResponse<T> {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  success: boolean;
  message?: string;
}

/**
 * API Error Response Type
 */
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Create Folder DTO
 */
export interface CreateFolderDto {
  name: string;
  file?: File[];
}

/**
 * Update Folder DTO
 */
export interface UpdateFolderDto {
  name?: string;
  file?: File[];
}

/**
 * Folder Query Parameters
 */
export interface FolderQueryParameters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * File Query Parameters
 */
export interface FileQueryParameters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  folderId?: string;
  search?: string;
}

/**
 * Folder Entity
 */
export interface Folder {
  id: string;
  name: string;
  fileCount?: number;
  createdAt: string;
  updatedAt: string;
  file?: FolderFile[];
}

/**
 * Folder File Entity
 */
export interface FolderFile {
  id: string;
  name: string;
  size: number;
  mimetype: string;
  url?: string;
  createdAt: string;
  folderId?: string;
}

/**
 * Delete Response
 */
export interface DeleteResponse {
  success: boolean;
  message?: string;
}

/**
 * Download Response (Blob or URL-based)
 */
export type DownloadResponse = Blob | { url: string };
