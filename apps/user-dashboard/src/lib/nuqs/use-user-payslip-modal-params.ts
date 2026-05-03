'use client';

import { makeModalParams } from './use-modal-search-params';

const USER_PAYSLIP_MODAL_NAMES = ['payslip-details'] as const;

const useUserPayslipModalBase = makeModalParams(USER_PAYSLIP_MODAL_NAMES);

/**
 * Modal URL-state hook for the user `/payslip` page.
 *
 * Manages:
 *  - `modal`: 'payslip-details'
 *  - `modalId`: payslipId (for the details view)
 *
 * Note: `selectedPayslip` entity stays as local state (not URL-serializable);
 * derived from the fetched payslips list using `modalId` on cold refresh.
 */
export const useUserPayslipModalParams = () => {
  const { modal, modalId, modalMode, openModal, closeModal, isOpen } =
    useUserPayslipModalBase();

  const isPayslipDetailsOpen = isOpen('payslip-details');

  const openPayslipDetails = (payslipId: string) =>
    openModal('payslip-details', { id: payslipId });

  return {
    modal,
    modalId,
    modalMode,

    // Derived predicates
    isPayslipDetailsOpen,

    // Actions
    openPayslipDetails,
    closeModal,
    isOpen,
  };
};
