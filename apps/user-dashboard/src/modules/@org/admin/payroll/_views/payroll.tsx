/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
"use client";

import { formatCurrency, formatDate } from "@/lib/formatters";
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import {
  AdvancedDataTable,
  ComboBox,
  DashboardHeader,
  EmptyState,
  GenericDropdown,
  TableSkeleton,
} from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { CloseCircle, Eye, EyeSlash, InfoCircle } from "iconsax-reactjs";
import { AlertTriangle, MoreVertical } from "lucide-react"; // add AlertTriangle

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import empty1 from "~/images/empty-state.svg";
import { ApprovalProgressModal } from "../_components/approval-progress-modal";
import { AddEmployeeDrawer } from "../_components/drawers/add-employee-drawer";
import { EmployeeInformationDrawer } from "../_components/drawers/employee-infomation-drawer";
import { GenerateRunPayrollDrawer } from "../_components/drawers/generate-run-payroll-drawer";
import { SchedulePayrollDrawer } from "../_components/drawers/schedule-payroll-drawer";
import { FundWalletFormModal } from "../_components/forms/fund-wallet-form-modal";
import { FundWalletAccountModal } from "../_components/fund-wallet-account-modal";
import { PayrollSetupSettingsModal } from "../_components/payroll-setup-modal";
import Loading from "../../../../../../note/loading";
import { DashboardCard } from "../../dashboard/_components/dashboard-card";
import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";
import type { Payroll, PayrollApproval } from "../types";
import { payrollColumn, usePayrollRowActions } from "./table-data";

const LOW_BALANCE_LIMIT = 0; // 0M NGN

const GET_SCHEDULE_MESSAGE = (date: string | Date): ReactNode => {
  return `Your next payroll has been scheduled for ${date}. You can edit the schedule date or cancel the payroll before the set date here.`;
};

const PAYROLL_RUN_MESSAGE = (dateLabel: string, onOpenApprovalProgress: () => void): ReactNode => (
  <>
    Your payroll for {dateLabel} is now in progress. It will be disbursed once all designated approvers have reviewed
    and approved the payment. You can track approval progress{" "}
    <button type="button" className="underline" onClick={onOpenApprovalProgress}>
      here
    </button>
    .
  </>
);

