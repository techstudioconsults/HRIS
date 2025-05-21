import React, { useState } from "react";

import SkiButton from "../button";
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
        <SkiButton variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </SkiButton>
        <SkiButton
          isDisabled={action.pending}
          isLoading={action.pending}
          variant="destructive"
          onClick={() => {
            action.onConfirm();
            setIsDialogOpen(false);
            action.onOpenChange(false);
          }}
        >
          {action.buttonName}
        </SkiButton>
      </div>
    </ReusableDialog>
  );
};
