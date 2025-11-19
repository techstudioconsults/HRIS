"use client";

import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from "nuqs";
import { useCallback } from "react";

export const useEmployeeSearchParameters = () => {
  const [page, setPage] = useQueryState("page", parseAsInteger);
  const [search, setSearch] = useQueryState("search", parseAsString);
  const [teamId, setTeamId] = useQueryState("teamId", parseAsString);
  const [roleId, setRoleId] = useQueryState("roleId", parseAsString);
  const [status, setStatus] = useQueryState(
    "status",
    parseAsStringEnum(["all", "active", "inactive", "pending"]).withDefault("all"),
  );
  const [sortBy, setSortBy] = useQueryState("sortBy", parseAsString);
  const [limit, setLimit] = useQueryState("limit", parseAsInteger.withDefault(10));

  return {
    // Current values
    page,
    search,
    teamId,
    roleId,
    status,
    sortBy,
    limit,

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
    setTeamId,
    setRoleId,
    setStatus,
    setSortBy,
    setLimit,

    // Utility functions
    resetFilters: useCallback(() => {
      setSearch(null);
      setTeamId(null);
      setRoleId(null);
      setStatus(null);
      setSortBy(null);
      setPage(null);
      setLimit(10); // Always reset to 10
    }, [setSearch, setTeamId, setRoleId, setStatus, setSortBy, setPage, setLimit]),

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
      if (teamId) {
        filters.teamId = teamId;
      }
      if (roleId) {
        filters.roleId = roleId;
      }
      if (status && status !== "all") {
        filters.status = status;
      }
      if (sortBy) {
        filters.sortBy = sortBy;
      }

      return filters;
    }, [search, teamId, roleId, status, sortBy, limit, page]),
  };
};
