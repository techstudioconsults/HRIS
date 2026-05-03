'use client';

import { makeModalParams } from './use-modal-search-params';

const USER_LEAVE_MODAL_NAMES = [
  'request-leave',
  'leave-details',
  'edit-leave',
] as const;

const useUserLeaveModalBase = makeModalParams(USER_LEAVE_MODAL_NAMES);

/**
 * Modal URL-state hook for the user `/leave` page.
 *
 * Manages:
 *  - `modal`: 'request-leave' | 'leave-details' | 'edit-leave'
 *  - `modalId`: leaveRequestId (for leave-details and edit-leave)
 *
 * Note:
 *  - 'submitted' success alert stays as `useState` (ephemeral, not persist-worthy).
 *  - `selectedRequest` entity object stays as local state (not URL-serializable);
 *    derived from the fetched list via `modalId` on cold refresh.
 */
export const useUserLeaveModalParams = () => {
  const { modal, modalId, modalMode, openModal, closeModal, isOpen } =
    useUserLeaveModalBase();

  const isRequestLeaveOpen = isOpen('request-leave');
  const isLeaveDetailsOpen = isOpen('leave-details');
  const isEditLeaveOpen = isOpen('edit-leave');

  const openRequestLeave = () => openModal('request-leave');
  const openLeaveDetails = (leaveRequestId: string) =>
    openModal('leave-details', { id: leaveRequestId });
  const openEditLeave = (leaveRequestId: string) =>
    openModal('edit-leave', { id: leaveRequestId, mode: 'edit' });

  return {
    modal,
    modalId,
    modalMode,

    // Derived predicates
    isRequestLeaveOpen,
    isLeaveDetailsOpen,
    isEditLeaveOpen,

    // Actions
    openRequestLeave,
    openLeaveDetails,
    openEditLeave,
    closeModal,
    isOpen,
  };
};
