'use client';

import { formatCurrency, formatDate } from '@/lib/formatters';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { ComboBox } from '@workspace/ui/lib/select-dropdown/combo-box';
import { MainButton } from '@workspace/ui/lib/button';
import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { Button } from '@workspace/ui/components/button';
import { AxiosError } from 'axios';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { ApprovalProgressModal } from '../_components/approval-progress-modal';
import { DevApprovalActionsModal } from '../_components/dev-approval-actions-modal';
import { AddEmployeeDrawer } from '../_components/drawers/add-employee-drawer';
import { EmployeeInformationDrawer } from '../_components/drawers/employee-infomation-drawer';
import { GenerateRunPayrollDrawer } from '../_components/drawers/generate-run-payroll-drawer';
import { GeneratePayrollDrawer } from '../_components/drawers/generate-payroll-drawer';
import { SchedulePayrollDrawer } from '../_components/drawers/schedule-payroll-drawer';
import { FundWalletFormModal } from '../_components/forms/fund-wallet-form-modal';
import { FundWalletAccountModal } from '../_components/fund-wallet-account-modal';
import { PayrollSetupSettingsModal } from '../_components/payroll-setup-modal';
import { usePayrollModalParams } from '@/lib/nuqs/use-payroll-modal-params';
import { PayrollNotificationBanner } from '../_components/payroll-notification-banner/banner';
import { DashboardCard } from '../../../_components/dashboard-card';
import { usePayrollService } from '../services/use-service';
import { usePayrollStore } from '../stores/payroll-store';
import type { Payroll, PayrollApproval } from '../types';
import { AlertModal } from '@workspace/ui/lib/dialog';
import { getPayrollColumns, usePayrollRowActions } from './table-data';
import { routes } from '@/lib/routes/routes';
import { useBulkPayrollActions } from '../hook/use-bulk-payroll-actions';
import { PayrollTableSection } from './payroll-table-section';

