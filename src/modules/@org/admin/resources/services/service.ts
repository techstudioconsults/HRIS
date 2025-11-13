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

export class ResourceService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  // =============================
  // File Operations
  // =============================

  async addFilesToFolder(folderId: string | undefined, files: File[]) {
    const headers = { "Content-Type": "multipart/form-data" };
    const formData = new FormData();

    for (const file of files) {
      formData.append("file", file);
    }

    if (folderId) {
      formData.append("folderId", folderId);
    }

    const response = await this.http.post<{ data: Folder }>("/files", formData, headers);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  async getAllFiles(filters: FileQueryParameters = {}) {
    const response = await this.http.get<ApiResponse<FolderFile>>("/files", {
      ...filters,
    });
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getFilesByFolderId(folderId: string, filters: FileQueryParameters = {}) {
    const response = await this.http.get<ApiResponse<FolderFile>>("/files", {
      ...filters,
      folderId,
    });
    if (response?.status === 200) {
      return response.data;
    }
  }

  // async removeFileFromFolder(folderId: string, fileId: string) {
  //   const response = await this.http.delete<DeleteResponse>(`/folders/${folderId}/files/${fileId}`);
  //   if (response?.status === 200) {
  //     return response.data;
  //   }
  // }

  async removeFileByID(fileId: string) {
    const response = await this.http.delete<DeleteResponse>(`/files/${fileId}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadFile(id: string) {
    const response = await this.http.get<Blob>(`/files/${id}/download`);
    if (response?.status === 200) {
      return response.data as DownloadResponse;
    }
  }

  // =============================
  // Folder Operations
  // =============================

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

  async getAllFolders(filters: FolderQueryParameters = {}) {
    const response = await this.http.get<ApiResponse<Folder>>("/folders", {
      ...filters,
    });
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getFolderById(id: string) {
    const response = await this.http.get<{ data: Folder }>(`/folders/${id}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async updateFolder(id: string, data: UpdateFolderDto) {
    const response = await this.http.patch<{ data: Folder }>(`/folders/${id}`, {
      name: data.name,
    });
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async deleteFolder(id: string) {
    const response = await this.http.delete<DeleteResponse>(`/folders/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadFolder(id: string) {
    const response = await this.http.get<Blob>(`/folders/${id}/download`, {
      responseType: "blob",
    });
    if (response?.status === 200) {
      return response.data as DownloadResponse;
    }
  }
}
