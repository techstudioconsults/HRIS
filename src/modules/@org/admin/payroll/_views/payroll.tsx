/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
import ExportAction from "@/components/shared/export-action";
import { ComboBox } from "@/components/shared/select-dropdown/combo-box";
import { AdvancedDataTable } from "@/components/shared/table/table";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { updateQueryParamameters } from "@/hooks/use-search-parameters";
import { Eye, EyeSlash, Filter } from "iconsax-reactjs";
import { MoreVertical } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import empty1 from "~/images/empty-state.svg";
import { AddEmployeeModal } from "../_components/add-employee-modal";
import { AddPayrollDrawer } from "../_components/add-employee-payroll-review-drawer.tsx";
import { FundWalletFormModal } from "../_components/forms/fund-wallet-form-modal";
import { PayrollSetupModal } from "../_components/payroll-setup-modal";
import { SchedulePayrollDrawer } from "../_components/schedule-payroll-drawer";
import { DashboardCard } from "../../dashboard/_components/dashboard-card";
import { FilterForm } from "../../employee/_components/forms/filter-form";
import { useEmployeeService } from "../../employee/services/use-service";
import { payrollColumn, usePayrollRowActions } from "./table-data";

const PayrollView = () => {
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

  const [showSetupModal, setShowSetupModal] = useState(true);
  const [showFundWalletModal, setShowFundWalletModal] = useState(false);
  const [showScheduleDrawer, setShowScheduleDrawer] = useState(false);
  const [showPayrollDrawer, setShowPayrollDrawer] = useState(false);
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [isNetPayVisible, setIsNetPayVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialFilters.search || "");
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState<any>(initialFilters);
  const [debouncedFilters] = useDebounce(filters, 300);

  const { getRowActions } = usePayrollRowActions();
  const { useGetAllTeams } = useEmployeeService();
  const { data: teams = [] } = useGetAllTeams();

  // Create stable API filters object - include search in debouncedFilters instead of separate
  // Note: This will be used when real payroll API is implemented
  // const apiFilters = useMemo(
  //   () => ({
  //     ...debouncedFilters,
  //     // Always include search parameter - empty string means no search filter
  //     search: debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
  //     page: debouncedFilters.page ? Number(debouncedFilters.page) : 1,
  //   }),
  //   [debouncedFilters, debouncedSearch],
  // );

  // TODO: Replace with actual payroll data fetching hook
  const isLoading = false;
  const payrollData = {
    data: { items: [], metadata: { page: 1, totalPages: 1, limit: 10, hasPreviousPage: false, hasNextPage: false } },
  };

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

  const handlePageChange = useCallback((page: number) => {
    setFilters((previous: any) => ({ ...previous, page: page.toString() }));
  }, []);

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
    <section>
      <section className="flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-2xl font-bold">Payroll Overview</h1>
          <p className="text-sm text-gray-500">Payroll</p>
        </div>
        <div className="flex min-w-[50%] items-center gap-2">
          <ComboBox options={[]} className="h-12" />
          <MainButton variant="outline" onClick={() => setShowFundWalletModal(true)}>
            Fund Wallet
          </MainButton>
          {true && (
            <>
              <MainButton onClick={() => setShowPayrollDrawer(true)} variant="primary">
                Generate Payroll
              </MainButton>
              <MainButton onClick={() => setShowPayrollDrawer(true)} variant="primary">
                Run Payroll
              </MainButton>
            </>
          )}
          <div>
            <GenericDropdown
              align={`end`}
              trigger={
                <div
                  className={`bg-background border-border flex size-12 items-center justify-center rounded-md border`}
                >
                  <MoreVertical className="size-5" />
                </div>
              }
            >
              <DropdownMenuItem onClick={() => setShowScheduleDrawer(true)}>Schedule Payroll</DropdownMenuItem>
              <DropdownMenuItem>Payroll Settings</DropdownMenuItem>
            </GenericDropdown>
          </div>
        </div>
      </section>
      {/* Payroll Table Placeholder */}
      <section className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardCard
          title="Estimated Net Pay"
          value={<span className="text-base">{`N7,200,000`}</span>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Employees in Payroll"
          value={<span className="text-base">{98}</span>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Wallet Balance"
          value={
            <div className="flex items-center gap-4">
              <p className="text-base text-white">{isNetPayVisible ? `N7,200,000` : `••••••••`}</p>
              <button
                onClick={() => setIsNetPayVisible(!isNetPayVisible)}
                className="text-white transition-colors hover:text-gray-300"
                aria-label={isNetPayVisible ? "Hide net pay" : "Show net pay"}
              >
                {isNetPayVisible ? (
                  <EyeSlash className="text-white" size={30} />
                ) : (
                  <Eye className="text-white" size={30} />
                )}
              </button>
            </div>
          }
          className="flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-[#013E94] to-[#00132E] text-center"
          titleColor="text-white"
        />
      </section>
      <section className="mt-8">
        <section className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Employee Payroll Summary</h1>
          <div className="flex w-[50%] items-center gap-2">
            <SearchInput className="h-12 w-full" placeholder="Search employee..." onSearch={handleSearchChange} />
            <MainButton variant="primary" isLeftIconVisible size="xl" onClick={() => setShowAddEmployeeModal(true)}>
              Add Employee
            </MainButton>
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
            <div>
              <ExportAction
                downloadMutation={async (parameters) => {
                  // const { data } = await downloadPayroll(parameters);
                  return parameters as Blob;
                }}
                currentPage={undefined}
                dateRange={undefined}
                status={undefined}
                buttonText="Export Payroll"
                fileName="Payroll"
                size="xl"
              />
            </div>
          </div>
        </section>
        {isLoading ? (
          <Loading text={`Loading payroll table...`} className={`w-fill h-fit p-20`} />
        ) : (
          <section>
            {payrollData?.data?.items.length ? (
              <AdvancedDataTable
                data={payrollData.data.items}
                columns={payrollColumn}
                currentPage={payrollData.data.metadata.page}
                totalPages={payrollData.data.metadata.totalPages}
                itemsPerPage={payrollData.data.metadata.limit}
                hasPreviousPage={payrollData.data.metadata.hasPreviousPage}
                hasNextPage={payrollData.data.metadata.hasNextPage}
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
                images={[{ src: empty1.src, alt: "No payroll summary", width: 100, height: 100 }]}
                title="No payroll summary found."
                description="No payroll has been generated yet. Click the button below to generate payroll for this cycle."
                titleClassName="text-xl font-bold"
                button={{
                  text: "Generate Payroll",
                  onClick: () => router.push("/admin/payroll/generate-payroll"),
                }}
              />
            )}
          </section>
        )}
      </section>

      {/* Payroll Setup Modal */}
      <PayrollSetupModal
        // trigger={<Button className="bg-blue-600 hover:bg-blue-700">Fund</Button>}
        open={showSetupModal}
        onOpenChange={setShowSetupModal}
      />

      {/* Fund Wallet Modal */}
      <FundWalletFormModal
        open={showFundWalletModal}
        onOpenChange={setShowFundWalletModal}
        onSubmit={() => {
          // Handle fund wallet form submission
          setShowFundWalletModal(false);
        }}
      />

      {/* Schedule Payroll Drawer */}
      <SchedulePayrollDrawer open={showScheduleDrawer} onOpenChange={setShowScheduleDrawer} />
      <AddPayrollDrawer open={showPayrollDrawer} onOpenChange={setShowPayrollDrawer} />

      {/* Add Employee Modal */}
      <AddEmployeeModal open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal} />
    </section>
  );
};

export { PayrollView };