export const PayrollView = () => {
  const { getRowActions, DeleteConfirmationModal } = usePayrollRowActions();

  // ── URL state (nuqs) — schedule, generate, fund-wallet survive refresh ────
  const {
    isGeneratePayrollOpen,
    openSchedulePayroll,
    openGeneratePayroll,
    openCreatePayroll,
    openFundWallet,
    openFundWalletAccount,
    closeModal: closePayrollModal,
  } = usePayrollModalParams();

  // ── Zustand — non-URL business state ─────────────────────────────────────
  const {
    hasCompletedPayrollPolicySetupForm,
    setHasCompletedPayrollPolicySetupForm,
    setShowAddEmployeeModal,
    walletSetupCompleted,
    hidePayrollNotificationBanner,
    payrollSelectedDate,
  } = usePayrollStore();
  const {
    useGetCompanyPayrollPolicy,
    useGetAllPayrolls,
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
  const [isWalletBalanceVisible, setIsWalletBalanceVisible] = useState(true);
  const [showNoPayrollBanner, setShowNoPayrollBanner] = useState(false);
  const [selectedPayrollId, setSelectedPayrollId] = useState<string>('');

  const {
    selectedCount,
    handleSelectionChange,
    isBulkDeleteModalOpen,
    isBulkDeleting,
    openBulkDeleteModal,
    closeBulkDeleteModal,
    handleBulkDelete,
    handleBulkExport,
  } = useBulkPayrollActions({ payrollId: selectedPayrollId });
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
      enabled: !!selectedPayrollId,
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

  // Approval progress data for the selected payroll
  const payrollIdForApprovals = selectedPayrollId || '';
  const { data: approvalsResponse, isLoading: isApprovalsLoading } =
    useGetPayrollApprovals(payrollIdForApprovals, {
      enabled: !!payrollIdForApprovals && isApprovalProgressOpen,
    });
  const approvals = (approvalsResponse?.data ?? []) as PayrollApproval[];

  // Find the full record for the currently selected payroll
  const selectedPayrollRecord: Payroll | undefined =
    (selectedPayrollResponse?.data as Payroll) ||
    (Array.isArray(allPayrolls?.data) && selectedPayrollId
      ? (allPayrolls.data.find(
          (payroll: Payroll) => payroll.id === selectedPayrollId
        ) as Payroll)
      : undefined);

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

  // ── Derived state-driven flags ────────────────────────────────────────────
  const normalizedStatus = (selectedPayrollRecord?.status ?? '')
    .toString()
    .toLowerCase();

  const canRunPayroll =
    (normalizedStatus === 'idle' || normalizedStatus === 'failed') &&
    canRunSelectedPayroll;
  const isAwaitingApproval = normalizedStatus.includes('awaiting');
  const isDisbursed = normalizedStatus.includes('disbursed');
  const isCompleted = normalizedStatus.includes('completed');

  // ── Conditional visibility rules ──────────────────────────────────────────
  const showGeneratePayroll =
    !selectedPayrollId || // nothing selected yet — allow generation
    normalizedStatus.includes('complete') ||
    normalizedStatus.includes('partial');
  const showRunPayroll = canRunPayroll;
  const showViewApprovalProgress = isAwaitingApproval;
  const showRetryAllFailed = failedPayslipIds.length > 0;
  const showAddEmployee = hasPayslipsForSelectedPayroll;

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

  const approvalBannerDateLabel =
    payrollSelectedDate && shouldShowApprovalProgressBanner
      ? formatDate(payrollSelectedDate, { month: 'long', year: 'numeric' })
      : payrollData.paymentDate;

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
  };

  const payrollPolicyStatus = payrollPolicy?.data?.status === `incomplete`;
  const isFundWalletDisabled = payrollPolicyStatus && !walletSetupCompleted;
  const isGenerateDisabled = payrollPolicyStatus;

  const toggleWalletBalanceVisibility = () => {
    setIsWalletBalanceVisible(!isWalletBalanceVisible);
  };

  const handleSetupWallet = () => {
    openFundWallet();
  };

  const handleFundWallet = () => {
    openFundWalletAccount();
  };

  // ── Generate Payroll → opens GeneratePayrollDrawer ──────────────────────
  const handleGeneratePayroll = () => {
    openCreatePayroll();
  };

  const handleGeneratePayrollSuccess = async (payrollId: string) => {
    setSelectedPayrollId(payrollId);
    setShowNoPayrollBanner(false);
    await refetchPayrolls();
    // Group C: auto-select the new payroll, do NOT auto-open run drawer
  };

  const handleRunPayroll = () => {
    if (!selectedPayrollId) {
      toast.error('Please select a payroll period before running payroll.');
      return;
    }

    openGeneratePayroll(selectedPayrollId || undefined);
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
      { payrollId: selectedPayrollId, payslipIds: failedPayslipIds },
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

  useEffect(() => {
    if (!walletSetupCompleted) return;

    const hasPayrolls =
      Array.isArray(allPayrolls?.data) && allPayrolls.data.length > 0;
    if (!hasPayrolls) {
      setShowNoPayrollBanner(true);
    }
  }, [walletSetupCompleted, allPayrolls]);

  useEffect(() => {
    const latestBalance = companyWallet?.data?.balance;
    if (typeof latestBalance === 'number') {
      setPayrollData((previous) => ({
        ...previous,
        walletBalance: latestBalance,
      }));
    }
  }, [companyWallet?.data?.balance]);

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

  useEffect(() => {
    if (!loadingPayrolls && allPayrolls) {
      const hasPayrolls =
        Array.isArray(allPayrolls?.data) && allPayrolls.data.length > 0;
      setShowNoPayrollBanner(!hasPayrolls);

      if (hasPayrolls) {
        const payrollsArray = Array.isArray(allPayrolls.data)
          ? allPayrolls.data
          : [];
        const sortedPayrolls = [...payrollsArray].sort(
          (a: Payroll, b: Payroll) =>
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime()
        );
        const mostRecentPayroll = sortedPayrolls[0];
        if (mostRecentPayroll) {
          setSelectedPayrollId(mostRecentPayroll.id);
        }
      }
    }
  }, [allPayrolls, companyWallet?.data?.balance, loadingPayrolls]);

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
                triggerClassName="lg:w-[20rem] justify-between w-full"
              />
            </div>
            {/* Desktop Layout */}
            <div className={`hidden 2xl:flex items-center gap-2`}>
              <MainButton
                isDisabled={isFundWalletDisabled}
                onClick={handleFundWallet}
                variant="primaryOutline"
              >
                Fund Wallet
              </MainButton>
              {showGeneratePayroll && (
                <MainButton
                  onClick={handleGeneratePayroll}
                  isDisabled={isGenerateDisabled}
                  variant="primary"
                >
                  Generate Payroll
                </MainButton>
              )}
              {showRunPayroll && (
                <MainButton
                  onClick={handleRunPayroll}
                  variant="primary"
                  isDisabled={!canRunPayroll}
                >
                  Run Payroll
                </MainButton>
              )}
              {/*{showViewApprovalProgress && (*/}
              {/*  <MainButton*/}
              {/*    variant="primary"*/}
              {/*    onClick={() => setIsApprovalProgressOpen(true)}*/}
              {/*  >*/}
              {/*    View Approval Progress*/}
              {/*  </MainButton>*/}
              {/*)}*/}
              {/*{isDevelopmentMode &&*/}
              {/*  !showViewApprovalProgress &&*/}
              {/*  selectedPayrollId && (*/}
              {/*    <MainButton*/}
              {/*      variant="primaryOutline"*/}
              {/*      onClick={() => setIsDevApprovalActionsOpen(true)}*/}
              {/*    >*/}
              {/*      Dev: Approval Actions*/}
              {/*    </MainButton>*/}
              {/*  )}*/}
              <div>
                <GenericDropdown
                  align={`end`}
                  trigger={
                    <Button
                      variant={`primaryOutline`}
                      size={`icon`}
                      className={`size-10`}
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
                  <DropdownMenuItem onClick={() => openSchedulePayroll()}>
                    <Icon name={`MoneyTime`} variant={`Outline`} />
                    Schedule Payroll
                  </DropdownMenuItem>
                  <Link href={routes.admin.payroll.setup()}>
                    <DropdownMenuItem>
                      <Icon name={`Setting2`} variant={`Outline`} />
                      Payroll Settings
                    </DropdownMenuItem>
                  </Link>
                </GenericDropdown>
              </div>
            </div>
            {/* Mobile Layout */}
            <div className={`flex 2xl:hidden justify-end`}>
              <GenericDropdown
                align={`end`}
                trigger={
                  <Button
                    size={`icon`}
                    className={`size-10 rounded-md`}
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
                {showGeneratePayroll && (
                  <DropdownMenuItem
                    onClick={handleGeneratePayroll}
                    disabled={isGenerateDisabled}
                  >
                    <Icon name={`Add`} variant={`Outline`} />
                    Generate Payroll
                  </DropdownMenuItem>
                )}

                {showRunPayroll && (
                  <DropdownMenuItem
                    onClick={handleRunPayroll}
                    disabled={!canRunPayroll}
                  >
                    <Icon name={`Play`} variant={`Outline`} />
                    Run Payroll
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem
                  onClick={handleFundWallet}
                  disabled={isFundWalletDisabled}
                >
                  <Icon name={`WalletMoney`} variant={`Outline`} />
                  Fund Wallet
                </DropdownMenuItem>

                {showViewApprovalProgress && (
                  <DropdownMenuItem
                    onClick={() => setIsApprovalProgressOpen(true)}
                  >
                    <Icon name={`Eye`} variant={`Outline`} />
                    View Approval Progress
                  </DropdownMenuItem>
                )}

                {isDevelopmentMode &&
                  !showViewApprovalProgress &&
                  selectedPayrollId && (
                    <DropdownMenuItem
                      onClick={() => setIsDevApprovalActionsOpen(true)}
                    >
                      <Icon name={`Setting2`} variant={`Outline`} />
                      Dev: Approval Actions
                    </DropdownMenuItem>
                  )}

                <DropdownMenuItem onClick={() => openSchedulePayroll()}>
                  <Icon name={`MoneyTime`} variant={`Outline`} />
                  Schedule Payroll
                </DropdownMenuItem>

                <Link href={routes.admin.payroll.setup()}>
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
        isCreatingPayroll={false}
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

      {/* Dashboard Cards */}
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
            'flex flex-col col-span-2 md:col-span-1 items-center justify-center gap-4' +
              ' bg-linear-to-r from-brand-gradient-from to-brand-gradient-to text-center'
          )}
          titleColor="text-white"
        />
      </section>

      {/* Employee Payroll Summary Table */}
      <PayrollTableSection
        loading={loadingPayslips}
        payslipsData={payslipsData}
        columns={payrollColumns}
        rowActions={getRowActions}
        selectedCount={selectedCount}
        onSelectionChange={handleSelectionChange}
        hasFailedPayslips={showRetryAllFailed}
        isRetrying={isRetryingAllFailed}
        onRetryAllFailed={() => {
          void handleRetryFailedPayslips();
        }}
        showAddEmployee={showAddEmployee}
        onAddEmployee={() => setShowAddEmployeeModal(true)}
        onBulkExport={handleBulkExport}
        onOpenBulkDelete={openBulkDeleteModal}
      />

      {/* ── Modals & Drawers ──────────────────────────────────────────────── */}

      <PayrollSetupSettingsModal />

      <FundWalletFormModal
        isGeneratePayrollBannerShowing={showNoPayrollBanner}
      />
      <FundWalletAccountModal
        isGeneratePayrollBannerShowing={showNoPayrollBanner}
      />

      <SchedulePayrollDrawer />

      {/* Generate Payroll Drawer (creates new payroll) */}
      <GeneratePayrollDrawer
        payrollPolicy={payrollPolicy?.data}
        onGenerated={handleGeneratePayrollSuccess}
      />

      {/* Run Payroll Drawer (runs existing payroll) */}
      <GenerateRunPayrollDrawer
        open={isGeneratePayrollOpen}
        onOpenChange={(open) => {
          if (!open) closePayrollModal();
        }}
        payrollId={selectedPayrollId || null}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        summary={payrollData as any}
        canRunNow={canRunSelectedPayroll}
      />

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

      <AddEmployeeDrawer
        payrollId={selectedPayrollId || null}
        hasPayslips={hasPayslipsForSelectedPayroll}
      />
      <EmployeeInformationDrawer payrollId={selectedPayrollId || null} />

      <DeleteConfirmationModal />

      <AlertModal
        isOpen={isBulkDeleteModalOpen}
        onClose={closeBulkDeleteModal}
        onConfirm={() => {
          void handleBulkDelete();
        }}
        loading={isBulkDeleting}
        type="warning"
        title="Remove selected employees from payroll"
        description={`Are you sure you want to remove ${selectedCount} employee${selectedCount > 1 ? 's' : ''} from this payroll? This action cannot be undone.`}
        confirmText={
          isBulkDeleting
            ? 'Removing...'
            : `Remove ${selectedCount} employee${selectedCount > 1 ? 's' : ''}`
        }
        cancelText="Cancel"
      />
    </section>
  );
};
