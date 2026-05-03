'use client';

import { makeModalParams } from './use-modal-search-params';

const RESOURCES_MODAL_NAMES = [
  'create-folder',
  'upload-file',
  'rename-folder',
] as const;

const useResourcesModalBase = makeModalParams(RESOURCES_MODAL_NAMES);

/**
 * Modal URL-state hook for the Resources page.
 *
 * Manages:
 *  - `modal`: 'create-folder' | 'upload-file' | 'rename-folder'
 *  - `modalId`: folderId (for rename-folder)
 *
 * Note:
 *  - `deleteDialogOpen` is a destructive confirm — stays as `useState`.
 *  - `viewFolderDialog` is a micro-navigation interaction — stays as `useState`.
 */
export const useResourcesModalParams = () => {
  const { modal, modalId, modalMode, openModal, closeModal, isOpen } =
    useResourcesModalBase();

  const isCreateFolderOpen = isOpen('create-folder');
  const isUploadFileOpen = isOpen('upload-file');
  const isRenameFolderOpen = isOpen('rename-folder');

  const openCreateFolder = () => openModal('create-folder');
  const openUploadFile = () => openModal('upload-file');
  const openRenameFolder = (folderId: string) =>
    openModal('rename-folder', { id: folderId });

  return {
    modal,
    modalId,
    modalMode,

    // Derived predicates
    isCreateFolderOpen,
    isUploadFileOpen,
    isRenameFolderOpen,

    // Actions
    openCreateFolder,
    openUploadFile,
    openRenameFolder,
    closeModal,
    isOpen,
  };
};
