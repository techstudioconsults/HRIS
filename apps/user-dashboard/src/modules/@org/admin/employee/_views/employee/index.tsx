'use client';

import { useEmployeeSearchParameters } from '@/modules/@org/admin/employee/hooks/use-employee-search-parameters';
import { Icon } from '@workspace/ui/lib/icons/icon';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';

import { EmployeeHeaderSection } from './components/employee-header-section';
import { EmployeeTableSection } from './components/employee-table-section';
import { routes } from '@/lib/routes/routes';

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

  const [isImportBannerVisible, setIsImportBannerVisible] = useState(true);

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

      {isImportBannerVisible && (
        <section className="overflow-hidden rounded-xl border border-dashed border-success-200/50 bg-linear-to-r from-success-50 via-success-50/80 to-success-50/30 p-5">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-success to-success-400 shadow-sm">
              <Icon name="FileSpreadsheet" size={24} className="text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  Import Employee Records via Spreadsheet
                </h3>
                <span className="shrink-0 rounded-md bg-success-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success-500">
                  Experimental
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Quickly onboard employees in bulk by uploading a .xlsx or .csv
                file. Map columns, preview data, and import records all in one
                flow.
              </p>
              <Link
                href={routes.admin.employees.bulkImport()}
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-success-500 underline-offset-4 hover:text-success-400 hover:underline"
              >
                Try it out
                <Icon name="ChevronRight" size={14} />
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setIsImportBannerVisible(false)}
              aria-label="Dismiss import banner"
              className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-success-50 hover:text-success"
            >
              <Icon name="CloseCircle" size={18} />
            </button>
          </div>
        </section>
      )}

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
