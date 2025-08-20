"use client";

import { productSearchParameters } from "@/lib/nuqs/product-searchparams";
import { useQueryState } from "nuqs";

export const useProductSearchParameters = () => {
  const [page, setPage] = useQueryState("page", productSearchParameters.page);
  const [perPage, setPerPage] = useQueryState("perPage", productSearchParameters.perPage);
  const [search, setSearch] = useQueryState("search", productSearchParameters.search);
  const [status, setStatus] = useQueryState("status", productSearchParameters.status);

  return {
    // Current values
    page: page ?? 1,
    perPage: perPage ?? 10,
    search: search ?? "",
    status: status ?? "all",

    // Setters
    setPage,
    setPerPage,
    setSearch,
    setStatus,

    // Utility functions
    resetFilters: () => {
      setSearch(null);
      setStatus(null);
      setPage(null);
    },

    resetToFirstPage: () => {
      setPage(null);
    },
  };
};
