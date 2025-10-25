import React, { useState } from "react";

import MainButton from "../button";
import { ReusableDialog } from "./Dialog";

export const ConfirmationDialog = ({
  children,
  action,
}: {
  children: React.ReactNode;
  action: {
    pending: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    buttonName: string;
    img?: string;
  };
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <ReusableDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={children}
      title={action.title}
      description={action.description}
      img={action.img}
      headerClassName={`text-center  font-semibold`}
      wrapperClassName={`flex flex-col items-center justify-center text-center`}
    >
      <div className="flex justify-center gap-4 pt-4">
        <MainButton
          className="text-destructive border-destructive w-full"
          variant="outline"
          onClick={() => setIsDialogOpen(false)}
        >
          Cancel
        </MainButton>
        <MainButton
          className="w-full"
          isDisabled={action.pending}
          isLoading={action.pending}
          variant="primary"
          onClick={() => {
            action.onConfirm();
            setIsDialogOpen(false);
            action.onOpenChange(false);
          }}
        >
          {action.buttonName}
        </MainButton>
      </div>
    </ReusableDialog>
  );
};
