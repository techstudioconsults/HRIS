/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
import ExportAction from "@/components/shared/export-action";
import { AdvancedDataTable } from "@/components/shared/table/table";
import { Button } from "@/components/ui/button";
import { updateQueryParamameters } from "@/hooks/use-search-parameters";
import { Add, Filter } from "iconsax-reactjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import empty1 from "~/images/empty-state.svg";
import { FilterForm } from "../../_components/forms/filter-form";
import { useEmployeeService } from "../../services/use-service";
import { employeeColumn, useEmployeeRowActions } from "../table-data";

export const AllEmployees = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  // Initialize state from URL params
  const initialFilters = {
    search: searchParameters.get("search") || undefined,
    teamId: searchParameters.get("teamId") || undefined,
    roleId: searchParameters.get("roleId") || undefined,
    status: searchParameters.get("status") || undefined,
    sortBy: searchParameters.get("sortBy") || undefined,
    limit: searchParameters.get("limit") || undefined,
    page: searchParameters.get("page") || "1",
  };

  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState<any>(initialFilters);
  const [debouncedFilters] = useDebounce(filters, 300);

  const { getRowActions, DeleteConfirmationModal } = useEmployeeRowActions();
  const { useGetAllEmployees, useGetAllTeams, useDownloadEmployees } = useEmployeeService();
  const { refetch: downloadProducts } = useDownloadEmployees();
  const { data: teams = [] } = useGetAllTeams();

  // Create stable API filters object - include search in debouncedFilters instead of separate
  const apiFilters = useMemo(
    () => ({
      ...debouncedFilters,
      // Always include search parameter - empty string means no search filter
      search: debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
      page: debouncedFilters.page ? Number(debouncedFilters.page) : 1,
    }),
    [debouncedFilters, debouncedSearch], // Add debouncedSearch to dependencies
  );

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

  // Stable filter change handler
  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters((previous: any) => {
      // Only update if something actually changed
      if (JSON.stringify(previous) !== JSON.stringify(newFilters)) {
        return newFilters;
      }
      return previous;
    });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  // Update URL when filters change
  useEffect(() => {
    const parameters = {
      // Only include search in URL if it has actual content
      ...(debouncedSearch && debouncedSearch.trim() && { search: debouncedSearch.trim() }),
      ...(debouncedFilters.teamId && { teamId: debouncedFilters.teamId }),
      ...(debouncedFilters.roleId && { roleId: debouncedFilters.roleId }),
      ...(debouncedFilters.status && { status: debouncedFilters.status }),
      ...(debouncedFilters.sortBy && { sortBy: debouncedFilters.sortBy }),
      page: debouncedFilters.page || "1",
    };

    updateQueryParamameters(router, pathname, searchParameters, parameters);
  }, [debouncedSearch, debouncedFilters, router, pathname, searchParameters]);

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters((previous: any) => ({ ...previous, page: page.toString() }));
      // Force refetch when page changes to ensure fresh data
      if (refetch) {
        refetch();
      }
    },
    [refetch],
  );

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    // Reset to first page when search changes
    setFilters((previous: any) => ({ ...previous, page: "1" }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchQuery("");
    setFilters({
      search: undefined,
      teamId: undefined,
      roleId: undefined,
      status: undefined,
      sortBy: undefined,
      limit: undefined,
      page: "1",
    });
  }, []);

  return (
    <section className="space-y-10">
      <section className="space-y-4">
        <section className="flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-2xl font-bold">Employee</h1>
            <p>All Employees</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <SearchInput className="h-12" placeholder="Search employee..." onSearch={handleSearchChange} />
              <GenericDropdown
                contentClassName="bg-background"
                trigger={
                  <Button
                    className="border-gray-75 bg-background h-12 rounded-md border-1 px-3 text-black dark:text-white"
                    size="lg"
                  >
                    <Filter className="size-5" />
                    Filter
                  </Button>
                }
              >
                <section className="min-w-sm">
                  <FilterForm initialFilters={filters} onFilterChange={handleFilterChange} teams={teams} />
                </section>
              </GenericDropdown>
              <ExportAction
                downloadMutation={async (filters) => {
                  const { data } = await downloadProducts(filters);
                  return data as Blob;
                }}
                currentPage={undefined}
                dateRange={undefined}
                status={undefined}
                buttonText="Export Employees"
                fileName="Product"
                size="xl"
              />
              <MainButton
                href="/admin/employees/add-employee"
                variant="primary"
                isLeftIconVisible
                size="xl"
                icon={<Add />}
              >
                Add Employee
              </MainButton>
            </div>
          </div>
        </section>

        {isLoading ? (
          <Loading text={`Loading employees table...`} className={`w-fill h-fit p-20`} />
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
                enableDragAndDrop={true}
                enableRowSelection={true}
                enableColumnVisibility={true}
                enableSorting={true}
                enableFiltering={true}
                mobileCardView={true}
                showColumnCustomization={false}
              />
            ) : (debouncedSearch && debouncedSearch.trim()) ||
              Object.values(filters).some((value) => value && value !== "1") ? (
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
      </section>

      <DeleteConfirmationModal />
    </section>
  );
};
