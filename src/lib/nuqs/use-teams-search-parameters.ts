"use client";

import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useCallback } from "react";

export const useTeamsSearchParameters = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringEnum(["all", "active", "inactive"]).withDefault("all"),
  );
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString);
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));

  return {
    // Current values
    page: page ?? 1,
    search: (search as string) ?? "",
    status: (status as string) ?? "all",
    sortBy: (sortBy as string) ?? "",
    limit: (limit as number) ?? 10,

    // Setters
    setPage,
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
    setStatus,
    setSortBy,
    setLimit,

    // Utility functions
    resetFilters: useCallback(() => {
      setSearch(null);
      setStatus(null);
      setSortBy(null);
      setPage(null);
      setLimit(10); // Always reset to 10
    }, [setSearch, setStatus, setSortBy, setPage, setLimit]),

    resetToFirstPage: useCallback(() => {
      setPage(null);
    }, [setPage]),

    // Get API filters (always includes limit and page, excludes empty values)
    getApiFilters: useCallback(() => {
      const currentPage = page ?? 1;
      const filters: Record<string, string | number> = {
        limit: Math.min(limit, 10), // Always include limit, max 10
        page: currentPage, // Always include page for API
      };

      if (search && search.trim()) {
        filters.search = search.trim();
      }
      if (status && status !== "all") {
        filters.status = status;
      }
      if (sortBy) {
        filters.sortBy = sortBy;
      }

      // eslint-disable-next-line no-console
      console.log("getApiFilters called with page:", page, "currentPage:", currentPage, "filters:", filters);
      return filters;
    }, [search, status, sortBy, limit, page]),

    // Get URL parameters (excludes page=1 from URL but includes in API)
    getUrlParameters: useCallback(() => {
      const parameters: Record<string, string> = {};

      if (search && search.trim()) {
        parameters.search = search.trim();
      }
      if (status && status !== "all") {
        parameters.status = status;
      }
      if (sortBy) {
        parameters.sortBy = sortBy;
      }
      // Only include page in URL if it's not 1
      if (page && page !== 1) {
        parameters.page = page.toString();
      }

      return parameters;
    }, [search, status, sortBy, page]),
  };
};
