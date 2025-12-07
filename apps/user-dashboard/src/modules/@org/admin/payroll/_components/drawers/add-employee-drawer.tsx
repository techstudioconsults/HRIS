"use client";

import { queryKeys } from "@/lib/react-query/query-keys";
import { useEmployeeSearchParameters } from "@/modules/@org/admin/employee/hooks/use-employee-search-parameters";
import { SearchInput } from "@/modules/@org/shared/search-input";
import { Button } from "@workspace/ui/components/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@workspace/ui/components/drawer";
import { AdvancedDataTable, AlertModal, BackButton, EmptyState, FilteredEmptyState, GenericDropdown } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { Filter } from "iconsax-reactjs";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import Loading from "../../../../../../../note/loading";
import { FilterForm } from "../../../employee/_components/forms/filter-form";
import { useEmployeeService } from "../../../employee/services/use-service";
import { usePayrollService } from "../../services/use-service";
import { usePayrollStore } from "../../stores/payroll-store";

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

// Initial filter values - removed as we now use URL state management

interface AddEmployeeDrawerProperties {
  payrollId: string | null;
  /**
   * Indicates that payslips have been generated for the selected payroll.
   * Used to avoid calling the "absent" endpoint before payslips exist.
   */
  hasPayslips: boolean;
}

export const AddEmployeeDrawer = ({ payrollId, hasPayslips }: AddEmployeeDrawerProperties) => {
  const { showAddEmployeeToPayrollModal, setShowAddEmployeeModal } = usePayrollStore();
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
    // getApiFilters,
  } = useEmployeeSearchParameters();

  const [searchInput, setSearchInput] = useState(search || "");
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const [isSuccessAlertOpen, setIsSuccessAlertOpen] = useState(false);
  const [addedEmployee, setAddedEmployee] = useState<Employee | null>(null);
  const [loadingEmployeeId, setLoadingEmployeeId] = useState<string | null>(null);

  const { useCreatePayslip } = usePayrollService();
  const { mutateAsync: createPayslip } = useCreatePayslip({
    // When an employee is re-included (payslip created), refresh:
    // - payslips for this payroll (main table)
    // - suspended employees for this payroll (this drawer list)
    invalidateQueries: (_result: unknown, variables: { payrollId: string }) => {
      const targetPayrollId = variables?.payrollId;

      if (!targetPayrollId) {
        return;
      }

      return [
        queryKeys.payroll.payslips(targetPayrollId, {}),
        queryKeys.employee.suspendedByPayroll(targetPayrollId, {}),
      ];
    },
  });
  const { useGetSuspendedEmployeesByPayroll, useGetAllTeams } = useEmployeeService();
  const { data: teams = [] } = useGetAllTeams();

  useEffect(() => {
    setSearch(debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : null);
    resetToFirstPage();
  }, [debouncedSearch, setSearch, resetToFirstPage]);

  // Build API filters from URL parameters
  const apiFilters: Filters = {
    ...(search && { search }),
    ...(teamId && { teamId }),
    ...(roleId && { roleId }),
    ...(status && status !== "all" && { status }),
    ...(sortBy && { sortBy }),
    ...(limit && { limit }),
    ...(page && { page }),
  };

  const { data: employeesData, isLoading } = useGetSuspendedEmployeesByPayroll(payrollId || "", apiFilters, {
    // Ensure payslips are generated before calling the "absent" endpoint
    enabled: !!payrollId && hasPayslips,
  });

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

  const handleAddEmployee = (employee: Employee) => {
    setAddedEmployee(employee);
    setLoadingEmployeeId(employee.id);
    createPayslip(
      { payrollId: payrollId || "", employeeId: employee.id },
      {
        onSuccess: () => {
          setIsSuccessAlertOpen(true);
          setLoadingEmployeeId(null);
        },
        onError: () => {
          setLoadingEmployeeId(null);
        },
      },
    );
  };

  const handleSuccessAlertClose = () => {
    setIsSuccessAlertOpen(false);
    setAddedEmployee(null);
  };

  const employeeColumns: IColumnDefinition<Employee>[] = [
    {
      accessorKey: "firstName",
      header: "Employee Name",
      render: (_, employee: Employee) => (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium">{`${employee.firstName} ${employee.lastName}`}</span>
            <span className="text-xs text-gray-500">{employee.email}</span>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "employmentDetails",
      header: "Role",
      render: (_, employee: Employee) => (
        <div className="text-sm text-gray-500">{employee.employmentDetails?.role?.name || "N/A"}</div>
      ),
    },
    // {
    {
      accessorKey: "id",
      header: "Action",
      render: (_value, row) => (
        <MainButton
          variant="primaryOutline"
          size="sm"
          isLoading={loadingEmployeeId === row.id}
          onClick={(event) => {
            event.stopPropagation();
            handleAddEmployee(row);
          }}
        >
          Re-include
        </MainButton>
      ),
    },
  ];

  return (
    <>
      <Drawer open={showAddEmployeeToPayrollModal} onOpenChange={setShowAddEmployeeModal} direction="right">
        <DrawerContent className="h-full w-full p-4 sm:!max-w-3xl">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center gap-10">
              <BackButton />
              <div>
                <DrawerTitle className="text-xl font-semibold">Excluded Employees - Performance Bonus</DrawerTitle>
                <DrawerDescription>
                  These employees are currently excluded from receiving the Performance Bonus. You can re-include them
                  anytime.
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>

          <section className="flex-1 space-y-6 overflow-y-auto p-6">
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
          </section>
        </DrawerContent>
      </Drawer>

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
