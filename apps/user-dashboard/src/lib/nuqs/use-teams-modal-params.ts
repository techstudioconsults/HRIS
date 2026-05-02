'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { useCallback } from 'react';
import { makeModalParams } from './use-modal-search-params';
import type { ModalMode } from './use-modal-search-params';

// ── Modal name union for the /admin/teams page ────────────────────────────────

export type TeamsModal = 'team' | 'role' | 'employee';

// ── Internal base hook (modal + modalId + modalMode) ─────────────────────────

const useTeamsModalBase = makeModalParams<TeamsModal>([
  'team',
  'role',
  'employee',
]);

// ── Public hook ───────────────────────────────────────────────────────────────

/**
 * Manages persist-worthy modal state for the `/admin/teams` page.
 *
 * URL params managed:
 *  - `modal`     — which dialog is open
 *  - `modalId`   — entity ID (edit modals)
 *  - `modalMode` — 'create' | 'edit'
 *  - `teamId`    — parent team context (role / employee dialogs)
 */
export const useTeamsModalParams = () => {
  const base = useTeamsModalBase();
  const [teamId, setTeamId] = useQueryState('teamId', parseAsString);

  // ── Openers ────────────────────────────────────────────────────────────────

  const openTeamDialog = useCallback(
    (opts?: { id?: string; mode?: ModalMode }) =>
      base.openModal('team', { id: opts?.id, mode: opts?.mode ?? 'create' }),
    [base]
  );

  const openRoleDialog = useCallback(
    async (parentTeamId: string, opts?: { id?: string }) => {
      await setTeamId(parentTeamId);
      return base.openModal('role', {
        id: opts?.id,
        mode: opts?.id ? 'edit' : 'create',
      });
    },
    [base, setTeamId]
  );

  const openEmployeeDialog = useCallback(
    async (parentTeamId: string) => {
      await setTeamId(parentTeamId);
      return base.openModal('employee');
    },
    [base, setTeamId]
  );

  const closeModal = useCallback(async () => {
    await setTeamId(null);
    return base.closeModal();
  }, [base, setTeamId]);

  // ── Derived booleans ────────────────────────────────────────────────────────

  const isTeamOpen = base.isOpen('team');
  const isRoleOpen = base.isOpen('role');
  const isEmployeeOpen = base.isOpen('employee');

  return {
    // raw params
    modal: base.modal,
    modalId: base.modalId,
    modalMode: base.modalMode,
    teamId,

    // openers / closer
    openTeamDialog,
    openRoleDialog,
    openEmployeeDialog,
    closeModal,

    // derived booleans
    isTeamOpen,
    isRoleOpen,
    isEmployeeOpen,

    // generic helper
    isOpen: base.isOpen,
  };
};
