/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { AlertTriangle, Info } from "lucide-react";

// import { useEffect, useState } from "react";

import { MainButton } from "../button";
import { Dialog, DialogContent } from "@workspace/ui/components/dialog";

export type AlertType = "success" | "error" | "warning" | "info";

interface AlertModalProperties {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  loading?: boolean;
  type: AlertType;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
  // Optional className overrides for flexible styling
  containerClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  actionsClassName?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  /**
   * Override the confirm button variant. Defaults to a variant based on the `type`.
   * Available variants: "default" | "primary" | "destructive" | "subtle" | "loading" |
   * "outline" | "secondary" | "ghost" | "link" | "accent"
   */
  confirmVariant?:
    | "default"
    | "primary"
    | "destructive"
    | "subtle"
    | "loading"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "accent";
  /**
   * Override the cancel button variant. Defaults to "outline".
   */
  cancelVariant?:
    | "default"
    | "primary"
    | "destructive"
    | "subtle"
    | "loading"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "accent";
}

const SuccessIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM13.707 21.707L8.293 16.293C7.902 15.902 7.902 15.269 8.293 14.878C8.684 14.487 9.317 14.487 9.707 14.878L14 19.172L22.293 10.879C22.684 10.488 23.317 10.488 23.707 10.879C24.098 11.27 24.098 11.903 23.707 12.293L13.707 21.707Z"
      fill="#10B981"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 2C8.268 2 2 8.268 2 16C2 23.732 8.268 30 16 30C23.732 30 30 23.732 30 16C30 8.268 23.732 2 16 2ZM20.707 11.293C21.098 11.684 21.098 12.317 20.707 12.707L18.414 15L20.707 17.293C21.098 17.684 21.098 18.317 20.707 18.707C20.512 18.902 20.256 19 20 19C19.744 19 19.488 18.902 19.293 18.707L17 16.414L14.707 18.707C14.512 18.902 14.256 19 14 19C13.744 19 13.488 18.902 13.293 18.707C12.902 18.316 12.902 17.683 13.293 17.293L15.586 15L13.293 12.707C12.902 12.316 12.902 11.683 13.293 11.293C13.684 10.902 14.317 10.902 14.707 11.293L17 13.586L19.293 11.293C19.684 10.902 20.317 10.902 20.707 11.293Z"
      fill="#EF4444"
    />
  </svg>
);

const alertConfig = {
  success: {
    icon: SuccessIcon,
    iconColor: "text-green-600",
    bgColor: "bg-green-100",
    borderColor: "border-green-500",
    buttonVariant: "primary" as const,
  },
  error: {
    icon: ErrorIcon,
    iconColor: "text-red-600",
    bgColor: "bg-red-100",
    borderColor: "border-red-500",
    buttonVariant: "destructive" as const,
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-600",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-500",
    buttonVariant: "destructive" as const,
  },
  info: {
    icon: Info,
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-500",
    buttonVariant: "default" as const,
  },
};

export const AlertModal: React.FC<AlertModalProperties> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  type,
  title,
  description,
  confirmText = "Continue",
  cancelText = "Cancel",
  showCancelButton = true,
  autoClose = false,
  autoCloseDelay = 3000,
  confirmVariant,
  cancelVariant,
  containerClassName,
  iconContainerClassName,
  iconClassName,
  contentClassName,
  titleClassName,
  descriptionClassName,
  actionsClassName,
  confirmButtonClassName,
  cancelButtonClassName,
}) => {
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // useEffect(() => {
  //   if (isOpen && autoClose && !loading) {
  //     const timer = setTimeout(() => {
  //       onClose();
  //     }, autoCloseDelay);

  //     return () => clearTimeout(timer);
  //   }
  // }, [isOpen, autoClose, autoCloseDelay, loading, onClose]);

  // if (!isMounted) {
  //   return null;
  // }

  const config = alertConfig[type];
  const resolvedConfirmVariant = confirmVariant ?? config.buttonVariant;
  const resolvedCancelVariant = cancelVariant ?? "outline";

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent
        className={`flex flex-col items-center gap-6 py-8 ${containerClassName ?? ""}`}
      >
        {/* Icon */}
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${config.borderColor} ${config.bgColor} ${iconContainerClassName ?? ""}`}
        >
          {type === "success" || type === "error" ? (
            <config.icon />
          ) : (
            <config.icon
              className={`h-8 w-8 ${config.iconColor} ${iconClassName ?? ""}`}
            />
          )}
        </div>

        {/* Content */}
        <div className={`space-y-2 text-center ${contentClassName ?? ""}`}>
          <h3
            className={`text-xl font-bold text-gray-900 ${titleClassName ?? ""}`}
          >
            {title}
          </h3>
          <p className={`text-sm text-gray-600 ${descriptionClassName ?? ""}`}>
            {description}
          </p>
        </div>

        {/* Buttons */}
        <div className={`flex w-full gap-3 ${actionsClassName ?? ""}`}>
          {showCancelButton && (
            <MainButton
              isDisabled={loading}
              variant={resolvedCancelVariant}
              onClick={onClose}
              className={`flex-1 ${cancelButtonClassName ?? ""}`}
            >
              {cancelText}
            </MainButton>
          )}
          <MainButton
            isDisabled={loading}
            variant={resolvedConfirmVariant}
            onClick={onConfirm ?? onClose}
            className={`flex-1 ${confirmButtonClassName ?? ""}`}
            isLoading={loading}
          >
            {confirmText}
          </MainButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
