'use client';

import { parseAsStringEnum, useQueryState } from 'nuqs';
import { makeModalParams } from './use-modal-search-params';
import type { SettingsTab } from '@/modules/@org/admin/settings/types';

const SETTINGS_MODAL_NAMES = ['role-editor'] as const;

const SETTINGS_TABS: SettingsTab[] = [
  'account',
  'roles',
  'hr',
  'notifications',
  'security',
];

const useSettingsModalBase = makeModalParams(SETTINGS_MODAL_NAMES);

/**
 * Modal URL-state hook for the Settings page.
 *
 * Manages:
 *  - `settingsTab`: active tab — persisted in URL, defaults to 'account'
 *  - `modal`: 'role-editor'
 *  - `modalId`: roleId (for edit mode)
 *  - `modalMode`: 'create' | 'edit'
 */
export const useSettingsModalParams = () => {
  const { modal, modalId, modalMode, openModal, closeModal, isOpen } =
    useSettingsModalBase();

  const [settingsTab, setSettingsTab] = useQueryState(
    'settingsTab',
    parseAsStringEnum<SettingsTab>(SETTINGS_TABS).withDefault('account')
  );

  const isRoleEditorOpen = isOpen('role-editor');

  const openRoleEditor = (opts?: { id?: string; mode?: 'create' | 'edit' }) =>
    openModal('role-editor', opts);

  return {
    modal,
    modalId,
    modalMode,

    // Tab state
    settingsTab,
    setSettingsTab,

    // Derived predicates
    isRoleEditorOpen,

    // Actions
    openRoleEditor,
    closeModal,
    isOpen,
  };
};
