'use client';

import { formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { ReusableDialog } from '@workspace/ui/lib';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { LeaveRequest } from '../types';

interface LeaveDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
}

export const LeaveDetailsModal = ({
  open,
  onOpenChange,
  request,
}: LeaveDetailsModalProps) => {
  const getStatusStyles = (status: LeaveRequest['status']) => {
    if (status === 'approved') return 'bg-[#ECFDF3] text-[#027A48]';
    if (status === 'declined') return 'bg-[#FBE9E9] text-[#DB4B46]';
    return 'bg-[#FCF5E8] text-[#E49817]';
  };

  const formatStatusLabel = (status: LeaveRequest['status']) => {
    if (status === 'declined') return 'Rejected';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (!request) return null;

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Leave Details"
      description=""
      trigger={undefined}
    >
      <section className="space-y-5">
        <div className="bg-[#F7F9FC] space-y-4 rounded-lg p-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#6A717D]">Leave Type</p>
            <p className="text-right text-sm font-medium text-[#232323]">
              {request.leaveTypeName}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#6A717D]">Duration</p>
            <p className="text-right text-sm font-medium text-[#232323]">
              {request.days} working days
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#6A717D]">Period</p>
            <p className="text-right text-sm font-medium text-[#232323]">
              {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#6A717D]">Status</p>
            <Badge
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(request.status)}`}
            >
              {formatStatusLabel(request.status)}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#6A717D]">Requested on</p>
            <p className="text-right text-sm font-medium text-[#232323]">
              {formatDate(request.createdAt)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-[#6A717D]">Approved By</p>
            <p className="text-right text-sm font-medium text-[#232323]">
              {request.approvedBy ?? 'Pending review'}
            </p>
          </div>

          <div className="flex items-start justify-between gap-4">
            <p className="pt-0.5 text-sm text-[#6A717D]">Reason</p>
            <p className="max-w-[70%] text-right text-sm font-medium text-[#232323]">
              {request.reason}
            </p>
          </div>
        </div>

        {request.supportingDocumentName && (
          <div className="border-primary/20 bg-primary/5 flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 rounded p-2">
                <Icon name="FileText" size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#232323]">
                  {request.supportingDocumentName}
                </p>
                <p className="text-xs text-[#6A717D]">Click to download</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-primary">
              <Icon name="Download" size={16} />
            </Button>
          </div>
        )}
      </section>
    </ReusableDialog>
  );
};
