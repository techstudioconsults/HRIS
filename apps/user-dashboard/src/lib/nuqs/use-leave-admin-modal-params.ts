'use client';

import { makeModalParams } from './use-modal-search-params';

const LEAVE_ADMIN_MODAL_NAMES = [
  'create-leave-type',
  'edit-leave-type',
  'leave-setup',
  'leave-details',
] as const;

const useLeaveAdminModalBase = makeModalParams(LEAVE_ADMIN_MODAL_NAMES);

/**
 * Modal URL-state hook for leave admin pages and components.
 *
 * Manages:
 *  - `modal`: 'create-leave-type' | 'edit-leave-type' | 'leave-setup' | 'leave-details'
 *  - `modalId`: leaveTypeId (for edit-leave-type) or leaveRequestId (for leave-details)
 *
 * Note: `deleteDialogOpen` is a destructive confirm and intentionally NOT
 * managed here — it remains as `useState`.
 */
export const useLeaveAdminModalParams = () => {
  const { modal, modalId, modalMode, openModal, closeModal, isOpen } =
    useLeaveAdminModalBase();

  const isCreateLeaveTypeOpen = isOpen('create-leave-type');
  const isEditLeaveTypeOpen = isOpen('edit-leave-type');
  const isLeaveSetupOpen = isOpen('leave-setup');
  const isLeaveDetailsOpen = isOpen('leave-details');

  const openCreateLeaveType = () => openModal('create-leave-type');
  const openEditLeaveType = (leaveTypeId: string) =>
    openModal('edit-leave-type', { id: leaveTypeId, mode: 'edit' });
  const openLeaveSetup = () => openModal('leave-setup');
  const openLeaveDetails = (leaveRequestId: string) =>
    openModal('leave-details', { id: leaveRequestId });

  return {
    modal,
    modalId,
    modalMode,

    // Derived predicates
    isCreateLeaveTypeOpen,
    isEditLeaveTypeOpen,
    isLeaveSetupOpen,
    isLeaveDetailsOpen,

    // Actions
    openCreateLeaveType,
    openEditLeaveType,
    openLeaveSetup,
    openLeaveDetails,
    closeModal,
    isOpen,
  };
};
