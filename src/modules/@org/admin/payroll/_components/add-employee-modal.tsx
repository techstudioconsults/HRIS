"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { useEmployeeSearchParameters } from "@/lib/nuqs/use-employee-search-parameters";
import { AdvancedDataTable, type IColumnDefinition } from "@/modules/@org/admin/_components/table/table";
import { Filter } from "iconsax-reactjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { FilterForm } from "../../employee/_components/forms/filter-form";
import { useEmployeeService } from "../../employee/services/use-service";

// Define FilterValues interface to match FilterForm
interface FilterValues {
  search?: string;
  teamId?: string;
  roleId?: string;
  status?: string;
  sortBy?: string;
  limit?: string;
  page?: string;
}

interface AddEmployeeModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Initial filter values - removed as we now use URL state management

export const AddEmployeeModal = ({ open, onOpenChange }: AddEmployeeModalProperties) => {
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

  // Alert modal state
  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [addedEmployee, setAddedEmployee] = useState<Employee | null>(null);

  const { useGetAllEmployees, useGetAllTeams } = useEmployeeService();
  const { data: teams = [] } = useGetAllTeams();

  // Apply debounced search to URL (nuqs) and reset page to 1
  useEffect(() => {
    setSearch(debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : null);
    resetToFirstPage();
  }, [debouncedSearch, setSearch, resetToFirstPage]);

  // Build API filters from URL state (nuqs)
  const apiFilters = useMemo(() => getApiFilters(), [getApiFilters]);

  // Fetch employees with filters - React Query will refetch when apiFilters changes
  const {
    data: employeesData,
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
    (newFilters: FilterValues) => {
      setTeamId(newFilters.teamId ?? null);
      setRoleId(newFilters.roleId ?? null);
      setStatus((newFilters.status as "all" | "active" | "inactive" | "pending") ?? null);
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

  // Refetch data when modal opens to ensure fresh data
  useEffect(() => {
    if (open && refetch) {
      refetch();
    }
  }, [open, refetch]);

  const handleAddEmployee = (employee: Employee) => {
    // Store the employee data for the success alert
    setAddedEmployee(employee);

    // Close the main modal
    onOpenChange(false);

    // Show success alert modal
    setIsSuccessAlertOpen(true);
  };

  const handleSuccessAlertClose = () => {
    setIsSuccessAlertOpen(false);
    setAddedEmployee(null);
  };

  // Table columns for employee selection
  const employeeColumns: IColumnDefinition<Employee>[] = [
    {
      accessorKey: "firstName",
      header: "Employee Name",
      render: (_, employee: Employee) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="font-medium">{`${employee.firstName} ${employee.lastName}`}</span>
            <span className="text-xs text-gray-500">{employee.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "employmentDetails",
      header: "Role",
      render: (_, employee: Employee) => (
        <div className="text-gray-600">{employee.employmentDetails?.role?.name || "N/A"}</div>
      ),
    },
    {
      accessorKey: "employmentDetails",
      header: "Department",
      render: (_, employee: Employee) => (
        <div className="text-gray-600">{employee.employmentDetails?.team?.name || "N/A"}</div>
      ),
    },
    {
      accessorKey: "id",
      header: "Action",
      render: (_value, row) => (
        <MainButton
          variant="outline"
          size="sm"
          className="border-blue-500 text-blue-500 hover:bg-blue-50"
          onClick={(event) => {
            event.stopPropagation();
            handleAddEmployee(row);
          }}
        >
          Add
        </MainButton>
      ),
    },
  ];

  return (
    <>
      <ReusableDialog
        open={open}
        onOpenChange={onOpenChange}
        trigger={<div />} // Hidden trigger since we're controlling the modal externally
        title="Add Employees to Payroll"
        description="Select employees who are currently excluded or not added to this payroll cycle. Use search or filters to quickly find employees."
        className="!max-w-4xl scale-[0.75] p-10"
        wrapperClassName="text-left"
      >
        <div className="space-y-6">
          {/* Search and Filter Section */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <SearchInput
                className="border-border h-12 w-full rounded-md border shadow"
                placeholder="Search employee..."
                onSearch={handleSearchChange}
              />
            </div>
            <div>
              <GenericDropdown
                contentClassName="bg-background"
                trigger={
                  <Button
                    variant={"ghost"}
                    className="border-border bg-background flex h-12.5 items-center rounded-md border px-3 text-black shadow dark:text-white"
                    size="lg"
                  >
                    <Filter className="size-4" />
                    <span>Filter</span>
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
            </div>
          </div>

          {/* Employee Table */}
          <div className="rounded-lg">
            {isLoading ? (
              <Loading text={`Loading employees...`} className={`w-fill h-fit p-20`} />
            ) : (
              <section className="overflow-y-auto">
                {employeesData?.data?.items.length ? (
                  <AdvancedDataTable
                    data={employeesData.data.items}
                    columns={employeeColumns}
                    currentPage={employeesData.data.metadata.page}
                    totalPages={employeesData.data.metadata.totalPages}
                    itemsPerPage={employeesData.data.metadata.limit}
                    hasPreviousPage={employeesData.data.metadata.hasPreviousPage}
                    hasNextPage={employeesData.data.metadata.hasNextPage}
                    onPageChange={handlePageChange}
                    showPagination={true}
                    enableRowSelection={true}
                    enableColumnVisibility={false}
                    enableSorting={true}
                    enableFiltering={false}
                    mobileCardView={false}
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
                    images={[{ src: "/images/empty-state.svg", alt: "No employees found", width: 100, height: 100 }]}
                    title="No employees found."
                    description="No employees are available to add to payroll. Try adjusting your search or filters."
                    titleClassName="text-xl font-bold"
                  />
                )}
              </section>
            )}
          </div>
        </div>
      </ReusableDialog>

      {/* Success Alert Modal */}
      <AlertModal
        isOpen={isSuccessAlertOpen}
        onClose={handleSuccessAlertClose}
        type="success"
        title="Added Successfully"
        description={`Employee "${addedEmployee?.firstName} ${addedEmployee?.lastName}" has been added to payroll successfully`}
        confirmText="Continue"
        showCancelButton={false}
        autoClose={false}
      />
    </>
  );
};
