"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
import { AdvancedDataTable, type IColumnDefinition } from "@/components/shared/table/table";
import { Button } from "@/components/ui/button";
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

// Initial filter values
const initialFilters: FilterValues = {
  search: undefined,
  teamId: undefined,
  roleId: undefined,
  status: undefined,
  sortBy: undefined,
  limit: undefined,
  page: "1",
};

export const AddEmployeeModal = ({ open, onOpenChange }: AddEmployeeModalProperties) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [debouncedFilters] = useDebounce(filters, 300);

  const { useGetAllEmployees, useGetAllTeams } = useEmployeeService();
  const { data: teams = [] } = useGetAllTeams();

  // Create stable API filters object - include search in debouncedFilters instead of separate
  const apiFilters = useMemo(
    () => ({
      ...debouncedFilters,
      // Always include search parameter - empty string means no search filter
      search: debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
      page: debouncedFilters.page ? Number(debouncedFilters.page) : 1,
      limit: debouncedFilters.limit ? Number(debouncedFilters.limit) : 10,
    }),
    [debouncedFilters, debouncedSearch], // Add debouncedSearch to dependencies
  );

  // Fetch employees with filters - React Query will refetch when apiFilters changes
  const { data: employeesData, isLoading, refetch } = useGetAllEmployees(apiFilters);

  // Stable filter change handler
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters((previous: FilterValues) => {
      // Only update if something actually changed
      if (JSON.stringify(previous) !== JSON.stringify(newFilters)) {
        return newFilters;
      }
      return previous;
    });
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setFilters((previous: FilterValues) => ({ ...previous, page: page.toString() }));
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
    setFilters((previous: FilterValues) => ({ ...previous, page: "1" }));
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

  // Refetch data when modal opens to ensure fresh data
  useEffect(() => {
    if (open && refetch) {
      refetch();
    }
  }, [open, refetch]);

  const handleAddEmployee = (employee: Employee) => {
    // TODO: Handle adding employee to payroll
    // eslint-disable-next-line no-console
    console.log("Adding employee:", employee);
    onOpenChange(false);
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
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={<div />} // Hidden trigger since we're controlling the modal externally
      title="Add Employees to Payroll"
      description="Select employees who are currently excluded or not added to this payroll cycle. Use search or filters to quickly find employees."
      className="!max-w-4xl p-10"
      wrapperClassName="text-left"
    >
      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <SearchInput className="h-12 w-full" placeholder="Search employee..." onSearch={handleSearchChange} />
          </div>
          <div>
            <GenericDropdown
              contentClassName="bg-background"
              trigger={
                <Button
                  className="border-gray-75 bg-background flex h-12 items-center rounded-md border-1 px-3 text-black dark:text-white"
                  size="lg"
                >
                  <Filter className="size-4" />
                  <span>Filter</span>
                </Button>
              }
            >
              <section className="min-w-sm">
                <FilterForm initialFilters={filters} onFilterChange={handleFilterChange} teams={teams} />
              </section>
            </GenericDropdown>
          </div>
        </div>

        {/* Employee Table */}
        <div className="rounded-lg">
          {isLoading ? (
            <Loading text={`Loading employees...`} className={`w-fill h-fit p-20`} />
          ) : (
            <section>
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
                  enableRowSelection={false}
                  enableColumnVisibility={false}
                  enableSorting={true}
                  enableFiltering={false}
                  mobileCardView={false}
                  showColumnCustomization={false}
                />
              ) : (debouncedSearch && debouncedSearch.trim()) ||
                Object.values(filters).some((value) => value && value !== "1") ? (
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
  );
};