const PayrollView = () => {
  const { getRowActions, DeleteConfirmationModal } = usePayrollRowActions();
  const {
    hasCompletedPayrollPolicySetupForm,
    setHasCompletedPayrollPolicySetupForm,
    setShowFundWalletFormModal,
    setShowFundWalletAccountModal,
    setShowSchedulePayrollDrawer,
    setShowAddEmployeeModal,
    walletSetupCompleted,
    showRunPayrollDrawer,
    setShowPayrollDrawer,
    hidePayrollNotificationBanner,
    payrollSelectedDate,
  } = usePayrollStore();
  const {
    useGetCompanyPayrollPolicy,
    useGetAllPayrolls,
    useCreatePayroll,
    useGetPayslips,
    useGetCompanyWallet,
    useGetPayrollApprovals,
    useGetPayrollByID,
  } = usePayrollService();
  const { data: companyWallet } = useGetCompanyWallet();
  const { data: payrollPolicy } = useGetCompanyPayrollPolicy();
  const { data: allPayrolls, isLoading: loadingPayrolls, refetch: refetchPayrolls } = useGetAllPayrolls();
  const { mutateAsync: createPayroll, isPending: isCreatingPayroll } = useCreatePayroll();
  const [isWalletBalanceVisible, setIsWalletBalanceVisible] = useState(true);
  const [showNoPayrollBanner, setShowNoPayrollBanner] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState<string>("");
  const [isApprovalProgressOpen, setIsApprovalProgressOpen] = useState(false);
  const [payrollData, setPayrollData] = useState({
    id: "",
    status: "",
    policyId: "",
    netPay: 0,
    employeesInPayroll: 0,
    paymentDate: "",
    walletBalance: companyWallet?.data?.balance || 0,
  });

  // Fetch single payroll details when an ID is selected
  const { data: selectedPayrollResponse } = useGetPayrollByID(selectedPayrollId, {
    enabled: !!selectedPayrollId,
  });

  // Fetch payslips automatically when a payroll is selected
  const { data: payslipsData, isLoading: loadingPayslips } = useGetPayslips(selectedPayrollId, undefined, {
    enabled: !!selectedPayrollId, // Automatically fetch when payroll is selected
  });

  // Determine if payslips exist for the selected payroll
  const hasPayslipsForSelectedPayroll = !!(
    payslipsData?.data?.items &&
    Array.isArray(payslipsData.data.items) &&
    payslipsData.data.items.length > 0
  );

  // Approval progress data for the selected payroll
  const payrollIdForApprovals = selectedPayrollId || "";
  const { data: approvalsResponse, isLoading: isApprovalsLoading } = useGetPayrollApprovals(payrollIdForApprovals, {
    enabled: !!payrollIdForApprovals && isApprovalProgressOpen,
  });
  const approvals = (approvalsResponse?.data ?? []) as PayrollApproval[];

  // Show Run Payroll button when payslips are available, Generate Payslip otherwise
  const showRunPayrollButton = !!selectedPayrollId && hasPayslipsForSelectedPayroll;
  const showGeneratePayslipButton = !!selectedPayrollId && !hasPayslipsForSelectedPayroll;

  // Find the full record for the currently selected payroll
  const selectedPayrollRecord: Payroll | undefined =
    (selectedPayrollResponse?.data as Payroll) ||
    (Array.isArray(allPayrolls?.data) && selectedPayrollId
      ? (allPayrolls.data.find((payroll: Payroll) => payroll.id === selectedPayrollId) as Payroll)
      : undefined);

  // Disable running payroll for future months (e.g., December while still in November)
  const isSelectedPayrollInFuture = (() => {
    if (!selectedPayrollRecord?.paymentDate) return false;
    const payrollDate = new Date(selectedPayrollRecord.paymentDate);
    const now = new Date();
    return (
      payrollDate.getFullYear() > now.getFullYear() ||
      (payrollDate.getFullYear() === now.getFullYear() && payrollDate.getMonth() > now.getMonth())
    );
  })();

  const canRunSelectedPayroll = !isSelectedPayrollInFuture;

  // Robust awaiting detection (captures "awaiting", "awaiting approval", etc.)
  const normalizedStatus = (selectedPayrollRecord?.status ?? "").toString().toLowerCase();
  const isAwaitingApproval = normalizedStatus.includes("awaiting");
  const isDisbursed = normalizedStatus.includes("disbursed");
  const isCompleted = normalizedStatus.includes("completed");

  // Show the banner if status is awaiting (ignore hide flag in this state),
  // otherwise show only when a run is in progress and the banner isn't hidden
  const shouldShowApprovalProgressBanner =
    !isCompleted && (isAwaitingApproval || (!!payrollSelectedDate && !hidePayrollNotificationBanner));

  // Final banner visibility (hide entirely for completed payrolls)
  const showPayrollBanner = !isCompleted && (shouldShowApprovalProgressBanner || !!payrollData.paymentDate);

  // Show the button if payroll run is in progress or status is awaiting (do not tie to hide flag)
  const shouldShowApprovalProgressButton = !!payrollSelectedDate || isAwaitingApproval;

  const approvalBannerDateLabel =
    payrollSelectedDate && shouldShowApprovalProgressBanner
      ? formatDate(payrollSelectedDate, { month: "long", year: "numeric" })
      : payrollData.paymentDate;

  // If current selected payroll is disbursed, attempt to locate the next scheduled payroll (future payment date)
  const nextScheduledPayroll =
    isDisbursed && Array.isArray(allPayrolls?.data) && selectedPayrollRecord
      ? [...allPayrolls.data]
          .filter((p: Payroll) => new Date(p.paymentDate) > new Date(selectedPayrollRecord.paymentDate))
          .sort((a: Payroll, b: Payroll) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())[0]
      : null;

  // Map payrolls to ComboBox options
  const payrollOptions = Array.isArray(allPayrolls?.data)
    ? allPayrolls.data
        .sort((a: Payroll, b: Payroll) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
        .map((payroll: Payroll) => ({
          label: `${formatDate(payroll.paymentDate, {
            month: "long",
            year: "numeric",
          })} - ${payroll.status || "Pending"}`,
          value: payroll.id,
        }))
    : [];

  const handlePayrollSelection = (value: string) => {
    setSelectedPayrollId(value);
    // Payslips and payroll details will be fetched automatically via hooks when ID changes
  };

  const payrollPolicyStatus = payrollPolicy?.data?.status === `incomplete`;
  const isFundWalletDisabled = payrollPolicyStatus && !walletSetupCompleted;

  const toggleWalletBalanceVisibility = () => {
    setIsWalletBalanceVisible(!isWalletBalanceVisible);
  };

  const handleSetupWallet = () => {
    setShowFundWalletFormModal(true);
    setShowFundWalletAccountModal(false);
  };

  const handleFundWallet = () => {
    setShowFundWalletAccountModal(true);
    setShowFundWalletFormModal(false);
  };

  const handleGeneratePayroll = async () => {
    try {
      // Get the current date for payment date
      const paymentDate = new Date().toISOString();
      await createPayroll(
        { paymentDate },
        {
          onSuccess: async (data) => {
            // Map response to payroll data (only affects dashboard cards)
            if (data?.data) {
              const newPayrollId = data.data.id;
              setSelectedPayrollId(newPayrollId);
              setPayrollData((previous) => ({
                ...previous,
                id: newPayrollId,
                status: String(data.data.status || ""),
                policyId: data.data.policyId,
                netPay: data.data.netPay,
                employeesInPayroll: data.data.employeesInPayroll,
                paymentDate: formatDate(data.data.paymentDate),
                walletBalance: companyWallet?.data?.balance || 0,
              }));
              // Hide the no payroll banner
              setShowNoPayrollBanner(false);
              // Refetch payrolls to update the list
              await refetchPayrolls();
              // Payslips will be automatically fetched due to selectedPayrollId change
            }
          },
        },
      );
    } catch {
      // Error handling is done by the mutation
    }
  };

  const handleRunPayroll = () => {
    if (!selectedPayrollId) {
      toast.error("Please select a payroll period before running payroll.");
      return;
    }

    setShowPayrollDrawer(true);
  };

  const handleDismissNoPayrollBanner = () => {
    setShowNoPayrollBanner(false);
  };

  const handleCheckPayrollAvailability = () => {
    // Check if there are no payrolls available
    const hasPayrolls = Array.isArray(allPayrolls?.data) && allPayrolls.data.length > 0;
    if (!hasPayrolls) {
      setShowNoPayrollBanner(true);
    }
  };

  useEffect(() => {
    if (payrollPolicy?.data?.payday && payrollPolicy.data.payday > 0 && payrollPolicyStatus) {
      setHasCompletedPayrollPolicySetupForm(true);
    }
  }, [payrollPolicy?.data.payday, payrollPolicyStatus, setHasCompletedPayrollPolicySetupForm]);

  // When wallet setup has just completed (success alert shown),
  // ensure the "No payroll" banner becomes visible if there are no payrolls yet.
  useEffect(() => {
    if (!walletSetupCompleted) return;

    const hasPayrolls = Array.isArray(allPayrolls?.data) && allPayrolls.data.length > 0;
    if (!hasPayrolls) {
      setShowNoPayrollBanner(true);
    }
  }, [walletSetupCompleted, allPayrolls]);

  // Keep local walletBalance in sync with server data
  useEffect(() => {
    const latestBalance = companyWallet?.data?.balance;
    if (typeof latestBalance === "number") {
      setPayrollData((previous) => ({ ...previous, walletBalance: latestBalance }));
    }
  }, [companyWallet?.data?.balance]);

  // Sync detailed payroll data when fetched
  useEffect(() => {
    if (selectedPayrollResponse?.data) {
      const p = selectedPayrollResponse.data as Payroll;
      setPayrollData((previous) => ({
        ...previous,
        id: p.id,
        status: String(p.status || ""),
        policyId: p.policyId,
        netPay: p.netPay || 0,
        employeesInPayroll: p.employeesInPayroll || 0,
        paymentDate: formatDate(p.paymentDate),
        walletBalance: companyWallet?.data?.balance || previous.walletBalance,
      }));
    }
  }, [selectedPayrollResponse?.data, companyWallet?.data?.balance]);

  // Check if there are any payrolls available and load current payroll (only affects dashboard cards)
  useEffect(() => {
    if (!loadingPayrolls && allPayrolls) {
      const hasPayrolls = Array.isArray(allPayrolls?.data) && allPayrolls.data.length > 0;
      setShowNoPayrollBanner(!hasPayrolls);

      // Load the most recent payroll data if available (sorted by earliest month)
      // This only affects dashboard cards, not the table
      if (hasPayrolls) {
        // Sort payrolls by payment date (earliest first) and select earliest; detailed fetch will populate cards
        const payrollsArray = Array.isArray(allPayrolls.data) ? allPayrolls.data : [];
        const sortedPayrolls = [...payrollsArray].sort(
          (a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime(),
        );
        const earliestPayroll = sortedPayrolls[0];
        if (earliestPayroll) {
          setSelectedPayrollId(earliestPayroll.id);
        }
      }
    }
  }, [allPayrolls, companyWallet?.data?.balance, loadingPayrolls]);

  if (loadingPayrolls) {
    return <Loading text="Initializing Payroll Interface" />;
  }

  return (
    <section className="space-y-10">
      {/* Notifications via SSEProvider/useSSE */}
      <DashboardHeader
        title="Payroll Overview"
        subtitle="Payroll"
        actionComponent={
          <div className="flex items-center gap-2">
            <ComboBox
              options={payrollOptions}
              value={selectedPayrollId}
              onValueChange={handlePayrollSelection}
              placeholder="Select payroll period"
              className="border-border h-10 w-64 border"
            />
            <MainButton
              isDisabled={isFundWalletDisabled}
              onClick={handleFundWallet}
              className="border-primary"
              variant="primaryOutline"
            >
              Fund Wallet
            </MainButton>
            {showRunPayrollButton ? (
              <MainButton
                onClick={handleRunPayroll}
                // isDisabled={payrollPolicyStatus || !canRunSelectedPayroll || isCompleted}
                isDisabled={isCompleted}
                variant="primary"
              >
                Run Payroll
              </MainButton>
            ) : showGeneratePayslipButton ? (
              <MainButton
                onClick={() => {}}
                isDisabled={payrollPolicyStatus || loadingPayslips}
                isLoading={loadingPayslips}
                variant="primary"
              >
                {loadingPayslips ? "Generating Payroll..." : "Generate Payroll"}
              </MainButton>
            ) : null}
            <MainButton
              className={cn(shouldShowApprovalProgressButton ? "" : "hidden")}
              variant="primary"
              onClick={() => setIsApprovalProgressOpen(true)}
            >
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
                <DropdownMenuItem onClick={() => setShowSchedulePayrollDrawer(true)}>Schedule Payroll</DropdownMenuItem>
                <Link href={`/admin/payroll/setup`}>
                  <DropdownMenuItem>Payroll Settings</DropdownMenuItem>
                </Link>
              </GenericDropdown>
            </div>
          </div>
        }
      />

      {/* Setup almost complete banner (policy done but wallet not yet set up) */}
      <section
        data-tour="payroll-setup-wallet"
        className={cn(
          "border-warning/50 bg-warning-50 hidden rounded-lg border p-4",
          hasCompletedPayrollPolicySetupForm && payrollPolicyStatus && `block`,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <InfoCircle className="text-warning mt-0.5" size={18} />
            <p className="text-muted-foreground text-sm">
              Payroll setup almost complete. Create and fund your company wallet to finish setup and enable payroll
              generation.
            </p>
          </div>
          <div className="flex items-start gap-5">
            <MainButton onClick={handleSetupWallet} variant="primary">
              Set up Wallet
            </MainButton>
          </div>
        </div>
      </section>

      {/* No Payroll Available Banner */}
      <section
        data-tour="generate-payroll"
        className={cn(
          "hidden rounded-lg border border-blue-200 bg-blue-50 p-4",
          showNoPayrollBanner && (!payrollPolicyStatus || walletSetupCompleted) && `block`,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 text-blue-600" size={18} />
            <p className="text-sm text-blue-800">
              No payroll found for this month. Generate a payroll to start processing employee payments.
            </p>
          </div>
          <div className="flex items-start gap-5">
            <MainButton
              variant="primary"
              onClick={handleGeneratePayroll}
              isLoading={isCreatingPayroll}
              isDisabled={isCreatingPayroll}
            >
              {isCreatingPayroll ? "Generating..." : "Generate Payroll"}
            </MainButton>
            <button
              onClick={handleDismissNoPayrollBanner}
              aria-label="Dismiss no payroll banner"
              className="text-blue-700 transition-colors hover:text-blue-900"
            >
              <CloseCircle size={18} />
            </button>
          </div>
        </div>
      </section>

      <section
        hidden={LOW_BALANCE_LIMIT <= payrollData.walletBalance}
        className="rounded-lg border border-red-200 bg-red-50 p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 text-red-600" size={18} />
            <p className="text-sm text-red-800">
              Your wallet balance {formatCurrency(payrollData.walletBalance)} is below the recommended minimum of{" "}
              {formatCurrency(LOW_BALANCE_LIMIT)}. Fund your wallet to generate or run payroll.
            </p>
          </div>
          <div className="flex items-start gap-5">
            {!payrollPolicyStatus && (
              <MainButton variant="outline" onClick={handleFundWallet}>
                Fund Wallet
              </MainButton>
            )}
            <button
              aria-label="Dismiss low balance banner"
              className="text-red-700 transition-colors hover:text-red-900"
            >
              <CloseCircle size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className={cn("rounded-lg", showPayrollBanner ? `block` : `hidden`)}>
        <div className="bg-primary-500 text-background relative rounded-lg p-5 shadow">
          <p className="text-background max-w-4xl text-sm">
            {shouldShowApprovalProgressBanner
              ? PAYROLL_RUN_MESSAGE(approvalBannerDateLabel ?? "", () => setIsApprovalProgressOpen(true))
              : isDisbursed
                ? nextScheduledPayroll
                  ? GET_SCHEDULE_MESSAGE(
                      formatDate(nextScheduledPayroll.paymentDate, {
                        month: "long",
                        year: "numeric",
                      }),
                    )
                  : "Payroll is currently being disbursed."
                : GET_SCHEDULE_MESSAGE(payrollData.paymentDate)}
          </p>
        </div>
      </section>

      {/* Payroll Table Placeholder */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardCard
          title="Estimated Net Pay"
          value={<span className="text-base">{formatCurrency(payrollData.netPay)}</span>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Employees in Payroll"
          value={<span className="text-base">{payrollData.employeesInPayroll}</span>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Wallet Balance"
          value={
            <div className="flex items-center gap-4">
              <p className="text-base text-white">
                {isWalletBalanceVisible ? formatCurrency(payrollData.walletBalance) : "••••••••"}
              </p>
              <button
                onClick={toggleWalletBalanceVisibility}
                className="text-white transition-colors hover:text-gray-300"
                aria-label={isWalletBalanceVisible ? "Hide wallet balance" : "Show wallet balance"}
              >
                {isWalletBalanceVisible ? (
                  <EyeSlash className="text-white" size={30} />
                ) : (
                  <Eye className="text-white" size={30} />
                )}
              </button>
            </div>
          }
          className={cn(
            "flex flex-col items-center justify-center gap-4 bg-gradient-to-r from-[#013E94] to-[#00132E] text-center",
          )}
          titleColor="text-white"
        />
      </section>
      <section className="">
        <section className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">Employee Payroll Summary</h1>
          <div className="flex items-center gap-2">
            <MainButton
              variant="primary"
              isLeftIconVisible
              onClick={() => setShowAddEmployeeModal(true)}
              isDisabled={isCompleted || !payslipsData?.data.items || payslipsData.data.items.length === 0}
            >
              Add Employee
            </MainButton>
          </div>
        </section>
        {loadingPayslips ? (
          <TableSkeleton />
        ) : !payslipsData?.data.items || payslipsData.data.items.length === 0 ? (
          <EmptyState
            className="bg-background shadow"
            images={[{ src: empty1.src, alt: "No payslips", width: 50, height: 50 }]}
            title="No payslips generated yet."
            description="Select a payroll from the dropdown above and click 'Generate Payslip' to view employee payroll details."
          />
        ) : (
          <AdvancedDataTable
            data={payslipsData.data.items}
            columns={payrollColumn}
            rowActions={getRowActions}
            onPageChange={() => {}}
            showPagination={true}
            enableRowSelection={true}
            enableColumnVisibility={false}
            enableSorting={false}
            enableFiltering={false}
            mobileCardView={true}
            showColumnCustomization={false}
          />
        )}
      </section>

      {/* Payroll Setup Modal (controlled, one-time prompt) */}
      <PayrollSetupSettingsModal />

      {/* Fund Wallet Modal */}
      <FundWalletFormModal isGeneratePayrollBannerShowing={showNoPayrollBanner} />
      <FundWalletAccountModal isGeneratePayrollBannerShowing={showNoPayrollBanner} />

      {/* Schedule Payroll Drawer */}
      <SchedulePayrollDrawer />
      <GenerateRunPayrollDrawer
        open={showRunPayrollDrawer}
        onOpenChange={setShowPayrollDrawer}
        payrollId={selectedPayrollId || null}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        summary={payrollData as any}
        canRunNow={canRunSelectedPayroll}
      />

      {/* Approval Progress Modal */}
      <ApprovalProgressModal
        open={isApprovalProgressOpen}
        onOpenChange={setIsApprovalProgressOpen}
        selectedPayrollId={selectedPayrollId}
        approvals={approvals}
        isApprovalsLoading={isApprovalsLoading}
      />

      {/* Add Employee Modal */}
      <AddEmployeeDrawer payrollId={selectedPayrollId || null} hasPayslips={hasPayslipsForSelectedPayroll} />
      <EmployeeInformationDrawer payrollId={selectedPayrollId || null} />

      {/* Remove employee from payroll confirmation */}
      <DeleteConfirmationModal />
    </section>
  );
};

export { PayrollView };
