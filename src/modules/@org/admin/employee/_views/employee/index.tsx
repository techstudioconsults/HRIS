/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
import ExportAction from "@/components/shared/export-action";
import { Button } from "@/components/ui/button";
import { PageSection, PageWrapper } from "@/lib/animation";
import { useEmployeeSearchParameters } from "@/lib/nuqs/use-employee-search-parameters";
import { AdvancedDataTable } from "@/modules/@org/admin/_components/table/table";
import { Add, Filter } from "iconsax-reactjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import empty1 from "~/images/empty-state.svg";
import { FilterForm } from "../../_components/forms/filter-form";
import { useEmployeeService } from "../../services/use-service";
import { employeeColumn, useEmployeeRowActions } from "../table-data";

// import { Users } from "lucide-react";

export const AllEmployees = () => {
  const router = useRouter();
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

  const { getRowActions, DeleteConfirmationModal } = useEmployeeRowActions();
  const { useGetAllEmployees, useGetAllTeams, useDownloadEmployees } = useEmployeeService();
  const { mutateAsync: downloadEmployees } = useDownloadEmployees();
  const { data: teams = [] } = useGetAllTeams();

  // Apply debounced search to URL (nuqs) and reset page to 1
  useEffect(() => {
    setSearch(debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : null);
    resetToFirstPage();
  }, [debouncedSearch, setSearch, resetToFirstPage]);

  // Build API filters from URL state (nuqs)
  const apiFilters = useMemo(() => getApiFilters(), [getApiFilters]);

  const {
    data: employeeData,
    isLoading,
    refetch,
  } = useGetAllEmployees(apiFilters, {
    keepPreviousData: false, // Don't keep previous data to ensure fresh results
    staleTime: 0, // Always consider data stale to ensure fresh API calls
    cacheTime: 0, // Don't cache data to prevent stale data issues
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnReconnect: true, // Refetch when network reconnects
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  });

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

  useEffect(() => {
    refetch();
  }, [refetch]);

  // URL synchronization is handled by nuqs useQueryState. No manual updates needed here.

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
    <PageWrapper className="space-y-10">
      <PageSection index={0} className="space-y-6">
        <DashboardHeader
          // icon={<Users />}
          title="Employee"
          subtitle="All Employees"
          actionComponent={
            <div>
              <div className="flex items-center gap-2">
                <SearchInput
                  className="border-border h-10 rounded-md border"
                  placeholder="Search employee..."
                  onSearch={handleSearchChange}
                />
                <GenericDropdown
                  contentClassName="bg-background"
                  trigger={
                    <Button
                      className="data-[state=open]:border-border data-[state=open]:text-gray h-10 rounded-md border px-3"
                      variant="primaryOutline"
                    >
                      <Filter className="size-4" />
                      Filter
                    </Button>
                  }
                >
                  <section className="min-w-sm">
                    <FilterForm
                      initialFilters={{
                        search: search || undefined,
                        teamId: teamId || undefined,
                        roleId: roleId || undefined,
                        status: status || undefined,
                        sortBy: sortBy || undefined,
                        limit: limit ? String(limit) : undefined,
                        page: page ? String(page) : undefined,
                      }}
                      onFilterChange={handleFilterChange}
                      teams={teams}
                    />
                  </section>
                </GenericDropdown>
                <ExportAction
                  isDisabled={!employeeData?.data?.items?.length}
                  downloadMutation={async () => {
                    // Use current apiFilters to ensure exported data matches table view
                    const fileData = await downloadEmployees(apiFilters);
                    // If backend returns string CSV, wrap in Blob in ExportAction
                    return fileData as unknown as Blob;
                  }}
                  currentPage={employeeData?.data?.metadata.page}
                  buttonText="Export Employees"
                  fileName="employees"
                />
                <MainButton href="/admin/employees/add-employee" variant="primary" isLeftIconVisible icon={<Add />}>
                  Add Employee
                </MainButton>
              </div>
            </div>
          }
        />

        {isLoading ? (
          <Loading className="!h-[70dvh]" text="Loading employee table." />
        ) : (
          <section>
            {employeeData?.data?.items.length ? (
              <AdvancedDataTable
                data={employeeData.data.items}
                columns={employeeColumn}
                currentPage={employeeData.data.metadata.page}
                totalPages={employeeData.data.metadata.totalPages}
                itemsPerPage={employeeData.data.metadata.limit}
                hasPreviousPage={employeeData.data.metadata.hasPreviousPage}
                hasNextPage={employeeData.data.metadata.hasNextPage}
                onPageChange={handlePageChange}
                rowActions={getRowActions}
                showPagination={true}
                enableRowSelection={true}
                enableColumnVisibility={true}
                enableSorting={true}
                enableFiltering={true}
                mobileCardView={true}
                showColumnCustomization={false}
              />
            ) : (debouncedSearch && debouncedSearch.trim()) ||
              teamId ||
              roleId ||
              (status && status !== "all") ||
              sortBy ? (
              <FilteredEmptyState onReset={handleResetFilters} />
            ) : (
              <EmptyState
                className="bg-background"
                images={[{ src: empty1.src, alt: "No employees", width: 100, height: 100 }]}
                title="No employee yet."
                description="Once you add team members, you'll see their details here, including department, role, work status, and more."
                button={{
                  text: "Add New Employee",
                  onClick: () => router.push("/admin/employees/add-employee"),
                }}
              />
            )}
          </section>
        )}
      </PageSection>

      <DeleteConfirmationModal />
    </PageWrapper>
  );
};
