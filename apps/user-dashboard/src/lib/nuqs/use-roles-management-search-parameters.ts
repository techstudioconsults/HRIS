"use client";

import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";

/**
 * Roles management table is rendered inside the Settings page.
 * These query keys are namespaced to avoid collisions with other tables on the same route.
 */
export const useRolesManagementSearchParameters = () => {
  const [page, setPage] = useQueryState("rolesPage", parseAsInteger);
  const [search, setSearch] = useQueryState("rolesSearch", parseAsString);
  const [teamId, setTeamId] = useQueryState("rolesTeamId", parseAsString);
  const [sortBy, setSortBy] = useQueryState("rolesSortBy", parseAsString);
  const [limit, setLimit] = useQueryState("rolesLimit", parseAsInteger.withDefault(10));

  return {
    page,
    search,
    teamId,
    sortBy,
    limit,

    setPage,
    setSearch: useCallback(
      (value: string | null) => {
        if (!value || value.trim() === "") {
          setSearch(null);
        } else {
          setSearch(value);
        }
      },
      [setSearch],
    ),
    setTeamId,
    setSortBy: useCallback(
      (value: string | null) => {
        if (!value || value.trim() === "") {
          setSortBy(null);
        } else {
          setSortBy(value);
        }
      },
      [setSortBy],
    ),
    setLimit,

    resetFilters: useCallback(() => {
      setSearch(null);
      setTeamId(null);
      setSortBy(null);
      setPage(null);
      setLimit(10);
    }, [setSearch, setTeamId, setSortBy, setPage, setLimit]),

    resetToFirstPage: useCallback(() => {
      setPage(null);
    }, [setPage]),
  };
};

