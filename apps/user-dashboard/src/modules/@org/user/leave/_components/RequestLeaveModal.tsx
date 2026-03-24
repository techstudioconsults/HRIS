'use client';

import { ReusableDialog } from '@workspace/ui/lib';
import { Badge } from '@workspace/ui/components/badge';
import { useState } from 'react';
import { toast } from 'sonner';
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
      void data;
      await new Promise((resolve) => setTimeout(resolve, 1000));

      onSuccess?.();
      onOpenChange(false);
    } catch {
      toast.error('Failed to submit leave request.');
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
      title="Request for Leave"
      description="Fill in your leave details below. Make sure your dates don't overlap with an existing approved leave."
      trigger={undefined}
    >
      <div className="mb-4 flex items-center gap-3">
        <Badge className="bg-success-50 text-success-700 rounded-ful py-1 text-xs font-medium hover:bg-success-50">
          Paid
        </Badge>
      </div>
      <RequestLeaveForm onSubmit={handleSubmit} onCancel={handleCancel} isSubmitting={isSubmitting} />
    </ReusableDialog>
  );
};
