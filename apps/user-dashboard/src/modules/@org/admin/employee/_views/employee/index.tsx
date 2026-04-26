'use client';

import { useEmployeeSearchParameters } from '@/modules/@org/admin/employee/hooks/use-employee-search-parameters';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { EmployeeHeaderSection } from './components/employee-header-section';
import { EmployeeTableSection } from './components/employee-table-section';

export const AllEmployees = () => {
  const {
    search,
    teamId,
    roleId,
    status,
    sortBy,
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
  const [searchInput, setSearchInput] = useState(search || '');
  const [debouncedSearch] = useDebounce(searchInput, 300);

  // Apply debounced search to URL (nuqs) and reset page to 1
  useEffect(() => {
    const trimmedSearch =
      debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : null;
    // Only update if value actually changed to prevent render loop
    if (search !== trimmedSearch) {
      setSearch(trimmedSearch);
      resetToFirstPage();
    }
  }, [debouncedSearch, search, setSearch, resetToFirstPage]);

  // Build API filters from URL state (nuqs)
  const apiFilters = useMemo(() => getApiFilters(), [getApiFilters]);

  // Apply filter values to URL (nuqs) and reset page
  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      setTeamId(newFilters.teamId ?? null);
      setRoleId(newFilters.roleId ?? null);
      setStatus(
        (newFilters.status ?? null) as
          | 'all'
          | 'active'
          | 'inactive'
          | 'pending'
          | null
      );
      setSortBy(newFilters.sortBy ?? null);
      if (newFilters.limit != null) setLimit(Number(newFilters.limit));
      resetToFirstPage();
    },
    [setTeamId, setRoleId, setStatus, setSortBy, setLimit, resetToFirstPage]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
    },
    [setPage]
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchInput(query);
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    resetFilters();
  }, [resetFilters]);

  return (
    <section className="space-y-6">
      <EmployeeHeaderSection
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
