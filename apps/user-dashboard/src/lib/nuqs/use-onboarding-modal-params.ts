'use client';

import { parseAsString, useQueryState } from 'nuqs';
import { useCallback } from 'react';
import { makeModalParams } from './use-modal-search-params';
import type { ModalMode } from './use-modal-search-params';

// ── Modal name union for the onboarding team-config step ─────────────────────

export type OnboardingModal = 'team' | 'role';

const useOnboardingModalBase = makeModalParams<OnboardingModal>([
  'team',
  'role',
]);

/**
 * Modal URL-state hook for the Onboarding → Team Config step.
 *
 * Manages:
 *  - `modal`: 'team' | 'role'
 *  - `modalId`: teamId (for edit-team) or roleId (for edit-role)
 *  - `modalMode`: 'create' | 'edit'
 *  - `teamId`: parent team context when opening a role dialog
 *
 * ⚠️ Only modal open/close state is persisted. Wizard accordion step/progress
 * is separate and not URL-persisted by this hook.
 */
export const useOnboardingModalParams = () => {
  const base = useOnboardingModalBase();
  const [teamId, setTeamId] = useQueryState('teamId', parseAsString);

  // ── Openers ────────────────────────────────────────────────────────────────

  const openTeamModal = useCallback(
    (opts?: { id?: string; mode?: ModalMode }) =>
      base.openModal('team', { id: opts?.id, mode: opts?.mode ?? 'create' }),
    [base]
  );

  const openRoleModal = useCallback(
    async (parentTeamId: string, opts?: { id?: string; mode?: ModalMode }) => {
      await setTeamId(parentTeamId);
      return base.openModal('role', {
        id: opts?.id,
        mode: opts?.mode ?? 'create',
      });
    },
    [base, setTeamId]
  );

  const closeModal = useCallback(async () => {
    await setTeamId(null);
    return base.closeModal();
  }, [base, setTeamId]);

  // ── Derived booleans ────────────────────────────────────────────────────────

  const isTeamModalOpen = base.isOpen('team');
  const isRoleModalOpen = base.isOpen('role');

  return {
    modal: base.modal,
    modalId: base.modalId,
    modalMode: base.modalMode,
    teamId,

    isTeamModalOpen,
    isRoleModalOpen,

    openTeamModal,
    openRoleModal,
    closeModal,
    isOpen: base.isOpen,
  };
};
