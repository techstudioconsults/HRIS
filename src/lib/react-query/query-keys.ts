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
  // Add other domains as needed
};
