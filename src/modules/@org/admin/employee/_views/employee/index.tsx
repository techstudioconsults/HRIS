/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import { SuspenseLoading } from "@/components/shared/loading";
import { useEmployeeSearchParameters } from "@/modules/@org/admin/employee/hooks/use-employee-search-parameters";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { EmployeeHeaderSection } from "./components/employee-header-section";
import { EmployeeTableSection } from "./components/employee-table-section";

// import { TableSkeleton } from "../../../_components/table/table-skeleton";

export const AllEmployees = () => {
  const {
    page,
    search,
    teamId,
    roleId,
    status,
    sortBy,
    limit,
    setPage,
    setSearch,
    setTeamId,
    setRoleId,
    setStatus,
    setSortBy,
    setLimit,
    resetFilters,
    resetToFirstPage,
    getApiFilters,
  } = useEmployeeSearchParameters();

  // Local input state (debounced) to throttle URL updates via nuqs
  const [searchInput, setSearchInput] = useState(search || "");
  const [debouncedSearch] = useDebounce(searchInput, 300);

  // Apply debounced search to URL (nuqs) and reset page to 1
  useEffect(() => {
    setSearch(debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : null);
    resetToFirstPage();
  }, [debouncedSearch, setSearch, resetToFirstPage]);

  // Build API filters from URL state (nuqs)
  const apiFilters = useMemo(() => getApiFilters(), [getApiFilters]);

  // Apply filter values to URL (nuqs) and reset page
  const handleFilterChange = useCallback(
    (newFilters: any) => {
      setTeamId(newFilters.teamId ?? null);
      setRoleId(newFilters.roleId ?? null);
      setStatus(newFilters.status ?? null);
      setSortBy(newFilters.sortBy ?? null);
      if (newFilters.limit != null) setLimit(Number(newFilters.limit));
      resetToFirstPage();
    },
    [setTeamId, setRoleId, setStatus, setSortBy, setLimit, resetToFirstPage],
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage],
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchInput(query);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchInput("");
    resetFilters();
  }, [resetFilters]);

  return (
    <section className="space-y-6">
      <EmployeeHeaderSection
        search={search}
        teamId={teamId}
        roleId={roleId}
        status={status}
        sortBy={sortBy}
        limit={limit}
        page={page ?? 1}
        apiFilters={apiFilters}
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
      />

      <EmployeeTableSection
        apiFilters={apiFilters}
        debouncedSearch={debouncedSearch}
        teamId={teamId}
        roleId={roleId}
        status={status}
        sortBy={sortBy}
        onPageChange={handlePageChange}
        onResetFilters={handleResetFilters}
      />
    </section>
  );
};
