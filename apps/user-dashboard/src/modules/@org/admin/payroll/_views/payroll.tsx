'use client';

import { formatCurrency, formatDate } from '@/lib/formatters';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import {
  AdvancedDataTable,
  ComboBox,
  DashboardHeader,
  EmptyState,
  GenericDropdown,
  TableSkeleton,
} from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { Button } from '@workspace/ui/components/button';
import { AxiosError } from 'axios';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import empty1 from '~/images/empty-state.svg';
import { ApprovalProgressModal } from '../_components/approval-progress-modal';
import { DevApprovalActionsModal } from '../_components/dev-approval-actions-modal';
import { AddEmployeeDrawer } from '../_components/drawers/add-employee-drawer';
import { EmployeeInformationDrawer } from '../_components/drawers/employee-infomation-drawer';
import { GenerateRunPayrollDrawer } from '../_components/drawers/generate-run-payroll-drawer';
import { SchedulePayrollDrawer } from '../_components/drawers/schedule-payroll-drawer';
import { FundWalletFormModal } from '../_components/forms/fund-wallet-form-modal';
import { FundWalletAccountModal } from '../_components/fund-wallet-account-modal';
import { PayrollSetupSettingsModal } from '../_components/payroll-setup-modal';
import { PayrollNotificationBanner } from '../_components/payroll-notification-banner/banner';
import { DashboardCard } from '../../dashboard/_components/dashboard-card';
import { usePayrollService } from '../services/use-service';
import { usePayrollStore } from '../stores/payroll-store';
import type { Payroll, PayrollApproval } from '../types';
import { getPayrollColumns, usePayrollRowActions } from './table-data';

