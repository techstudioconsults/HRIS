import { formatCurrency, formatDate } from '@/lib/formatters';
import { MainButton } from '@workspace/ui/lib/button';
import { cn } from '@workspace/ui/lib/utils';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { ReactNode } from 'react';

import type { PayrollNotificationBannerProps } from '../../types';

const LOW_BALANCE_LIMIT = 0; // 0M NGN

const GET_SCHEDULE_MESSAGE = (date: string | Date): ReactNode => {
  return `Your next payroll has been scheduled for ${date}. You can edit the schedule date or cancel the 
  payroll before the set date here.`;
};

const PAYROLL_RUN_MESSAGE = (
  dateLabel: string,
  onOpenApprovalProgress: () => void
): ReactNode => (
  <>
    Your payroll for {dateLabel} is now in progress. It will be disbursed once
    all designated approvers have reviewed and approved the payment. You can
    track approval progress{' '}
    <button
      type="button"
      className="underline"
      onClick={onOpenApprovalProgress}
    >
      here
    </button>
    .
  </>
);

export const PayrollNotificationBanner = ({
  hasCompletedPayrollPolicySetupForm,
  payrollPolicyStatus,
  walletSetupCompleted,
  showNoPayrollBanner,
  isCreatingPayroll,
  onSetupWallet,
  onFundWallet,
  onGeneratePayroll,
  onDismissNoPayrollBanner,
  showPayrollBanner,
  shouldShowApprovalProgressBanner,
  approvalBannerDateLabel,
  isDisbursed,
  nextScheduledPayroll,
  payrollDataPaymentDate,
  walletBalance,
  onOpenApprovalProgress,
}: PayrollNotificationBannerProps) => {
  return (
    <>
      <section
        data-tour="payroll-setup-wallet"
        className={cn(
          'border-warning/50 hidden bg-warning-50 rounded-lg border p-4',
          hasCompletedPayrollPolicySetupForm && payrollPolicyStatus && 'block'
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Icon
              name="InfoCircle"
              variant={`Bold`}
              size={18}
              className="text-accent"
            />
            <p className="text-muted-foreground text-sm text-balance">
              Payroll setup almost complete. Create and fund your company wallet
              to finish setup and enable payroll generation.
            </p>
          </div>
          <div className="flex items-start gap-5">
            <MainButton onClick={onSetupWallet} variant="primary">
              Set up Wallet
            </MainButton>
          </div>
        </div>
      </section>

      <section
        data-tour="generate-payroll"
        className={cn(
          'hidden rounded-lg border border-blue-200 bg-blue-50 p-4',
          showNoPayrollBanner &&
            (!payrollPolicyStatus || walletSetupCompleted) &&
            'block'
        )}
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3 text-primary">
            <Icon name="AlertTriangle" size={18} />
            <p className="text-sm text-balance text-primary">
              No payroll found for this month. Generate a payroll to start
              processing employee payments.
            </p>
          </div>
          <div className="flex items-start gap-5">
            <MainButton
              variant="primary"
              onClick={onGeneratePayroll}
              isLoading={isCreatingPayroll}
              isDisabled={isCreatingPayroll}
            >
              {isCreatingPayroll ? 'Generating...' : 'Generate Payroll'}
            </MainButton>
            <button
              onClick={onDismissNoPayrollBanner}
              aria-label="Dismiss no payroll banner"
              className="text-blue-700 transition-colors hover:text-blue-900"
            >
              <Icon name="CloseCircle" size={18} />
            </button>
          </div>
        </div>
      </section>

      <section
        hidden={LOW_BALANCE_LIMIT <= walletBalance}
        className="rounded-lg border border-red-200 bg-red-50 p-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Icon name="AlertTriangle" size={18} className="text-danger" />
            <p className="text-sm text-danger text-balance">
              Your wallet balance {formatCurrency(walletBalance)} is below the
              recommended minimum of {formatCurrency(LOW_BALANCE_LIMIT)}. Fund
              your wallet to generate or run payroll.
            </p>
          </div>
          <div className="flex items-start gap-5">
            {!payrollPolicyStatus && (
              <MainButton variant="outline" onClick={onFundWallet}>
                Fund Wallet
              </MainButton>
            )}
            <button
              aria-label="Dismiss low balance banner"
              className="text-danger transition-colors hover:text-danger/50"
            >
              <Icon name="CloseCircle" size={18} />
            </button>
          </div>
        </div>
      </section>

      <section
        className={cn('rounded-lg', showPayrollBanner ? 'block' : 'hidden')}
      >
        <div className="bg-primary-500 text-background relative rounded-lg p-5 shadow">
          <p className="text-background max-w-4xl text-sm">
            {shouldShowApprovalProgressBanner
              ? PAYROLL_RUN_MESSAGE(approvalBannerDateLabel ?? '', () =>
                  onOpenApprovalProgress()
                )
              : isDisbursed
                ? nextScheduledPayroll
                  ? GET_SCHEDULE_MESSAGE(
                      formatDate(nextScheduledPayroll.paymentDate, {
                        month: 'long',
                        year: 'numeric',
                      })
                    )
                  : 'Payroll is currently being disbursed.'
                : GET_SCHEDULE_MESSAGE(payrollDataPaymentDate)}
          </p>
        </div>
      </section>
    </>
  );
};
