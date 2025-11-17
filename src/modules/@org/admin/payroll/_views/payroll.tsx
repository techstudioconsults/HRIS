/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
"use client";

import Loading from "@/app/Loading";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { ConfirmDialog } from "@/components/shared/dialog/confirm-dialog";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState } from "@/components/shared/empty-state";
import { ComboBox } from "@/components/shared/select-dropdown/combo-box";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useSSE } from "@/context/sse-provider";
import { formatCurrency, formatDate } from "@/lib/i18n/utils";
import { EventRegistry } from "@/lib/sse/use-notifications";
import { cn } from "@/lib/utils";
import { AdvancedDataTable } from "@/modules/@org/admin/_components/table/table";
import { CloseCircle, Eye, EyeSlash } from "iconsax-reactjs";
import { AlertTriangle, MoreVertical } from "lucide-react"; // add AlertTriangle

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";

import empty1 from "~/images/empty-state.svg";
import { AddEmployeeDrawer } from "../_components/drawers/add-employee-drawer";
import { EmployeeInformationDrawer } from "../_components/drawers/employee-infomation-drawer";
import { GenerateRunPayrollDrawer } from "../_components/drawers/generate-run-payroll-drawer";
import { SchedulePayrollDrawer } from "../_components/drawers/schedule-payroll-drawer";
import { FundWalletFormModal } from "../_components/forms/fund-wallet-form-modal";
import { FundWalletAccountModal } from "../_components/fund-wallet-account-modal";
import { PayrollSetupSettingsModal } from "../_components/payroll-setup-modal";
import { TableSkeleton } from "../../_components/table";
import { DashboardCard } from "../../dashboard/_components/dashboard-card";
import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";
import type { PayrollApproval } from "../types";
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
  const { on } = useSSE();
  const router = useRouter();
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
    setHideNotificationBanner,
  } = usePayrollStore();
  const {
    useGetCompanyPayrollPolicy,
    useGetAllPayrolls,
    useCreatePayroll,
    useGetPayslips,
    useGetCompanyWallet,
    useGetPayrollApprovals,
  } = usePayrollService();
  const { data: companyWallet, refetch: refetchCompanyWallet } = useGetCompanyWallet();
  const { data: payrollPolicy } = useGetCompanyPayrollPolicy();
  const { data: allPayrolls, isLoading: loadingPayrolls, refetch: refetchPayrolls } = useGetAllPayrolls();
  const { mutateAsync: createPayroll, isPending: isCreatingPayroll } = useCreatePayroll();
  const [isWalletBalanceVisible, setIsWalletBalanceVisible] = useState(true);
  const [showNoPayrollBanner, setShowNoPayrollBanner] = useState(false);
  const [isTopupPromptOpen, setIsTopupPromptOpen] = useState(false);
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
  const selectedPayrollRecord =
    Array.isArray(allPayrolls?.data) && selectedPayrollId
      ? allPayrolls.data.find((p) => p.id === selectedPayrollId)
      : undefined;

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
  const isAwaitingApproval = normalizedStatus.includes("await");

  // Show the banner if status is awaiting (ignore hide flag in this state),
  // otherwise show only when a run is in progress and the banner isn't hidden
  const shouldShowApprovalProgressBanner =
    isAwaitingApproval || (!!payrollSelectedDate && !hidePayrollNotificationBanner);

  // Show the button if payroll run is in progress or status is awaiting (do not tie to hide flag)
  const shouldShowApprovalProgressButton = !!payrollSelectedDate || isAwaitingApproval;

  const approvalBannerDateLabel =
    payrollSelectedDate && shouldShowApprovalProgressBanner
      ? formatDate(payrollSelectedDate, "en", { month: "long", year: "numeric" })
      : payrollData.paymentDate;

  // Map payrolls to ComboBox options
  const payrollOptions = Array.isArray(allPayrolls?.data)
    ? allPayrolls.data
        .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
        .map((payroll) => ({
          label: `${formatDate(payroll.paymentDate, "en", {
            month: "long",
            year: "numeric",
          })} - ${payroll.status || "Pending"}`,
          value: payroll.id,
        }))
    : [];

  const handlePayrollSelection = (value: string) => {
    setSelectedPayrollId(value);
    // Payslips will be automatically fetched when selectedPayrollId changes
    const selectedPayroll = Array.isArray(allPayrolls?.data) ? allPayrolls.data.find((p) => p.id === value) : undefined;
    if (selectedPayroll) {
      setPayrollData((previous) => ({
        ...previous,
        id: selectedPayroll.id,
        status: String(selectedPayroll.status || ""),
        policyId: selectedPayroll.policyId,
        netPay: selectedPayroll.netPay || 0,
        employeesInPayroll: selectedPayroll.employeesInPayroll || 0,
        paymentDate: formatDate(selectedPayroll.paymentDate),
        walletBalance: companyWallet?.data?.balance || 0,
      }));
    }
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

  // Wallet + payroll notifications via SSE
  useEffect(() => {
    // Wallet top-up success
    const offTopup = on(EventRegistry.WALLET_TOP_SUCCESS, () => {
      toast.success("Company wallet funded successfully.");
      setShowFundWalletAccountModal(false);
      const hasPayrolls = Array.isArray(allPayrolls?.data) && allPayrolls.data.length > 0;
      if (!hasPayrolls) {
        setShowNoPayrollBanner(true);
      }
      setIsTopupPromptOpen(true);
      void refetchCompanyWallet();
    });

    // Wallet created / setup completed
    const offCreated = on(EventRegistry.WALLET_CREATED_SUCCESS, () => {
      toast.success("Company wallet setup completed successfully.");
      void refetchCompanyWallet();
    });

    // Payroll approval requested
    const offPayrollApproveRequest = on(EventRegistry.PAYROLL_APPROVE_REQUEST, (payload) => {
      const { title, body } = payload?.data ?? {};
      const message = title && body ? `${title} - ${body}` : title || body || "New payroll approval request received.";
      toast(message);
    });

    // Payroll approved
    const offPayrollApproved = on(EventRegistry.PAYROLL_APPROVED, (payload) => {
      const { title, body } = payload?.data ?? {};
      const message = title && body ? `${title} - ${body}` : title || body || "Payroll approved successfully.";
      toast.success(message);
      void refetchPayrolls();
    });

    // Payroll rejected
    const offPayrollRejected = on(EventRegistry.PAYROLL_REJECTED, (payload) => {
      const { title, body } = payload?.data ?? {};
      const message = title && body ? `${title} - ${body}` : title || body || "Payroll approval was rejected.";
      toast.error(message);
      void refetchPayrolls();
    });

    // Payroll completed (fully processed)
    const offPayrollCompleted = on(EventRegistry.PAYROLL_COMPLETED, (payload) => {
      const { title, body } = payload?.data ?? {};
      const message = title && body ? `${title} - ${body}` : title || body || "Payroll run completed.";
      toast.success(message);
      void refetchPayrolls();
      void refetchCompanyWallet();
    });

    // Generic payroll status updates
    const offPayrollStatus = on(EventRegistry.PAYROLL_STATUS, (payload) => {
      const { title, body } = payload?.data ?? {};
      const message = title && body ? `${title} - ${body}` : title || body || "Payroll status updated.";
      toast(message);
    });

    // Salary paid / disbursement notifications
    const offSalaryPaid = on(EventRegistry.SALARY_PAID, (payload) => {
      const { title, body } = payload?.data ?? {};
      const message = title && body ? `${title} - ${body}` : title || body || "Employee salaries have been paid.";
      toast.success(message);
      void refetchCompanyWallet();
    });

    return () => {
      offTopup();
      offCreated();
      offPayrollApproveRequest();
      offPayrollApproved();
      offPayrollRejected();
      offPayrollCompleted();
      offPayrollStatus();
      offSalaryPaid();
    };
  }, [
    on,
    refetchCompanyWallet,
    refetchPayrolls,
    setShowFundWalletAccountModal,
    setShowFundWalletFormModal,
    setIsTopupPromptOpen,
    allPayrolls,
    setShowNoPayrollBanner,
  ]);

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

  // Check if there are any payrolls available and load current payroll (only affects dashboard cards)
  useEffect(() => {
    if (!loadingPayrolls && allPayrolls) {
      const hasPayrolls = Array.isArray(allPayrolls?.data) && allPayrolls.data.length > 0;
      setShowNoPayrollBanner(!hasPayrolls);

      // Load the most recent payroll data if available (sorted by earliest month)
      // This only affects dashboard cards, not the table
      if (hasPayrolls) {
        // Sort payrolls by payment date (earliest first)
        const payrollsArray = Array.isArray(allPayrolls.data) ? allPayrolls.data : [];
        const sortedPayrolls = [...payrollsArray].sort((a, b) => {
          return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
        });

        const earliestPayroll = sortedPayrolls[0] as {
          id: string;
          status: string;
          policyId: string;
          netPay?: number;
          employeesInPayroll?: number;
          paymentDate: string;
        };

        setSelectedPayrollId(earliestPayroll.id);
        setPayrollData((previous) => ({
          ...previous,
          id: earliestPayroll.id,
          status: earliestPayroll.status,
          policyId: earliestPayroll.policyId,
          netPay: earliestPayroll.netPay || 0,
          employeesInPayroll: earliestPayroll.employeesInPayroll || 0,
          paymentDate: formatDate(earliestPayroll.paymentDate),
          walletBalance: companyWallet?.data?.balance || 0,
        }));
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
                isDisabled={payrollPolicyStatus || !canRunSelectedPayroll}
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
        className={cn(
          "border-warning/50 bg-warning-50 hidden rounded-lg border p-4",
          hasCompletedPayrollPolicySetupForm && payrollPolicyStatus && `block`,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-warning mt-0.5" size={18} />
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

      <section
        className={cn("rounded-lg", payrollData.paymentDate || shouldShowApprovalProgressBanner ? `block` : `hidden`)}
      >
        <div className="bg-primary-500 text-background relative rounded-lg p-5">
          <button
            type="button"
            aria-label="Hide banner"
            className="text-background/80 hover:text-background absolute top-2 right-2"
            onClick={() => {
              // Do not allow hiding while awaiting approval; ensure run banner stays visible
              if (!isAwaitingApproval && shouldShowApprovalProgressBanner) {
                setHideNotificationBanner(true);
              }
            }}
          >
            <CloseCircle />
          </button>
          <p className="text-background max-w-4xl text-sm">
            {shouldShowApprovalProgressBanner
              ? PAYROLL_RUN_MESSAGE(approvalBannerDateLabel ?? "", () => setIsApprovalProgressOpen(true))
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
              isDisabled={!payslipsData?.data.items || payslipsData.data.items.length === 0}
            >
              Add Employee
            </MainButton>
          </div>
        </section>
        {loadingPayslips ? (
          <TableSkeleton columns={payrollColumn.length} rows={10} />
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
      <FundWalletFormModal />
      <FundWalletAccountModal />

      {/* Schedule Payroll Drawer */}
      <SchedulePayrollDrawer />
      <GenerateRunPayrollDrawer
        open={showRunPayrollDrawer}
        onOpenChange={setShowPayrollDrawer}
        payrollId={selectedPayrollId || null}
        summary={payrollData}
        canRunNow={canRunSelectedPayroll}
      />

      {/* Approval Progress Modal */}
      <ReusableDialog
        open={isApprovalProgressOpen}
        onOpenChange={setIsApprovalProgressOpen}
        title="Track Approvers Progress"
        className="min-w-2xl"
        headerClassName="text-xl"
        trigger={<div />}
      >
        <section className="space-y-4">
          {selectedPayrollId ? (
            isApprovalsLoading ? (
              <p className="text-muted-foreground text-sm">Loading approvers...</p>
            ) : approvals.length === 0 ? (
              <p className="text-muted-foreground text-sm">No approvers configured for this payroll.</p>
            ) : (
              approvals.map((approval) => {
                const name = approval.employee.name ?? "Approver";
                const role = (approval.approverRole as ReactNode) ?? <></>;
                const initials =
                  name
                    .split(" ")
                    .map((part) => part.charAt(0))
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "AP";
                const statusLabel =
                  approval.status && approval.status.length > 0
                    ? approval.status.charAt(0).toUpperCase() + approval.status.slice(1)
                    : "Pending";

                return (
                  <section key={approval.payrollId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={approval.employee.avatar ?? "https://github.com/shadcn.png"} alt={name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-foreground">{name}</p>
                        {role ? <p className="text-xs text-gray-500">{role}</p> : null}
                      </div>
                    </div>
                    <Badge
                      className={cn(
                        "rounded-full px-4 py-2",
                        statusLabel === "Pending" && "bg-warning-50 text-warning",
                        statusLabel === "Approved" && "bg-success-50 text-success",
                        statusLabel === "Declined" && "bg-destructive-50 text-destructive",
                      )}
                    >
                      {statusLabel}
                    </Badge>
                  </section>
                );
              })
            )
          ) : (
            <p className="text-muted-foreground text-sm">Select a payroll to view approvers.</p>
          )}
        </section>
      </ReusableDialog>

      <ConfirmDialog
        isOpen={isTopupPromptOpen}
        onClose={() => setIsTopupPromptOpen(false)}
        onConfirm={() => {
          setIsTopupPromptOpen(false);
          void handleGeneratePayroll();
        }}
        loading={isCreatingPayroll}
        title="Generate Payroll?"
        description="you have just top up your wallet, do you want to generate a new payroll?"
        confirmText="Generate Payroll"
        cancelText="Not now"
        variant="default"
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
