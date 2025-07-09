// components/shared/dialog/alert-dialog.tsx

import MainButton from "../button";
import { ReusableDialog } from "./Dialog";

interface AlertDialogProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  buttonText?: string;
  img?: string;
}

export const AlertDialog = ({
  open,
  onOpenChange,
  title,
  description,
  buttonText = "Continue",
  img,
}: AlertDialogProperties) => {
  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      trigger={<div style={{ display: "none" }} />}
      title={title}
      description={description}
      img={img || `/images/success.svg`}
      headerClassName="text-center font-semibold"
      wrapperClassName="flex flex-col items-center justify-center text-center"
    >
      <div className="flex justify-center pt-4">
        <MainButton variant={`primary`} className={`w-full`} onClick={() => onOpenChange(false)}>
          {buttonText}
        </MainButton>
      </div>
    </ReusableDialog>
  );
};
