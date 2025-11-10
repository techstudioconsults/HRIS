/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
"use client";

import Loading from "@/app/Loading";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState } from "@/components/shared/empty-state";
import { ComboBox } from "@/components/shared/select-dropdown/combo-box";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/i18n/utils";
import { cn } from "@/lib/utils";
import { AdvancedDataTable } from "@/modules/@org/admin/_components/table/table";
import { CloseCircle, Eye, EyeSlash } from "iconsax-reactjs";
import { AlertTriangle, MoreVertical } from "lucide-react"; // add AlertTriangle
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

import empty1 from "~/images/empty-state.svg";
import { AddEmployeeDrawer } from "../_components/add-employee-drawer";
import { FundWalletFormModal } from "../_components/forms/fund-wallet-form-modal";
import { FundWalletAccountModal } from "../_components/fund-wallet-account-modal";
import { GenerateRunPayrollDrawer } from "../_components/generate-run-payroll-drawer";
import { PayrollSetupSettingsModal } from "../_components/payroll-setup-modal";
import { SchedulePayrollDrawer } from "../_components/schedule-payroll-drawer";
import { TableSkeleton } from "../../_components/table";
import { DashboardCard } from "../../dashboard/_components/dashboard-card";
import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";
import { payrollColumn, usePayrollRowActions } from "./table-data";

const LOW_BALANCE_LIMIT = 5_000_000; // 5M NGN
const GET_SCHEDULE_MESSAGE = (date: string | Date): ReactNode => {
  return `Your next payroll has been scheduled for ${date}. You can edit the schedule date or cancel the payroll before the set date here.`;
};

const PAYROLL_RUN_MESSAGE: ReactNode = (
  <>
    Your payroll for is now in progress. It will be disbursed once all designated approvers have reviewed and approved
    the payment. You can track approval progress{" "}
    <Link className="underline" href="/">
      here
    </Link>
  </>
);

