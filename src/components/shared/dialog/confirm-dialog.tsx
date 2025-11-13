"use client";

import { AlertModal, AlertType } from "./alert-modal";

interface ConfirmDialogProperties {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default" | "warning";
}

/**
 * ConfirmDialog - A reusable confirmation dialog component
 * Wraps AlertModal with a consistent API for confirmation actions
 */
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
}: ConfirmDialogProperties) => {
  const getAlertType = (): AlertType => {
    switch (variant) {
      case "destructive": {
        return "error";
      }
      case "warning": {
        return "warning";
      }
      default: {
        return "info";
      }
    }
  };

  return (
    <AlertModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      loading={loading}
      type={getAlertType()}
      title={title}
      description={description}
      confirmText={confirmText}
      cancelText={cancelText}
      showCancelButton={true}
      confirmVariant={variant === "destructive" ? "destructive" : "primary"}
    />
  );
};
