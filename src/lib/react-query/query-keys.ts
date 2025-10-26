export const queryKeys = {
  product: {
    list: () => ["product", "list"] as const,
    details: (id: string) => ["product", "details", id] as const,
    filtered: (filters: IFilters) => ["product", "filtered", filters] as const,
  },
  employee: {
    list: (filters?: IFilters) => ["employee", "list", filters] as const,
    details: (id: string) => ["employee", "details", id] as const,
    teams: () => ["employee", "teams"] as const,
    download: () => ["employee", "download"] as const,
  },

  folder: {
    list: (filters?: IFilters) => ["folder", "list", filters] as const,
    details: (id: string) => ["folder", "details", id] as const,
    files: (folderId: string) => ["folder", "files", folderId] as const,
    download: (id: string) => ["folder", "download", id] as const,
  },
  file: {
    list: (filters?: IFilters) => ["file", "list", filters] as const,
    details: (id: string) => ["file", "details", id] as const,
    download: (id: string) => ["file", "download", id] as const,
    // Additional file-specific query keys if needed:
    recent: (limit?: number) => ["file", "recent", limit] as const,
    byType: (fileType: string, filters?: IFilters) => ["file", "byType", fileType, filters] as const,
  },
  team: {
    list: (filters?: IFilters) => ["teams", "list", filters] as const,
    details: (id: string) => ["teams", "detail", id] as const,
    download: (filters?: IFilters) => ["teams", "download", filters] as const,
  },
  payroll: {
    list: (filters?: IFilters) => ["payrolls", "list", filters] as const,
    details: (id: string) => ["payrolls", "detail", id] as const,
    download: (filters?: IFilters) => ["payrolls", "download", filters] as const,
  },
  // Add other domains as needed
};
