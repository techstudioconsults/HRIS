'use client';

import { ReusableDialog } from '@workspace/ui/lib';
import { Badge } from '@workspace/ui/components/badge';
import { useState } from 'react';
import { RequestLeaveForm } from '@/modules/@org/user';

interface RequestLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const RequestLeaveModal = ({ open, onOpenChange, onSuccess }: RequestLeaveModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: { leaveType: string; startDate: string; endDate: string; reason?: string }) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual submission logic using service
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to submit leave request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-3">
          <span>Request for Leave</span>
          <Badge className="bg-success-50 text-success-700 rounded-full px-3 py-1 text-xs font-medium hover:bg-success-50">
            Paid
          </Badge>
        </div>
      }
      description="Fill in your leave details below. Make sure your dates don't overlap with an existing approved leave."
      trigger={undefined}
      className="sm:max-w-[600px]"
    >
      <RequestLeaveForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
    </ReusableDialog>
  );
};
