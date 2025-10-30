/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
import ExportAction from "@/components/shared/export-action";
import { ComboBox } from "@/components/shared/select-dropdown/combo-box";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { usePayrollSearchParameters } from "@/lib/nuqs/use-payroll-search-parameters";
import { cn } from "@/lib/utils";
import { AdvancedDataTable } from "@/modules/@org/admin/_components/table/table";
import { CloseCircle, Eye, EyeSlash, Filter } from "iconsax-reactjs";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useDebounce } from "use-debounce";

import empty1 from "~/images/empty-state.svg";
import { AddEmployeeDrawer } from "../_components/add-employee-drawer";
import { PayrollFilterForm } from "../_components/forms/filter-form";
import { FundWalletFormModal } from "../_components/forms/fund-wallet-form-modal";
import { FundWalletAccountModal } from "../_components/fund-wallet-account-modal";
import { GenerateRunPayrollDrawer } from "../_components/generate-run-payroll-drawer";
import { PayrollSetupModal } from "../_components/payroll-setup-modal";
import { SchedulePayrollDrawer } from "../_components/schedule-payroll-drawer";
import { DashboardCard } from "../../dashboard/_components/dashboard-card";
import { useEmployeeService } from "../../employee/services/use-service";
import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";
import { payrollColumn, usePayrollRowActions } from "./table-data";

