/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { GenericDropdown } from "@/components/shared/drop-down";
import ExportAction from "@/components/shared/export-action";
import { ComboBox } from "@/components/shared/select-dropdown/combo-box";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import { formatCurrency } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";
import { AdvancedDataTable } from "@/modules/@org/admin/_components/table/table";
import { useQueryClient } from "@tanstack/react-query";
import { CloseCircle, Eye, EyeSlash, Filter } from "iconsax-reactjs";
import { AlertTriangle, MoreVertical } from "lucide-react"; // add AlertTriangle
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

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
import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";
import { payrollColumn, usePayrollRowActions } from "./table-data";

const PayrollView = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

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
    setTogglePayrollAction,
    hideNotificationBanner,
    setHideNotificationBanner,
    payrollSelectedDate,
    showFundWalletAccountModal,
    setShowFundWalletAccountModal,
  } = usePayrollStore();

  const { getRowActions } = usePayrollRowActions();
  const { useGetAllTeams } = useEmployeeService();
  const { useGetAllPayrolls, useGetCompanyWallet, useGetCompanyPayrollPolicy, useCreatePayroll, useGetPayslips } =
    usePayrollService();
  const {
    data: companyPayrollPolicy,
    isLoading: policyLoading,
    isFetched: policyFetched,
  } = useGetCompanyPayrollPolicy();
  const { data: teams = [] } = useGetAllTeams();

  const checkCompanyPayrollSetupStatus = companyPayrollPolicy?.data.status === `incomplete`;

  // Helper to format a schedule message for a given date
  const getScheduleMessage = (date: Date | null | undefined): ReactNode => {
    const formatted = date
      ? date.toLocaleString("default", { month: "long", day: "numeric", year: "numeric" })
      : "a future date";
    return `Your next payroll has been scheduled for ${formatted}. You can edit the schedule date or cancel the payroll before the set date here.`;
  };
  const PAYROLL_RUN_MESSAGE: ReactNode = (
    <>
      Your payroll for {payrollSelectedDate?.toLocaleString("default", { month: "long" })} is now in progress. It will
      be disbursed once all designated approvers have reviewed and approved the payment. You can track approval progress{" "}
      <Link className="underline" href="/">
        here
      </Link>
    </>
  );

  // Keep payroll list for schedule banner and defaults
  const { data: payrollData, isLoading: isPayrollLoading } = useGetAllPayrolls();

  // Active payroll to view payslips for
  const [activePayrollId, setActivePayrollId] = useState<string | null>(null);

  // Derive latest payroll id if none selected yet
  useEffect(() => {
    if (!activePayrollId) {
      try {
        const shaped = payrollData as unknown as {
          data?:
            | { items?: Array<{ id: string; paymentDate?: string | Date }> }
            | Array<{ id: string; paymentDate?: string | Date }>;
          items?: Array<{ id: string; paymentDate?: string | Date }>;
        };
        const list: Array<{ id: string; paymentDate?: string | Date }> = Array.isArray(shaped?.data)
          ? (shaped?.data as Array<{ id: string; paymentDate?: string | Date }>)
          : Array.isArray(shaped?.data?.items)
            ? (shaped?.data?.items as Array<{ id: string; paymentDate?: string | Date }>)
            : Array.isArray(shaped?.items)
              ? (shaped?.items as Array<{ id: string; paymentDate?: string | Date }>)
              : [];
        const sorted = list
          .map((p) => ({ id: p.id, ts: p.paymentDate ? new Date(p.paymentDate).getTime() : 0 }))
          .sort((a, b) => b.ts - a.ts);
        if (sorted[0]?.id) setActivePayrollId(sorted[0].id);
      } catch {
        // ignore
      }
    }
  }, [activePayrollId, payrollData]);

  // Payslips for active payroll
  const { data: payslipsPage, isLoading: isPayslipLoading } = useGetPayslips(
    activePayrollId ?? "",
    {},
    {
      enabled: Boolean(activePayrollId),
    },
  );

  // When payslips exist for the active payroll, switch CTA to "Run Payroll"
  const hasPayslips = Boolean(payslipsPage?.data?.items?.length);
  useEffect(() => {
    if (hasPayslips) {
      setTogglePayrollAction("RUN");
    }
  }, [hasPayslips, setTogglePayrollAction]);

  // Determine next scheduled payroll (simplified: any payroll with a future paymentDate)
  const nextScheduledPayrollDate: Date | null = (() => {
    try {
      const shaped = payrollData as unknown as {
        data?: { items?: Array<{ paymentDate?: string | Date }> } | Array<{ paymentDate?: string | Date }>;
        items?: Array<{ paymentDate?: string | Date }>;
      };
      const list: Array<{ paymentDate?: string | Date }> = Array.isArray(shaped?.data)
        ? (shaped?.data as Array<{ paymentDate?: string | Date }>)
        : Array.isArray(shaped?.data?.items)
          ? (shaped?.data?.items as Array<{ paymentDate?: string | Date }>)
          : Array.isArray(shaped?.items)
            ? (shaped?.items as Array<{ paymentDate?: string | Date }>)
            : [];

      const now = Date.now();
      const upcoming = list
        .map((item) => (item?.paymentDate ? new Date(item.paymentDate) : null))
        .filter((d): d is Date => !!d && !Number.isNaN(d.getTime()) && d.getTime() > now)
        .sort((a, b) => a.getTime() - b.getTime());
      return upcoming[0] ?? null;
    } catch {
      return null;
    }
  })();

  // Auto-show the banner once when a scheduled payroll is detected
  const [bannerInitialized, setBannerInitialized] = useState(false);
  useEffect(() => {
    if (!bannerInitialized && nextScheduledPayrollDate) {
      setHideNotificationBanner(false);
      setBannerInitialized(true);
    }
  }, [bannerInitialized, nextScheduledPayrollDate, setHideNotificationBanner]);

  const { data: companyWalletData, isLoading: walletLoading, isFetched: walletFetched } = useGetCompanyWallet();

  // --- New: Wallet readiness + balance/low-balance state ---
  const walletReady = Boolean(companyWalletData?.data?.accountNumber);
  const readinessEvaluated = policyFetched && walletFetched && !policyLoading && !walletLoading;
  const LOW_BALANCE_LIMIT = 5_000_000; // 5M NGN
  const walletBalance: number = walletFetched ? Number(companyWalletData?.data?.balance || 70_000_000) : 0;
  const lowBalance = walletFetched ? walletBalance < LOW_BALANCE_LIMIT : false;

  // Low-balance banner dismissal (resets when balance recovers)
  const [lowBalanceBannerDismissed, setLowBalanceBannerDismissed] = useState(false);
  useEffect(() => {
    if (!lowBalance) setLowBalanceBannerDismissed(false);
  }, [lowBalance]);

  // Mutation: Create/Generate payroll for current cycle
  const { mutateAsync: createPayroll, isPending: isCreatingPayroll } = useCreatePayroll();

  // Local modal state for the "Generating Payroll" blocking UI
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePayslip = useCallback(async () => {
    // Guard rails based on existing disabled conditions
    if (!readinessEvaluated || checkCompanyPayrollSetupStatus || !walletReady || lowBalance) return;

    setIsGenerating(true);
    try {
      const date = payrollSelectedDate ?? new Date();
      const created = await createPayroll({ paymentDate: date.toISOString() });

      // Set active payroll for viewing payslips and refresh queries
      const newId = (created as { data?: { id?: string } } | undefined)?.data?.id;
      if (newId) {
        setActivePayrollId(newId);
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["payrolls", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["payrolls", "payslips"] }),
      ]);

      // Flip CTA to "Run Payroll"
      setTogglePayrollAction("RUN");

      toast.success("Payroll generated for this cycle");
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message ?? "Failed to generate payroll";
      toast.error(message);
    } finally {
      setIsGenerating(false);
    }
  }, [
    readinessEvaluated,
    checkCompanyPayrollSetupStatus,
    walletReady,
    lowBalance,
    payrollSelectedDate,
    createPayroll,
    queryClient,
    setTogglePayrollAction,
  ]);

  // --- New: One-time Payroll Setup Modal experience ---
  const PAYROLL_SETUP_ACK_KEY = "hris.payrollSetupAcknowledged";
  const PAYROLL_SETUP_CONFIGURED_KEY = "hris.payrollSetupConfigured"; // set after completing setup form
  const [hasCompletedSetupForm, setHasCompletedSetupForm] = useState(false);
  useEffect(() => {
    try {
      setHasCompletedSetupForm(localStorage.getItem(PAYROLL_SETUP_CONFIGURED_KEY) === "1");
    } catch {
      // no-op
    }
  }, []);

  const acknowledgePayrollSetup = useCallback(() => {
    try {
      localStorage.setItem(PAYROLL_SETUP_ACK_KEY, "1");
    } catch {
      // no-op
    }
  }, []);

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
            {togglePayrollAction === "RUN" ? (
              <MainButton
                onClick={() => setShowPayrollDrawer(true)}
                variant="primary"
                isDisabled={!readinessEvaluated || checkCompanyPayrollSetupStatus || !walletReady || lowBalance}
              >
                Run Payroll
              </MainButton>
            ) : (
              <MainButton
                // Generate payroll and show results in table
                onClick={handleGeneratePayslip}
                variant="primary"
                isDisabled={
                  !readinessEvaluated ||
                  checkCompanyPayrollSetupStatus ||
                  !walletReady ||
                  lowBalance ||
                  isCreatingPayroll
                }
                isLoading={isCreatingPayroll}
              >
                Generate Payslip
              </MainButton>
            )}

            {/* <MainButton className={cn(!hideNotificationBanner && `hidden`)} variant="primary">
              View Approval Progress
            </MainButton> */}
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

      {/* Setup almost complete banner (policy done but wallet not yet set up) */}
      {readinessEvaluated &&
        (companyPayrollPolicy?.data?.status === "complete" || hasCompletedSetupForm) &&
        !walletReady && (
          <section className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 text-amber-600" size={18} />
                <p className="text-sm text-amber-800">
                  Payroll setup almost complete. Create and fund your company wallet to finish setup and enable payroll
                  generation.
                </p>
              </div>
              <div className="flex items-start gap-5">
                <MainButton variant="primary" onClick={handleShowFundWalletModal}>
                  Set up Wallet
                </MainButton>
              </div>
            </div>
          </section>
        )}

      {/* Low balance banner */}
      {walletFetched && lowBalance && !lowBalanceBannerDismissed && (
        <section className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 text-red-600" size={18} />
              <p className="text-sm text-red-800">
                Your wallet balance {walletBalance} is below the recommended minimum of {LOW_BALANCE_LIMIT}. Fund your
                wallet to generate or run payroll.
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
          <button
            type="button"
            aria-label="Hide banner"
            className="text-background/80 hover:text-background absolute top-2 right-2"
            onClick={() => setHideNotificationBanner(true)}
          >
            <CloseCircle />
          </button>
          <p className="text-background max-w-4xl text-sm">
            {nextScheduledPayrollDate ? getScheduleMessage(nextScheduledPayrollDate) : null}
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
              <p className="text-base text-white">{isNetPayVisible ? formatCurrency(walletBalance) : `••••••••`}</p>
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
              onSearch={() => {}}
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
                    teams={teams}
                    initialFilters={{}}
                    onFilterChange={function (filters): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </section>
              </GenericDropdown>
            </div>
            <div>
              <ExportAction
                currentPage={undefined}
                dateRange={undefined}
                status={undefined}
                buttonText="Export Payroll"
                fileName="Payroll"
                className="border-border bg-background text-foreground h-10 rounded-md border px-3 shadow"
                downloadMutation={function (parameters: object): Promise<Blob | File> {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          </div>
        </section>
        {isPayslipLoading ? (
          <Loading text={`Loading payroll table...`} className={`w-fill h-fit p-20`} />
        ) : (
          <section>
            {payslipsPage?.data?.items?.length && (
              <AdvancedDataTable
                data={payslipsPage.data.items}
                columns={payrollColumn}
                currentPage={payslipsPage.data.metadata.page}
                totalPages={payslipsPage.data.metadata.totalPages}
                itemsPerPage={payslipsPage.data.metadata.limit}
                hasPreviousPage={payslipsPage.data.metadata.hasPreviousPage}
                hasNextPage={payslipsPage.data.metadata.hasNextPage}
                onPageChange={() => {}}
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
            )}
          </section>
        )}
      </section>

      {/* Payroll Setup Modal (controlled, one-time prompt) */}
      <PayrollSetupModal />

      {/* Generating Payroll Modal */}
      <Modal
        title=""
        description=""
        isOpen={isGenerating}
        onClose={() => {
          // Block closing while generating to avoid accidental dismissal
          if (!isCreatingPayroll) setIsGenerating(false);
        }}
      >
        <div className="flex flex-col items-center justify-center gap-4 py-6">
          <div className="border-muted/40 border-t-primary h-12 w-12 animate-spin rounded-full border-4" />
          <h3 className="text-lg font-semibold">Generating Payroll</h3>
          <p className="muted-foreground text-sm">Please wait a moment...</p>
        </div>
      </Modal>

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
