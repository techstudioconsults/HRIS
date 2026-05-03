'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { useCallback } from 'react';
import { makeModalParams } from './use-modal-search-params';
import type { ModalMode } from './use-modal-search-params';

// ── Modal name union for the /admin/teams/sub-team/[id] page ─────────────────

export type SubTeamModal = 'add-member' | 'role' | 'employee';

// ── Internal base hook (modal + modalId + modalMode) ─────────────────────────

const useSubTeamModalBase = makeModalParams<SubTeamModal>([
  'add-member',
  'role',
  'employee',
]);

/**
 * Modal URL-state hook for the `/admin/teams/sub-team/[id]` page.
 *
 * Manages:
 *  - `modal`: 'add-member' | 'role' | 'employee'
 *  - `modalId`: entity ID (role edit modals)
 *  - `modalMode`: 'create' | 'edit'
 *  - `subTeamId`: sub-team context for role/employee dialogs
 *
 * Mirrors the pattern established in `useTeamsModalParams` for the teams page.
 */
export const useSubTeamModalParams = () => {
  const base = useSubTeamModalBase();
  const [subTeamId, setSubTeamId] = useQueryState('subTeamId', parseAsString);

  // ── Openers ────────────────────────────────────────────────────────────────

  const openAddMember = useCallback(() => base.openModal('add-member'), [base]);

  const openRoleDialog = useCallback(
    async (parentSubTeamId: string, opts?: { id?: string }) => {
      await setSubTeamId(parentSubTeamId);
      return base.openModal('role', {
        id: opts?.id,
        mode: (opts?.id ? 'edit' : 'create') as ModalMode,
      });
    },
    [base, setSubTeamId]
  );

  const openEmployeeDialog = useCallback(
    async (parentSubTeamId: string) => {
      await setSubTeamId(parentSubTeamId);
      return base.openModal('employee');
    },
    [base, setSubTeamId]
  );

  const closeModal = useCallback(async () => {
    await setSubTeamId(null);
    return base.closeModal();
  }, [base, setSubTeamId]);

  // ── Derived booleans ────────────────────────────────────────────────────────

  const isAddMemberOpen = base.isOpen('add-member');
  const isRoleOpen = base.isOpen('role');
  const isEmployeeOpen = base.isOpen('employee');

  return {
    // raw params
    modal: base.modal,
    modalId: base.modalId,
    modalMode: base.modalMode,
    subTeamId,

    // openers / closer
    openAddMember,
    openRoleDialog,
    openEmployeeDialog,
    closeModal,

    // derived booleans
    isAddMemberOpen,
    isRoleOpen,
    isEmployeeOpen,

    // generic helper
    isOpen: base.isOpen,
  };
};