const PayrollView = () => {
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
  } = usePayrollSearchParameters();

  // Local input state (debounced) to throttle URL updates via nuqs
  const [searchInput, setSearchInput] = useState(search || "");
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const {
    showFundWalletModal,
    setShowFundWalletModal,
    showScheduleDrawer,
    setShowScheduleDrawer,
    showPayrollDrawer,
    setShowPayrollDrawer,
    showAddEmployeeModal,
    setShowAddEmployeeModal,
    isNetPayVisible,
    toggleNetPayVisibility,
    togglePayrollAction,
    hideNotificationBanner,
    payrollSelectedDate,
    showFundWalletAccountModal,
    setShowFundWalletAccountModal,
  } = usePayrollStore();

  const { getRowActions } = usePayrollRowActions();
  const { useGetAllTeams } = useEmployeeService();
  const { useGetAllPayrolls, useDownloadPayrolls, useGetCompanyWallet } = usePayrollService();
  const { data: teams = [] } = useGetAllTeams();
  const { refetch: downloadPayrolls } = useDownloadPayrolls();

  const PAYROLL_SCHEDULE_MESSAGE: ReactNode = `Your payroll has been scheduled for ${payrollSelectedDate?.toLocaleString("default", { month: "long", day: "numeric", year: "numeric" })}. You can edit the schedule date or cancel the payroll before the set date here.`;

  const PAYROLL_RUN_MESSAGE: ReactNode = (
    <>
      Your payroll for {payrollSelectedDate?.toLocaleString("default", { month: "long" })} is now in progress. It will
      be disbursed once all designated approvers have reviewed and approved the payment. You can track approval progress{" "}
      <Link className="underline" href="/">
        here
      </Link>
      .
    </>
  );

  // Apply debounced search to URL (nuqs) and reset page to 1
  useEffect(() => {
    setSearch(debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : null);
    resetToFirstPage();
  }, [debouncedSearch, setSearch, resetToFirstPage]);

  // Build API filters from URL state (nuqs)
  const apiFilters = useMemo(() => getApiFilters(), [getApiFilters]);

  const {
    data: payrollData,
    isLoading,
    refetch,
  } = useGetAllPayrolls(apiFilters, {
    keepPreviousData: false, // Don't keep previous data to ensure fresh results
    staleTime: 0, // Always consider data stale to ensure fresh API calls
    cacheTime: 0, // Don't cache data to prevent stale data issues
    refetchOnWindowFocus: false, // Don't refetch on window focus
    refetchOnMount: true, // Always refetch when component mounts
    refetchOnReconnect: true, // Refetch when network reconnects
    retry: 1, // Only retry once on failure
    retryDelay: 1000, // Wait 1 second before retry
  });

  const { data: companyWalletData } = useGetCompanyWallet();

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
  }, [companyWalletData?.data.accountNumber, refetch, setShowFundWalletModal]);

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

  const handleShowFundWalletModal = () => {
    if (companyWalletData?.data.companyId) {
      setShowFundWalletModal(false);
      setShowFundWalletAccountModal(true);
    } else {
      // Do something with the account number
      setShowFundWalletModal(true);
      setShowFundWalletAccountModal(false);
    }
  };

  // Cleanup ephemeral UI state on unmount/navigation
  // useEffect(() => {
  //   return () => {
  //     usePayrollStore.getState().resetUI();
  //   };
  // }, []);

  return (
    <section className="space-y-10">
      <DashboardHeader
        title="Payroll Overview"
        subtitle="Payroll"
        actionComponent={
          <div className="flex min-w-[50%] items-center gap-2">
            <ComboBox disabled={true} options={[]} className="border-border text-muted-foreground h-10 w-full border" />
            <MainButton className="border-primary shadow" variant="outline" onClick={handleShowFundWalletModal}>
              Fund Wallet
            </MainButton>
            {togglePayrollAction === "GENERATE" ? (
              <MainButton
                className={cn(!hideNotificationBanner && `hidden`)}
                onClick={() => setShowPayrollDrawer(true)}
                variant="primary"
                isDisabled={true}
              >
                Generate Payroll
              </MainButton>
            ) : (
              <MainButton
                className={cn(!hideNotificationBanner && `hidden`)}
                onClick={() => setShowPayrollDrawer(true)}
                variant="primary"
                isDisabled={true}
              >
                Run Payroll
              </MainButton>
            )}

            <MainButton className={cn(hideNotificationBanner && `hidden`)} variant="primary">
              View Approval Progress
            </MainButton>
            <div>
              <GenericDropdown
                align={`end`}
                trigger={
                  <div
                    className={`bg-background border-border flex size-10 items-center justify-center rounded-md border shadow`}
                  >
                    <MoreVertical className="size-4" />
                  </div>
                }
              >
                <DropdownMenuItem onClick={() => setShowScheduleDrawer(true)}>Schedule Payroll</DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/admin/payroll/setup">Payroll Settings</Link>
                </DropdownMenuItem>
              </GenericDropdown>
            </div>
          </div>
        }
      />

      <section>
        <div hidden={hideNotificationBanner} className="bg-primary-500 text-background relative rounded-lg p-5">
          <CloseCircle className="absolute top-2 right-2" />
          <p className="text-background max-w-4xl text-sm">
            {togglePayrollAction === "SCHEDULE" ? PAYROLL_SCHEDULE_MESSAGE : PAYROLL_RUN_MESSAGE}
          </p>
        </div>
      </section>

      {/* Payroll Table Placeholder */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
                onClick={toggleNetPayVisibility}
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
      <section className="">
        <section className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">Employee Payroll Summary</h1>
          <div className="flex min-w-[50%] items-center gap-2">
            <SearchInput
              isDisabled={false}
              className="border-border h-10 w-full rounded-md border"
              placeholder="Search employee..."
              onSearch={handleSearchChange}
            />
            <MainButton variant="primary" isLeftIconVisible onClick={() => setShowAddEmployeeModal(true)}>
              Add Employee
            </MainButton>
            <div>
              <GenericDropdown
                contentClassName="bg-background"
                trigger={
                  <Button
                    className="bg-background border-border flex h-10 items-center rounded-md border px-3 text-black dark:text-white"
                    variant="ghost"
                  >
                    <Filter className="size-4" />
                    <span>Filter</span>
                  </Button>
                }
              >
                <section className="min-w-sm">
                  <PayrollFilterForm
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
            <div>
              <ExportAction
                downloadMutation={async (filters) => {
                  const { data } = await downloadPayrolls(filters);
                  return data as Blob;
                }}
                currentPage={undefined}
                dateRange={undefined}
                status={undefined}
                buttonText="Export Payroll"
                fileName="Payroll"
                className="border-border bg-background text-foreground h-10 rounded-md border px-3 shadow"
              />
            </div>
          </div>
        </section>
        {isLoading ? (
          <Loading text={`Loading payroll table...`} className={`w-fill h-fit p-20`} />
        ) : (
          <section>
            {payrollData?.data?.items?.length ? (
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
              teamId ||
              roleId ||
              (status && status !== "all") ||
              sortBy ? (
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
      <PayrollSetupModal />

      {/* Fund Wallet Modal */}
      <FundWalletFormModal open={showFundWalletModal} onOpenChange={setShowFundWalletModal} />
      <FundWalletAccountModal open={showFundWalletAccountModal} onOpenChange={setShowFundWalletAccountModal} />

      {/* Schedule Payroll Drawer */}
      <SchedulePayrollDrawer open={showScheduleDrawer} onOpenChange={setShowScheduleDrawer} />
      <GenerateRunPayrollDrawer open={showPayrollDrawer} onOpenChange={setShowPayrollDrawer} />

      {/* Add Employee Modal */}
      <AddEmployeeDrawer open={showAddEmployeeModal} onOpenChange={setShowAddEmployeeModal} />
    </section>
  );
};

export { PayrollView };