const PayrollView = () => {
  const router = useRouter();
  const { getRowActions } = usePayrollRowActions();
  const {
    hasCompletedPayrollPolicySetupForm,
    setHasCompletedPayrollPolicySetupForm,
    setShowFundWalletFormModal,
    setShowFundWalletAccountModal,
    setShowSchedulePayrollDrawer,
    setShowAddEmployeeModal,
    setShowPayrollDrawer,
  } = usePayrollStore();
  const {
    useGetCompanyPayrollPolicy,
    useGetAllPayrolls,
    useCreatePayroll,
    useGetPayslips,
    useGetCompanyWallet,
    useRunPayroll,
  } = usePayrollService();
  const { data: companyWallet } = useGetCompanyWallet();
  const { data: payrollPolicy } = useGetCompanyPayrollPolicy();
  const { data: allPayrolls, isLoading: loadingPayrolls, refetch: refetchPayrolls } = useGetAllPayrolls();
  const { mutateAsync: createPayroll, isPending: isCreatingPayroll } = useCreatePayroll();
  const { mutateAsync: runPayroll, isPending: isRunningPayroll } = useRunPayroll();
  const [isWalletBalanceVisible, setIsWalletBalanceVisible] = useState(true);
  const [showNoPayrollBanner, setShowNoPayrollBanner] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState<string>("");
  const [payrollData, setPayrollData] = useState({
    id: "",
    status: "",
    policyId: "",
    netPay: 0,
    employeesInPayroll: 0,
    paymentDate: "",
    walletBalance: companyWallet?.data?.balance || 70_000_000,
  });

  // Fetch payslips automatically when a payroll is selected
  const { data: payslipsData, isLoading: loadingPayslips } = useGetPayslips(selectedPayrollId, undefined, {
    enabled: !!selectedPayrollId, // Automatically fetch when payroll is selected
  });

  // Determine if payslips exist for the selected payroll
  const hasPayslipsForSelectedPayroll =
    payslipsData?.data?.items && Array.isArray(payslipsData.data.items) && payslipsData.data.items.length > 0;

  // Show Run Payroll button when payslips are available, Generate Payslip otherwise
  const showRunPayrollButton = !!selectedPayrollId && hasPayslipsForSelectedPayroll;
  const showGeneratePayslipButton = !!selectedPayrollId && !hasPayslipsForSelectedPayroll;

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
      }));
    }
  };

  const payrollPolicyStatus = payrollPolicy?.data?.status === `incomplete`;

  const toggleWalletBalanceVisibility = () => {
    setIsWalletBalanceVisible(!isWalletBalanceVisible);
  };

  const handleShowFundWalletForm = () => {
    if (payrollPolicyStatus) {
      setShowFundWalletFormModal(true);
      setShowFundWalletAccountModal(false);
    } else {
      setShowFundWalletAccountModal(true);
      setShowFundWalletFormModal(false);
    }
  };

  const handleGeneratePayroll = async () => {
    try {
      // Get the current date for payment date
      const paymentDate = new Date().toISOString();

      const response = await createPayroll(
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

  const handleRunPayroll = async () => {
    try {
      if (!payrollData.id) return;

      await runPayroll(
        {
          payrollId: payrollData.id,
          date: new Date().toISOString(),
        },
        {
          onSuccess: (data) => {
            // Update payroll status after running
            if (data?.data?.payroll) {
              setPayrollData((previous) => ({
                ...previous,
                status: String(data.data.payroll.status || ""),
              }));
              // Refetch payrolls to update the list
              refetchPayrolls();
            }
          },
        },
      );
    } catch {
      // Error handling is done by the mutation
    }
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
        }));
      }
    }
  }, [allPayrolls, loadingPayrolls]);

  if (loadingPayrolls) {
    return <Loading text="Initializing Payroll Interface" />;
  }

  return (
    <section className="space-y-10">
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
              onClick={handleShowFundWalletForm}
              className="border-primary"
              variant="outline"
              // isDisabled={!selectedPayrollId}
            >
              Fund Wallet
            </MainButton>
            {showRunPayrollButton ? (
              <MainButton
                onClick={handleRunPayroll}
                isDisabled={payrollPolicyStatus || isRunningPayroll}
                isLoading={isRunningPayroll}
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
                {loadingPayslips ? "Generating Payslips..." : "Generate Payslip"}
              </MainButton>
            ) : null}
            <MainButton className="hidden" variant="primary">
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
          "hidden rounded-lg border border-amber-200 bg-amber-50 p-4",
          hasCompletedPayrollPolicySetupForm && `block`,
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 text-amber-600" size={18} />
            <p className="text-sm text-amber-800">
              Payroll setup almost complete. Create and fund your company wallet to finish setup and enable payroll
              generation.
            </p>
          </div>
          <div className="flex items-start gap-5">
            <MainButton onClick={handleShowFundWalletForm} variant="primary">
              Set up Wallet
            </MainButton>
          </div>
        </div>
      </section>

      {/* No Payroll Available Banner */}
      <section
        className={cn(
          "hidden rounded-lg border border-blue-200 bg-blue-50 p-4",
          showNoPayrollBanner && !payrollPolicyStatus && `block`,
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
            <MainButton variant="outline">Fund Wallet</MainButton>
            <button
              aria-label="Dismiss low balance banner"
              className="text-red-700 transition-colors hover:text-red-900"
            >
              <CloseCircle size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className={cn("rounded-lg", payrollData.paymentDate ? `block` : `hidden`)}>
        <div className="bg-primary-500 text-background relative rounded-lg p-5">
          <button
            type="button"
            aria-label="Hide banner"
            className="text-background/80 hover:text-background absolute top-2 right-2"
          >
            <CloseCircle />
          </button>
          <p className="text-background max-w-4xl text-sm">{GET_SCHEDULE_MESSAGE(payrollData.paymentDate)}</p>
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
      <FundWalletAccountModal onCheckPayrollAvailability={handleCheckPayrollAvailability} />

      {/* Schedule Payroll Drawer */}
      <SchedulePayrollDrawer />
      <GenerateRunPayrollDrawer />

      {/* Add Employee Modal */}
      <AddEmployeeDrawer />
    </section>
  );
};

export { PayrollView };
