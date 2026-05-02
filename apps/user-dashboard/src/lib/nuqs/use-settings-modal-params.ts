'use client';

import { makeModalParams } from './use-modal-search-params';

const SETTINGS_MODAL_NAMES = ['role-editor'] as const;

const useSettingsModalBase = makeModalParams(SETTINGS_MODAL_NAMES);

/**
 * Modal URL-state hook for the Settings → Roles Management tab.
 *
 * Manages:
 *  - `modal`: 'role-editor'
 *  - `modalId`: roleId (for edit mode)
 *  - `modalMode`: 'create' | 'edit'
 *
 * Note: `toggleModal` (activate/deactivate confirm) and `toggleSuccessModal`
 * are destructive/confirmatory and intentionally NOT managed here — they
 * remain as `useState`.
 */
export const useSettingsModalParams = () => {
  const { modal, modalId, modalMode, openModal, closeModal, isOpen } =
    useSettingsModalBase();

  const isRoleEditorOpen = isOpen('role-editor');

  const openRoleEditor = (opts?: { id?: string; mode?: 'create' | 'edit' }) =>
    openModal('role-editor', opts);

  return {
    modal,
    modalId,
    modalMode,

    // Derived predicates
    isRoleEditorOpen,

    // Actions
    openRoleEditor,
    closeModal,
    isOpen,
  };
};
