/* eslint-disable no-console */
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
import { AlertTriangle, MoreVertical } from "lucide-react"; // add AlertTriangle
import { useSession } from "next-auth/react";
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
// import { SSEProgressWidget } from "../../dashboard/_components/sse-progress-widget";
import { useEmployeeService } from "../../employee/services/use-service";
import { useSSEPayroll } from "../hook/use-payroll-sse";
import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";
import { payrollColumn, usePayrollRowActions } from "./table-data";

const formatNaira = (value: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value);

const PayrollView = () => {
  const { data: session } = useSession();
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
  const { useGetAllPayrolls, useGetCompanyWallet, useGetCompanyPayrollPolicy } = usePayrollService();
  const { data: companyPayrollPolicy } = useGetCompanyPayrollPolicy();
  const { data: teams = [] } = useGetAllTeams();

  const userId = session?.user?.id || "";
  const latestEvent = useSSEPayroll(userId);
  const checkCompanyPayrollSetupStatus = companyPayrollPolicy?.data.status === `incomplete`;

  console.log(latestEvent);

  // useEffect(() => {
  //   if (!latestEvent) return;

  //   switch (latestEvent.type) {
  //     case "payroll.approve.request": {
  //       console.log("🔔 Payroll approval requested", latestEvent.payload);
  //       break;
  //     }
  //     case "payroll.approve.success": {
  //       console.log("✅ Payroll approved", latestEvent.payload);
  //       break;
  //     }
  //     case "salary.paid": {
  //       console.log("💰 Salary paid", latestEvent.payload);
  //       break;
  //     }
  //     case "wallet.created.success": {
  //       console.log("🏦 Wallet created successfully", latestEvent.payload);
  //       break;
  //     }
  //     default: {
  //       console.log("📡 Generic Event:", latestEvent);
  //     }
  //   }
  // }, [latestEvent]);

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

  // --- New: Wallet balance + low-balance state ---
  const LOW_BALANCE_LIMIT = 5_000_000; // 5M NGN
  const walletBalance: number = Number(companyWalletData?.data?.balance || 20_000_000);
  const lowBalance = walletBalance < LOW_BALANCE_LIMIT;

  // Low-balance banner dismissal (resets when balance recovers)
  const [lowBalanceBannerDismissed, setLowBalanceBannerDismissed] = useState(false);
  useEffect(() => {
    if (!lowBalance) setLowBalanceBannerDismissed(false);
  }, [lowBalance]);

  // --- New: One-time Payroll Setup Modal experience ---
  const PAYROLL_SETUP_ACK_KEY = "hris.payrollSetupAcknowledged";
  const [showPayrollSetupModal, setShowPayrollSetupModal] = useState(false);

  const acknowledgePayrollSetup = useCallback(() => {
    try {
      localStorage.setItem(PAYROLL_SETUP_ACK_KEY, "1");
    } catch {
      // no-op
    }
  }, []);

  useEffect(() => {
    const status = companyPayrollPolicy?.data?.status as "incomplete" | "complete" | undefined;
    if (!status) return;

    if (status === "complete") {
      // Once completed, never prompt again
      acknowledgePayrollSetup();
      setShowPayrollSetupModal(false);
      return;
    }

    // First-time prompt only if not acknowledged and still incomplete
    let hasAck = false;
    try {
      hasAck = localStorage.getItem(PAYROLL_SETUP_ACK_KEY) === "1";
    } catch {
      hasAck = false;
    }
    setShowPayrollSetupModal(!hasAck);
  }, [companyPayrollPolicy?.data?.status, acknowledgePayrollSetup]);

  const handlePayrollSetupModalChange = useCallback(
    (open: boolean) => {
      setShowPayrollSetupModal(open);
      if (!open) acknowledgePayrollSetup();
    },
    [acknowledgePayrollSetup],
  );

  // --- Refined Fund Wallet workflow ---
  const handleShowFundWalletModal = () => {
    const isPolicyIncomplete = companyPayrollPolicy?.data?.status === "incomplete";
    const hasAccountNumber = Boolean(companyWalletData?.data?.accountNumber);

    if (isPolicyIncomplete || !hasAccountNumber) {
      // Guide to create/fund wallet if policy incomplete or wallet not ready
      setShowFundWalletModal(true);
      setShowFundWalletAccountModal(false);
    } else {
      // Policy complete and wallet available -> show account details modal
      setShowFundWalletModal(false);
      setShowFundWalletAccountModal(true);
    }
  };

  // Optional: mark acknowledged when user intentionally opens settings
  const handleOpenPayrollSettings = useCallback(() => {
    acknowledgePayrollSetup();
    router.push("/admin/payroll/setup");
  }, [acknowledgePayrollSetup, router]);

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

  return (
    <section className="space-y-10">
      <DashboardHeader
        title="Payroll Overview"
        subtitle="Payroll"
        actionComponent={
          <div className="flex min-w-[50%] items-center gap-2">
            <ComboBox disabled={true} options={[]} className="border-border text-muted-foreground h-10 w-full border" />
            <MainButton
              className={cn("border-primary shadow")} // remove lowBalance red border animation
              variant="outline"
              onClick={handleShowFundWalletModal}
            >
              Fund Wallet
            </MainButton>
            {togglePayrollAction === "GENERATE" ? (
              <MainButton
                className={cn(!hideNotificationBanner && `hidden`)}
                onClick={() => setShowPayrollDrawer(true)}
                variant="primary"
                isDisabled={checkCompanyPayrollSetupStatus || lowBalance}
              >
                Generate Payslip
              </MainButton>
            ) : (
              <MainButton
                className={cn(!hideNotificationBanner && `hidden`)}
                onClick={() => setShowPayrollDrawer(true)}
                variant="primary"
                isDisabled={checkCompanyPayrollSetupStatus || lowBalance}
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
                <DropdownMenuItem onClick={handleOpenPayrollSettings}>Payroll Settings</DropdownMenuItem>
              </GenericDropdown>
            </div>
          </div>
        }
      />

      {/* Low balance banner */}
      {lowBalance && !lowBalanceBannerDismissed && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 text-red-600" size={18} />
              <p className="text-sm text-red-800">
                Your wallet balance {formatNaira(walletBalance)} is below the recommended minimum of{" "}
                {formatNaira(LOW_BALANCE_LIMIT)}. Fund your wallet to generate or run payroll.
              </p>
            </div>
            <div className="flex items-start gap-5">
              <MainButton variant="outline" onClick={handleShowFundWalletModal}>
                Fund Wallet
              </MainButton>
              <button
                aria-label="Dismiss low balance banner"
                className="text-red-700 transition-colors hover:text-red-900"
                onClick={() => setLowBalanceBannerDismissed(true)}
              >
                <CloseCircle size={18} />
              </button>
            </div>
          </div>
        </section>
      )}

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
              <p className="text-base text-white">{isNetPayVisible ? formatNaira(walletBalance) : `••••••••`}</p>
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
          className={cn(
            "flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-[#013E94] to-[#00132E] text-center",
          )} // remove lowBalance red border animation
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
                // downloadMutation={async (filters) => {
                //   const { data } = await downloadPayrolls(filters);
                //   return data as Blob;
                // }}
                currentPage={undefined}
                dateRange={undefined}
                status={undefined}
                buttonText="Export Payroll"
                fileName="Payroll"
                className="border-border bg-background text-foreground h-10 rounded-md border px-3 shadow"
                // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
                downloadMutation={function (parameters: object): Promise<Blob | File> {
                  throw new Error("Function not implemented.");
                }}
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

      {/* Payroll Setup Modal (controlled, one-time prompt) */}
      {showPayrollSetupModal && (
        <PayrollSetupModal open={showPayrollSetupModal} onOpenChange={handlePayrollSetupModalChange} />
      )}

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
