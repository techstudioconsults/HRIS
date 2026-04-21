'use client';

import { formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { ReusableDialog } from '@workspace/ui/lib';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { LeaveDetailsModalProps, LeaveRequest } from '../types';
import { Card } from '@workspace/ui/components/card';

export const LeaveDetailsModal = ({
  open,
  onOpenChange,
  request,
}: LeaveDetailsModalProps) => {
  const getStatusStyles = (status: LeaveRequest['status']) => {
    if (status === 'approved') return 'bg-success/10 text-success';
    if (status === 'rejected') return 'bg-destructive/10 text-destructive';
    return 'bg-warning/10 text-warning';
  };

  const formatStatusLabel = (status: LeaveRequest['status']) =>
    status.charAt(0).toUpperCase() + status.slice(1);

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
        <Card className=" space-y-4 rounded-lg p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm ">Leave Type</p>
            <p className="text-right text-sm font-medium ">
              {request.leaveTypeName}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm ">Duration</p>
            <p className="text-right text-sm font-medium ">
              {request.days} working days
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm ">Period</p>
            <p className="text-right text-sm font-medium ">
              {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm ">Status</p>
            <Badge
              className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyles(request.status)}`}
            >
              {formatStatusLabel(request.status)}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm ">Requested on</p>
            <p className="text-right text-sm font-medium ">
              {formatDate(request.createdAt)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <p className="text-sm ">Approved By</p>
            <p className="text-right text-sm font-medium ">
              {request.approvedBy ?? 'Pending review'}
            </p>
          </div>

          <div className="flex items-start justify-between gap-4">
            <p className="pt-0.5 text-sm ">Reason</p>
            <p className="max-w-[70%] text-right text-sm font-medium ">
              {request.reason}
            </p>
          </div>

          {request.status === 'rejected' && request.rejectionReason && (
            <div className="flex items-start justify-between gap-4">
              <p className="pt-0.5 text-sm ">Rejection Reason</p>
              <p className="text-destructive max-w-[70%] text-right text-sm font-medium">
                {request.rejectionReason}
              </p>
            </div>
          )}
        </Card>

        {request.supportingDocumentName && (
          <div className="border-primary/20 bg-primary/5 flex items-center justify-between rounded-lg border p-3">
            <div className="flex items-center gap-3">
              <div className="bg-primary/20 rounded p-2">
                <Icon name="FileText" size={16} className="text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium ">
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
