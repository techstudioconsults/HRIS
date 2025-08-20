"use client";

import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useCallback } from "react";

export const useDashboardSearchParameters = () => {
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [perPage, setPerPage] = useQueryState("perPage", parseAsInteger.withDefault(10));
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));
  const [orderStatus, setOrderStatus] = useQueryState(
    "status",
    parseAsStringEnum(["all", "completed", "pending", "cancelled"]).withDefault("all"),
  );
  const [productStatus, setProductStatus] = useQueryState(
    "status",
    parseAsStringEnum(["all", "published", "draft"]).withDefault("all"),
  );

  return {
    // Current values
    page: page ? Number.parseInt(page) : 1,
    perPage: (perPage as number) ?? 10,
    search: (search as string) ?? "",
    limit: (limit as number) ?? 10,
    orderStatus: (orderStatus as string) ?? "all",
    productStatus: (productStatus as string) ?? "all",
    // Setters
    setPage,
    setPerPage,
    setLimit,
    setSearch: useCallback(
      (value: string | null) => {
        // Remove search parameter if value is empty
        if (!value || value.trim() === "") {
          setSearch(null);
        } else {
          setSearch(value);
        }
      },
      [setSearch],
    ),
    setOrderStatus,
    setProductStatus,
    // Utility functions
    resetFilters: () => {
      setSearch(null);
      setOrderStatus(null);
      setPage(null);
      setLimit(10);
      setProductStatus(null);
    },

    resetToFirstPage: useCallback(() => {
      setPage(null);
    }, [setPage]),
  };
};
