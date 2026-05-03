'use client';

import { makeModalParams } from './use-modal-search-params';

// ── Modal name union for the /admin/payroll page ──────────────────────────────

/**
 * Persist-worthy payroll modal keys.
 *
 * | Modal key            | Description                                    |
 * |----------------------|------------------------------------------------|
 * | `schedule-payroll`   | Schedule payroll drawer (workflow)             |
 * | `generate-payroll`   | Generate/run payroll drawer (workflow)         |
 * | `fund-wallet`        | Fund wallet - amount entry form                |
 * | `fund-wallet-account`| Fund wallet - account details step (step 2)   |
 *
 * Note: `bonus-deduction` form modal is intentionally NOT persisted here.
 * It is rendered as a sub-UI panel inside other drawers (payroll-setup-form
 * and salary-details tab), making it a micro-interaction overlay rather than
 * a top-level intent-based modal.
 */
export type PayrollModal =
  | 'schedule-payroll'
  | 'generate-payroll'
  | 'create-payroll'
  | 'fund-wallet'
  | 'fund-wallet-account';

const PAYROLL_MODAL_NAMES = [
  'schedule-payroll',
  'generate-payroll',
  'create-payroll',
  'fund-wallet',
  'fund-wallet-account',
] as const satisfies readonly PayrollModal[];

const usePayrollModalBase = makeModalParams(PAYROLL_MODAL_NAMES);

/**
 * Modal URL-state hook for the `/admin/payroll` page.
 *
 * Manages:
 *  - `modal`:   one of `PayrollModal` keys, or null
 *  - `modalId`: payrollRunId for schedule/generate drawers
 *  - `modalMode`: not commonly used for payroll; available if needed
 *
 * Does NOT manage:
 *  - `showPayrollSettingsSetupModal` — policy setup that auto-shows; stays in Zustand
 *  - `showAddEmployeeToPayrollModal` — inline flow; stays in Zustand
 *  - `showEmployeeInformationDrawer` — in-drawer navigation; stays in Zustand
 *  - `bonus-deduction` form — nested sub-UI inside drawers; stays as useState
 *  - Destructive/confirm modals — stays as useState
 */
export const usePayrollModalParams = () => {
  const { modal, modalId, modalMode, openModal, closeModal, isOpen } =
    usePayrollModalBase();

  // ── Derived booleans ────────────────────────────────────────────────────────

  const isSchedulePayrollOpen = isOpen('schedule-payroll');
  const isGeneratePayrollOpen = isOpen('generate-payroll');
  const isCreatePayrollOpen = isOpen('create-payroll');
  const isFundWalletOpen = isOpen('fund-wallet');
  const isFundWalletAccountOpen = isOpen('fund-wallet-account');

  // ── Openers ─────────────────────────────────────────────────────────────────

  const openSchedulePayroll = (payrollRunId?: string) =>
    openModal(
      'schedule-payroll',
      payrollRunId ? { id: payrollRunId } : undefined
    );

  const openGeneratePayroll = (payrollRunId?: string) =>
    openModal(
      'generate-payroll',
      payrollRunId ? { id: payrollRunId } : undefined
    );

  const openCreatePayroll = () => openModal('create-payroll');

  const openFundWallet = () => openModal('fund-wallet');

  /** Called internally when the fund-wallet form submits and transitions to step 2. */
  const openFundWalletAccount = () => openModal('fund-wallet-account');

  return {
    modal,
    modalId,
    modalMode,

    // Derived predicates
    isSchedulePayrollOpen,
    isGeneratePayrollOpen,
    isCreatePayrollOpen,
    isFundWalletOpen,
    isFundWalletAccountOpen,

    // Actions
    openSchedulePayroll,
    openGeneratePayroll,
    openCreatePayroll,
    openFundWallet,
    openFundWalletAccount,
    closeModal,
    isOpen,
  };
};
