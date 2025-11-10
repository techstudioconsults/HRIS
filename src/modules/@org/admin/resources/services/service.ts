import { HttpAdapter } from "@/lib/http/http-adapter";

export interface CreateFolderDto {
  name: string;
  file?: File[];
}

export interface UpdateFolderDto {
  name?: string;
  file?: File[];
}

export interface FolderQueryParameters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface FileQueryParameters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  folderId?: string;
  search?: string;
}

export interface Folder {
  id: string;
  name: string;
  fileCount?: number;
  createdAt: string;
  updatedAt: string;
  file?: FolderFile[];
}

export interface FolderFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  createdAt: string;
}

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

export class ResourceService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async createFolder(name: string, file: File[] = []) {
    const headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();
    formData.append("name", name);

    for (const singleFile of file) {
      formData.append("file", singleFile);
    }

    const response = await this.http.post<{ data: Folder }>("/folders", formData, headers);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  // Define default filters as a constant
  DEFAULT_FOLDER_FILTERS: FolderQueryParameters = {
    page: 1,
    limit: 10,
  };

  async getAllFolders(filters?: FolderQueryParameters) {
    // Merge provided filters with defaults
    const mergedFilters: FolderQueryParameters = {
      ...this.DEFAULT_FOLDER_FILTERS,
      ...filters,
    };

    const queryParameters = this.buildQueryParameters(mergedFilters);
    const response = await this.http.get<ApiResponse<Folder>>(`/folders?${queryParameters}`);

    if (response?.status === 200) {
      return response.data;
    }

    return {
      data: {
        items: [],
        total: 0,
        page: mergedFilters.page,
        limit: mergedFilters.limit,
        totalPages: 0,
      },
      success: false,
      message: "Failed to fetch folders",
    };
  }

  async getFolderById(id: string) {
    const response = await this.http.get<{ data: Folder }>(`/folders/${id}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async updateFolder(id: string, data: { name?: string; file?: File[] }) {
    const headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();

    if (data.name) {
      formData.append("name", data.name);
    }

    if (data.file) {
      for (const singleFile of data.file) {
        formData.append("file", singleFile);
      }
    }

    const response = await this.http.patch<{ data: Folder }>(`/folders/${id}`, formData, headers);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async deleteFolder(id: string) {
    const response = await this.http.delete<{ success: boolean; message?: string }>(`/folders/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async addFilesToFolder(folderId: string, files: File[]) {
    const headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();

    for (const file of files) {
      formData.append("file", file);
    }

    formData.append("folderId", folderId);

    const response = await this.http.post<{ data: Folder }>(`/files`, formData, headers);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  // Define default file filters
  DEFAULT_FILE_FILTERS: FileQueryParameters = {
    page: 1,
    limit: 10,
  };

  async getAllFiles(filters?: FileQueryParameters) {
    // Merge provided filters with defaults
    const mergedFilters: FileQueryParameters = {
      ...this.DEFAULT_FILE_FILTERS,
      ...filters,
    };

    const queryParameters = this.buildQueryParameters(mergedFilters);
    const response = await this.http.get<ApiResponse<FolderFile>>(`/files?${queryParameters}`);

    if (response?.status === 200) {
      return response.data;
    }

    return {
      data: {
        items: [],
        total: 0,
        page: mergedFilters.page,
        limit: mergedFilters.limit,
        totalPages: 0,
      },
      success: false,
      message: "Failed to fetch files",
    };
  }
  async removeFileFromFolder(folderId: string, fileId: string) {
    const response = await this.http.delete<{ success: boolean; message?: string }>(
      `/folders/${folderId}/files/${fileId}`,
    );
    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadFile(id: string) {
    const response = await this.http.get(`/file/${id}/download`, {
      responseType: "blob", // Important for file downloads
    });

    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadFolder(id: string) {
    const response = await this.http.get(`/folders/${id}/download`, {
      responseType: "blob", // Important for file downloads
    });

    if (response?.status === 200) {
      return response.data;
    }
  }

  private buildQueryParameters(filters: FolderQueryParameters): string {
    const queryParameters = new URLSearchParams();

    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && value !== "") {
        queryParameters.append(key, value.toString());
      }
    }

    return queryParameters.toString();
  }
}