export const PayrollView = () => {
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
    useRetryPayroll,
  } = usePayrollService();
  const { data: companyWallet } = useGetCompanyWallet();
  const { data: payrollPolicy } = useGetCompanyPayrollPolicy();
  const {
    data: allPayrolls,
    isLoading: loadingPayrolls,
    refetch: refetchPayrolls,
  } = useGetAllPayrolls();
  const { mutateAsync: createPayroll, isPending: isCreatingPayroll } =
    useCreatePayroll();
  const [isWalletBalanceVisible, setIsWalletBalanceVisible] = useState(true);
  const [showNoPayrollBanner, setShowNoPayrollBanner] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState<string>('');
  const [isApprovalProgressOpen, setIsApprovalProgressOpen] = useState(false);
  const [isDevApprovalActionsOpen, setIsDevApprovalActionsOpen] =
    useState(false);
  const isDevelopmentMode = process.env.NODE_ENV !== 'production';

  const { mutateAsync: retryPayroll, isPending: isRetryingAllFailed } =
    useRetryPayroll();
  const [payrollData, setPayrollData] = useState({
    id: '',
    status: '',
    policyId: '',
    netPay: 0,
    employeesInPayroll: 0,
    paymentDate: '',
    walletBalance: companyWallet?.data?.balance || 0,
  });

  // Fetch single payroll details when an ID is selected
  const { data: selectedPayrollResponse } = useGetPayrollByID(
    selectedPayrollId,
    {
      enabled: !!selectedPayrollId,
    }
  );

  // Fetch payslips automatically when a payroll is selected
  const { data: payslipsData, isLoading: loadingPayslips } = useGetPayslips(
    selectedPayrollId,
    undefined,
    {
      enabled: !!selectedPayrollId, // Automatically fetch when payroll is selected
    }
  );

  // Determine if payslips exist for the selected payroll
  const hasPayslipsForSelectedPayroll = !!(
    payslipsData?.data?.items &&
    Array.isArray(payslipsData.data.items) &&
    payslipsData.data.items.length > 0
  );

  const failedPayslipIds =
    payslipsData?.data?.items
      ?.filter((payslip) => payslip.status === 'failed')
      .map((payslip) => payslip.id) ?? [];
  const isRetryAllDisabled =
    failedPayslipIds.length === 0 || isRetryingAllFailed;

  // Approval progress data for the selected payroll
  const payrollIdForApprovals = selectedPayrollId || '';
  const { data: approvalsResponse, isLoading: isApprovalsLoading } =
    useGetPayrollApprovals(payrollIdForApprovals, {
      enabled: !!payrollIdForApprovals && isApprovalProgressOpen,
    });
  const approvals = (approvalsResponse?.data ?? []) as PayrollApproval[];

  // Show Run Payroll button when payslips are available, Generate Payslip otherwise
  const showRunPayrollButton =
    !!selectedPayrollId && hasPayslipsForSelectedPayroll;
  const showGeneratePayslipButton =
    !!selectedPayrollId && !hasPayslipsForSelectedPayroll;

  // Find the full record for the currently selected payroll
  const selectedPayrollRecord: Payroll | undefined =
    (selectedPayrollResponse?.data as Payroll) ||
    (Array.isArray(allPayrolls?.data) && selectedPayrollId
      ? (allPayrolls.data.find(
          (payroll: Payroll) => payroll.id === selectedPayrollId
        ) as Payroll)
      : undefined);

  // Disable running payroll for future months (e.g., December while still in November)
  const isSelectedPayrollInFuture = (() => {
    if (!selectedPayrollRecord?.paymentDate) return false;
    const payrollDate = new Date(selectedPayrollRecord.paymentDate);
    const now = new Date();
    return (
      payrollDate.getFullYear() > now.getFullYear() ||
      (payrollDate.getFullYear() === now.getFullYear() &&
        payrollDate.getMonth() > now.getMonth())
    );
  })();

  const canRunSelectedPayroll = !isSelectedPayrollInFuture;

  // Robust awaiting detection (captures "awaiting", "awaiting approval", etc.)
  const normalizedStatus = (selectedPayrollRecord?.status ?? '')
    .toString()
    .toLowerCase();
  const isAwaitingApproval = normalizedStatus.includes('awaiting');
  const isDisbursed = normalizedStatus.includes('disbursed');
  const isCompleted = normalizedStatus.includes('completed');
  const isAddEmployeeDisabled =
    isCompleted ||
    !payslipsData?.data.items ||
    payslipsData.data.items.length === 0;

  // Show the banner if status is awaiting (ignore hide flag in this state),
  // otherwise show only when a run is in progress and the banner isn't hidden
  const shouldShowApprovalProgressBanner =
    !isCompleted &&
    (isAwaitingApproval ||
      (!!payrollSelectedDate && !hidePayrollNotificationBanner));

  // Final banner visibility (hide entirely for completed payrolls)
  const showPayrollBanner =
    !isCompleted &&
    (shouldShowApprovalProgressBanner || !!payrollData.paymentDate);

  // Show the button if payroll run is in progress or status is awaiting (do not tie to hide flag)
  const shouldShowApprovalProgressButton =
    !!payrollSelectedDate || isAwaitingApproval;

  const approvalBannerDateLabel =
    payrollSelectedDate && shouldShowApprovalProgressBanner
      ? formatDate(payrollSelectedDate, { month: 'long', year: 'numeric' })
      : payrollData.paymentDate;

  // If current selected payroll is disbursed, attempt to locate the next scheduled payroll (future payment date)
  const nextScheduledPayroll =
    isDisbursed && Array.isArray(allPayrolls?.data) && selectedPayrollRecord
      ? [...allPayrolls.data]
          .filter(
            (p: Payroll) =>
              new Date(p.paymentDate) >
              new Date(selectedPayrollRecord.paymentDate)
          )
          .sort(
            (a: Payroll, b: Payroll) =>
              new Date(a.paymentDate).getTime() -
              new Date(b.paymentDate).getTime()
          )[0]
      : null;

  // Map payrolls to ComboBox options
  const payrollOptions = Array.isArray(allPayrolls?.data)
    ? allPayrolls.data
        .sort(
          (a: Payroll, b: Payroll) =>
            new Date(a.paymentDate).getTime() -
            new Date(b.paymentDate).getTime()
        )
        .map((payroll: Payroll) => ({
          label: `${formatDate(payroll.paymentDate, {
            month: 'long',
            year: 'numeric',
          })} - ${payroll.status || 'Pending'}`,
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
                status: String(data.data.status || ''),
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
        }
      );
    } catch {
      // Error handling is done by the mutation
    }
  };

  const handleRunPayroll = () => {
    if (!selectedPayrollId) {
      toast.error('Please select a payroll period before running payroll.');
      return;
    }

    setShowPayrollDrawer(true);
  };

  const handleDismissNoPayrollBanner = () => {
    setShowNoPayrollBanner(false);
  };

  const handleRetryFailedPayslips = async () => {
    if (failedPayslipIds.length === 0) {
      toast.error('No failed payslips available for retry.');
      return;
    }

    await retryPayroll(
      { payslipIds: failedPayslipIds },
      {
        onSuccess: () => {
          toast.success('Retry has been queued for failed payslips.');
        },
        onError: (error) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data.message
              : 'Failed to retry payslips. Please try again.';
          toast.error(message);
        },
      }
    );
  };

  const payrollColumns = useMemo(() => getPayrollColumns(), []);

  useEffect(() => {
    if (
      payrollPolicy?.data?.payday &&
      payrollPolicy.data.payday > 0 &&
      payrollPolicyStatus
    ) {
      setHasCompletedPayrollPolicySetupForm(true);
    }
  }, [
    payrollPolicy?.data.payday,
    payrollPolicyStatus,
    setHasCompletedPayrollPolicySetupForm,
  ]);

  // When wallet setup has just completed (success alert shown),
  // ensure the "No payroll" banner becomes visible if there are no payrolls yet.
  useEffect(() => {
    if (!walletSetupCompleted) return;

    const hasPayrolls =
      Array.isArray(allPayrolls?.data) && allPayrolls.data.length > 0;
    if (!hasPayrolls) {
      setShowNoPayrollBanner(true);
    }
  }, [walletSetupCompleted, allPayrolls]);

  // Keep local walletBalance in sync with server data
  useEffect(() => {
    const latestBalance = companyWallet?.data?.balance;
    if (typeof latestBalance === 'number') {
      setPayrollData((previous) => ({
        ...previous,
        walletBalance: latestBalance,
      }));
    }
  }, [companyWallet?.data?.balance]);

  // Sync detailed payroll data when fetched
  useEffect(() => {
    if (selectedPayrollResponse?.data) {
      const p = selectedPayrollResponse.data as Payroll;
      setPayrollData((previous) => ({
        ...previous,
        id: p.id,
        status: String(p.status || ''),
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
      const hasPayrolls =
        Array.isArray(allPayrolls?.data) && allPayrolls.data.length > 0;
      setShowNoPayrollBanner(!hasPayrolls);

      // Load the most recent payroll data if available (sorted by earliest month)
      // This only affects dashboard cards, not the table
      if (hasPayrolls) {
        // Sort payrolls by payment date (earliest first) and select earliest; detailed fetch will populate cards
        const payrollsArray = Array.isArray(allPayrolls.data)
          ? allPayrolls.data
          : [];
        const sortedPayrolls = [...payrollsArray].sort(
          (a, b) =>
            new Date(a.paymentDate).getTime() -
            new Date(b.paymentDate).getTime()
        );
        const earliestPayroll = sortedPayrolls[0];
        if (earliestPayroll) {
          setSelectedPayrollId(earliestPayroll.id);
        }
      }
    }
  }, [allPayrolls, companyWallet?.data?.balance, loadingPayrolls]);

  // if (loadingPayrolls) {
  //   return null;
  // }

  return (
    <section className="space-y-10">
      <DashboardHeader
        title="Payroll Overview"
        subtitle="Payroll"
        actionComponent={
          <section className="flex items-center gap-2">
            <div className={`w-full lg:flex-1`}>
              <ComboBox
                options={payrollOptions}
                value={selectedPayrollId}
                onValueChange={handlePayrollSelection}
                placeholder="Select payroll period"
                className="h-10 lg:w-80 border w-full"
              />
            </div>
            {/* Desktop Layout - Show individual buttons */}
            <div className={`hidden 2xl:flex items-center gap-2`}>
              <MainButton
                isDisabled={isFundWalletDisabled}
                onClick={handleFundWallet}
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
                  {loadingPayslips
                    ? 'Generating Payroll...'
                    : 'Generate Payroll'}
                </MainButton>
              ) : null}
              <MainButton
                className={cn(shouldShowApprovalProgressButton ? '' : 'hidden')}
                variant="primary"
                onClick={() => setIsApprovalProgressOpen(true)}
              >
                View Approval Progress
              </MainButton>
              {isDevelopmentMode ? (
                <MainButton
                  variant="primaryOutline"
                  onClick={() => setIsDevApprovalActionsOpen(true)}
                >
                  Dev: Approval Actions
                </MainButton>
              ) : null}
              <div>
                <GenericDropdown
                  align={`end`}
                  trigger={
                    <Button size={`icon`} className={`shadow rounded-md p-2.5`}>
                      <Icon
                        name="More"
                        size={20}
                        variant={`Outline`}
                        className={`text-primary rotate-90`}
                      />
                    </Button>
                  }
                >
                  <DropdownMenuItem
                    onClick={() => setShowSchedulePayrollDrawer(true)}
                  >
                    <Icon name={`MoneyTime`} variant={`Outline`} />
                    Schedule Payroll
                  </DropdownMenuItem>
                  <Link href={`/admin/payroll/setup`}>
                    <DropdownMenuItem>
                      <Icon name={`Setting2`} variant={`Outline`} />
                      Payroll Settings
                    </DropdownMenuItem>
                  </Link>
                </GenericDropdown>
              </div>
            </div>
            {/* Mobile Layout - All actions in dropdown */}
            <div className={`flex 2xl:hidden justify-end`}>
              <GenericDropdown
                align={`end`}
                trigger={
                  <Button
                    size={`icon`}
                    className={`shadow rounded-md p-2.5`}
                    variant="default"
                  >
                    <Icon
                      name="More"
                      size={20}
                      variant={`Outline`}
                      className={`text-primary rotate-90`}
                    />
                  </Button>
                }
              >
                <DropdownMenuItem
                  onClick={handleFundWallet}
                  disabled={isFundWalletDisabled}
                >
                  <Icon name={`WalletMoney`} variant={`Outline`} />
                  Fund Wallet
                </DropdownMenuItem>

                {showRunPayrollButton && (
                  <DropdownMenuItem
                    onClick={handleRunPayroll}
                    disabled={isCompleted}
                  >
                    <Icon name={`Play`} variant={`Outline`} />
                    Run Payroll
                  </DropdownMenuItem>
                )}

                {showGeneratePayslipButton && (
                  <DropdownMenuItem
                    onClick={() => {}}
                    disabled={payrollPolicyStatus || loadingPayslips}
                  >
                    <Icon name={`Plus`} />
                    {loadingPayslips
                      ? 'Generating Payroll...'
                      : 'Generate Payroll'}
                  </DropdownMenuItem>
                )}

                {shouldShowApprovalProgressButton && (
                  <DropdownMenuItem
                    onClick={() => setIsApprovalProgressOpen(true)}
                  >
                    <Icon name={`Eye`} variant={`Outline`} />
                    View Approval Progress
                  </DropdownMenuItem>
                )}

                {isDevelopmentMode && (
                  <DropdownMenuItem
                    onClick={() => setIsDevApprovalActionsOpen(true)}
                  >
                    <Icon name={`Setting2`} variant={`Outline`} />
                    Dev: Approval Actions
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={() => setShowSchedulePayrollDrawer(true)}
                >
                  <Icon name={`MoneyTime`} variant={`Outline`} />
                  Schedule Payroll
                </DropdownMenuItem>

                <Link href={`/admin/payroll/setup`}>
                  <DropdownMenuItem>
                    <Icon name={`Setting2`} variant={`Outline`} />
                    Payroll Settings
                  </DropdownMenuItem>
                </Link>
              </GenericDropdown>
            </div>
          </section>
        }
      />

      <PayrollNotificationBanner
        hasCompletedPayrollPolicySetupForm={hasCompletedPayrollPolicySetupForm}
        payrollPolicyStatus={payrollPolicyStatus}
        walletSetupCompleted={walletSetupCompleted}
        showNoPayrollBanner={showNoPayrollBanner}
        isCreatingPayroll={isCreatingPayroll}
        onSetupWallet={handleSetupWallet}
        onFundWallet={handleFundWallet}
        onGeneratePayroll={handleGeneratePayroll}
        onDismissNoPayrollBanner={handleDismissNoPayrollBanner}
        showPayrollBanner={showPayrollBanner}
        shouldShowApprovalProgressBanner={shouldShowApprovalProgressBanner}
        approvalBannerDateLabel={approvalBannerDateLabel ?? ''}
        isDisbursed={isDisbursed}
        nextScheduledPayroll={nextScheduledPayroll}
        payrollDataPaymentDate={payrollData.paymentDate}
        walletBalance={payrollData.walletBalance}
        onOpenApprovalProgress={() => setIsApprovalProgressOpen(true)}
      />

      {/* Payroll Table Placeholder */}
      <section className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <DashboardCard
          title="Estimated Net Pay"
          value={
            <span className="text-base">
              {formatCurrency(payrollData.netPay)}
            </span>
          }
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Employees in Payroll"
          value={
            <span className="text-base">{payrollData.employeesInPayroll}</span>
          }
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Wallet Balance"
          value={
            <div className="flex items-center gap-4">
              <p className="text-base text-white">
                {isWalletBalanceVisible
                  ? formatCurrency(payrollData.walletBalance)
                  : '••••••••'}
              </p>
              <button
                onClick={toggleWalletBalanceVisibility}
                className="text-white transition-colors hover:text-gray-300"
                aria-label={
                  isWalletBalanceVisible
                    ? 'Hide wallet balance'
                    : 'Show wallet balance'
                }
              >
                {isWalletBalanceVisible ? (
                  <Icon name="EyeSlash" size={30} className="text-white" />
                ) : (
                  <Icon name="Eye" size={30} className="text-white" />
                )}
              </button>
            </div>
          }
          className={cn(
            'flex flex-col col-span-2 md:col-span-1 items-center justify-center gap-4 bg-linear-to-r from-[#013E94] to-[#00132E] text-center'
          )}
          titleColor="text-white"
        />
      </section>
      <section className="">
        <section className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">Employee Payroll Summary</h1>
          <div className="hidden items-center gap-2 lg:flex">
            <MainButton
              variant="primaryOutline"
              isDisabled={isRetryAllDisabled}
              isLoading={isRetryingAllFailed}
              onClick={() => {
                void handleRetryFailedPayslips();
              }}
            >
              Retry All Failed Payslips
            </MainButton>
            <MainButton
              variant="primary"
              isLeftIconVisible
              onClick={() => setShowAddEmployeeModal(true)}
              icon={<Icon name={`Add`} variant={`Bold`} />}
              isDisabled={isAddEmployeeDisabled}
            >
              Add Employee
            </MainButton>
          </div>
          <div className="flex lg:hidden">
            <GenericDropdown
              align={`end`}
              trigger={
                <Button
                  size={`icon`}
                  className={`shadow rounded-md p-2.5`}
                  variant="default"
                >
                  <Icon
                    name="More"
                    size={20}
                    variant={`Outline`}
                    className={`text-primary rotate-90`}
                  />
                </Button>
              }
            >
              <DropdownMenuItem
                onClick={() => {
                  void handleRetryFailedPayslips();
                }}
                disabled={isRetryAllDisabled}
              >
                {isRetryingAllFailed
                  ? 'Retrying Failed Payslips...'
                  : 'Retry All Failed Payslips'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowAddEmployeeModal(true)}
                disabled={isAddEmployeeDisabled}
              >
                <Icon name={`Add`} variant={`Bold`} />
                Add Employee
              </DropdownMenuItem>
            </GenericDropdown>
          </div>
        </section>
        {loadingPayslips ? (
          <TableSkeleton />
        ) : !payslipsData?.data.items ||
          payslipsData.data.items.length === 0 ? (
          <EmptyState
            className="bg-background shadow"
            images={[
              { src: empty1.src, alt: 'No payslips', width: 50, height: 50 },
            ]}
            title="No payslips generated yet."
            description="Select a payroll from the dropdown above and click 'Generate Payslip' to view employee payroll details."
          />
        ) : (
          <AdvancedDataTable
            data={payslipsData.data.items}
            columns={payrollColumns}
            rowActions={getRowActions}
            onPageChange={() => {}}
            showPagination={true}
            enableRowSelection={true}
            enableColumnVisibility={false}
            enableSorting={false}
            enableFiltering={false}
            mobileCardView={true}
            showColumnCustomization={false}
            desktopTableClassname={`xl:block!`}
            mobileTableClassname={`xl:hidden!`}
          />
        )}
      </section>

      {/* Payroll Setup Modal (controlled, one-time prompt) */}
      <PayrollSetupSettingsModal />

      {/* Fund Wallet Modal */}
      <FundWalletFormModal
        isGeneratePayrollBannerShowing={showNoPayrollBanner}
      />
      <FundWalletAccountModal
        isGeneratePayrollBannerShowing={showNoPayrollBanner}
      />

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

      {isDevelopmentMode ? (
        <DevApprovalActionsModal
          open={isDevApprovalActionsOpen}
          onOpenChange={setIsDevApprovalActionsOpen}
          selectedPayrollId={selectedPayrollId}
        />
      ) : null}

      {/*/!* Add Employee Modal *!/*/}
      <AddEmployeeDrawer
        payrollId={selectedPayrollId || null}
        hasPayslips={hasPayslipsForSelectedPayroll}
      />
      <EmployeeInformationDrawer payrollId={selectedPayrollId || null} />

      {/* Remove employee from payroll confirmation */}
      <DeleteConfirmationModal />
    </section>
  );
};
