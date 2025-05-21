export const queryKeys = {
  product: {
    list: () => ["product", "list"] as const,
    details: (id: string) => ["product", "details", id] as const,
    filtered: (filters: IFilters) => ["product", "filtered", filters] as const,
  },
  // Add other domains as needed
};
