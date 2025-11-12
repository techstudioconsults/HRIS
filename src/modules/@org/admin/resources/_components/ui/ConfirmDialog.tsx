import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";

interface ConfirmDialogProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "destructive" | "primary";
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "destructive",
}: ConfirmDialogProperties) => {
  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={null}
      title={undefined}
      description={undefined}
      img={undefined}
    >
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 rounded-full bg-red-100 p-3">
          <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <MainButton variant="outline" onClick={onCancel} isDisabled={isLoading}>
          {cancelText}
        </MainButton>
        <MainButton variant={variant} onClick={onConfirm} isDisabled={isLoading}>
          {isLoading ? "Processing..." : confirmText}
        </MainButton>
      </div>
    </ReusableDialog>
  );
};
