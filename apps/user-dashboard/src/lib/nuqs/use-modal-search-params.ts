'use client';

import { parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';
import { useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ModalMode = 'create' | 'edit';

export interface OpenModalOptions {
  id?: string;
  mode?: ModalMode;
}

export interface ModalSearchParams<TModal extends string> {
  /** Currently open modal key, or null when no modal is open. */
  modal: TModal | null;
  /** Entity ID associated with the open modal (edit/view). */
  modalId: string | null;
  /** Modal mode — 'create' | 'edit'. Null means create (default). */
  modalMode: ModalMode | null;
  /** Open a modal by name, optionally with an entity id and mode. */
  openModal: (
    name: TModal,
    opts?: OpenModalOptions
  ) => Promise<URLSearchParams>;
  /** Close the active modal and clear all modal params atomically. */
  closeModal: () => Promise<URLSearchParams>;
  /** Returns true when the named modal is currently open. */
  isOpen: (name: TModal) => boolean;
}

// ── Factory ───────────────────────────────────────────────────────────────────

/**
 * Creates a typed nuqs-backed modal state hook for a given set of modal names.
 *
 * All three params (`modal`, `modalId`, `modalMode`) are updated atomically
 * via a single `router.push` so the browser history always has a consistent
 * snapshot.
 *
 * Usage:
 * ```ts
 * export const useTeamsModalParams = makeModalParams(['team', 'role', 'employee']);
 * ```
 */
export function makeModalParams<TModal extends string>(
  modalNames: readonly TModal[]
): () => ModalSearchParams<TModal> {
  return function useModalParams(): ModalSearchParams<TModal> {
    const [{ modal, modalId, modalMode }, setParams] = useQueryStates({
      modal: parseAsStringEnum<TModal>(modalNames as TModal[]),
      modalId: parseAsString,
      modalMode: parseAsStringEnum<ModalMode>(['create', 'edit']),
    });

    const openModal = useCallback(
      (name: TModal, opts?: OpenModalOptions) =>
        setParams({
          modal: name,
          modalId: opts?.id ?? null,
          modalMode: opts?.mode ?? null,
        }),
      [setParams]
    );

    const closeModal = useCallback(
      () =>
        setParams({
          modal: null,
          modalId: null,
          modalMode: null,
        }),
      [setParams]
    );

    const isOpen = useCallback(
      (name: TModal): boolean => modal === name,
      [modal]
    );

    return {
      modal,
      modalId,
      modalMode,
      openModal,
      closeModal,
      isOpen,
    };
  };
}
