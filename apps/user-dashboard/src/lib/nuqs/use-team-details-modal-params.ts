'use client';

import { parseAsStringEnum, useQueryState } from 'nuqs';
import { makeModalParams } from './use-modal-search-params';

const TEAM_DETAILS_MODAL_NAMES = ['edit-team', 'add-sub-team'] as const;

export type TeamDetailsTab = 'members' | 'sub-teams';

const TEAM_DETAILS_TABS: TeamDetailsTab[] = ['members', 'sub-teams'];

const useTeamDetailsModalBase = makeModalParams(TEAM_DETAILS_MODAL_NAMES);

/**
 * Modal URL-state hook for the `/admin/teams/[id]` (team details) page.
 *
 * Manages:
 *  - `modal`: 'edit-team' | 'add-sub-team'
 *  - `modalId`: not used on this page (team ID already in route)
 *  - `modalMode`: not used on this page
 *  - `tab`: 'members' | 'sub-teams' — active tab; defaults to 'members'
 *
 * Note: `isDeleteConfirmOpen` is intentionally NOT managed here — it is a
 * destructive confirm dialog and must remain as `useState`.
 */
export const useTeamDetailsModalParams = () => {
  const { modal, modalId, modalMode, openModal, closeModal, isOpen } =
    useTeamDetailsModalBase();

  const [tab, setTab] = useQueryState(
    'tab',
    parseAsStringEnum<TeamDetailsTab>(TEAM_DETAILS_TABS).withDefault('members')
  );

  const isEditTeamOpen = isOpen('edit-team');
  const isAddSubTeamOpen = isOpen('add-sub-team');

  const openEditTeam = () => openModal('edit-team');
  const openAddSubTeam = () => openModal('add-sub-team');

  return {
    modal,
    modalId,
    modalMode,
    tab,
    setTab,

    // Derived predicates
    isEditTeamOpen,
    isAddSubTeamOpen,

    // Actions
    openEditTeam,
    openAddSubTeam,
    closeModal,
    isOpen,
  };
};
