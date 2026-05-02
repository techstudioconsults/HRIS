'use client';

import { makeModalParams } from './use-modal-search-params';

const SUB_TEAM_MODAL_NAMES = ['add-member'] as const;

const useSubTeamModalBase = makeModalParams(SUB_TEAM_MODAL_NAMES);

/**
 * Modal URL-state hook for the `/admin/teams/sub-team/[id]` page.
 *
 * Manages:
 *  - `modal`: 'add-member'
 *
 * Note: There are two "Add Member" dialog instances in the sub-team-details
 * view (one in the header, one in the empty state). Both read from and write
 * to the same URL param via this hook, so they stay in sync.
 */
export const useSubTeamModalParams = () => {
  const { modal, modalId, modalMode, openModal, closeModal, isOpen } =
    useSubTeamModalBase();

  const isAddMemberOpen = isOpen('add-member');

  const openAddMember = () => openModal('add-member');

  return {
    modal,
    modalId,
    modalMode,

    // Derived predicates
    isAddMemberOpen,

    // Actions
    openAddMember,
    closeModal,
    isOpen,
  };
};
