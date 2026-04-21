'use client';

import { AlertModal } from '@workspace/ui/lib/dialog';
import type { LeaveRequestSubmittedModalProps } from '../types';

export const LeaveRequestSubmittedModal = ({
  open,
  onOpenChange,
}: LeaveRequestSubmittedModalProps) => {
  const handleClose = () => onOpenChange(false);

  return (
    <AlertModal
      isOpen={open}
      onClose={handleClose}
      onConfirm={handleClose}
      type="success"
      title="Leave Request Submitted"
      description="Your leave request has been submitted successfully. You'll receive a notification once it's reviewed by your HR admin."
      confirmText="Close"
      showCancelButton={false}
    />
  );
};
