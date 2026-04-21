'use client';

import { formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { ReusableDialog } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { AnyIconName } from '@workspace/ui/lib/icons/types';
import { calculateDaysBetween, cn } from '@workspace/ui/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUserLeaveService } from '@/modules/@org/user';
import type { LeaveDetailsModalProps, LeaveRequest } from '../types';

const STATUS_CONFIG: Record<
  LeaveRequest['status'],
  {
    label: string;
    icon: AnyIconName;
    bannerClass: string;
    badgeClass: string;
    iconClass: string;
  }
> = {
  approved: {
    label: 'Approved',
    icon: 'CheckCircle',
    bannerClass: 'bg-success/10 border-success/20',
    badgeClass: 'bg-success/10 text-success',
    iconClass: 'text-success',
  },
  rejected: {
    label: 'Rejected',
    icon: 'CloseCircle',
    bannerClass: 'bg-destructive/10 border-destructive/20',
    badgeClass: 'bg-destructive/10 text-destructive',
    iconClass: 'text-destructive',
  },
  pending: {
    label: 'Pending Review',
    icon: 'Clock',
    bannerClass: 'bg-warning/10 border-warning/20',
    badgeClass: 'bg-warning/10 text-warning',
    iconClass: 'text-warning',
  },
};

export const LeaveDetailsModal = ({
  open,
  onOpenChange,
  request,
  onEdit,
}: LeaveDetailsModalProps) => {
  const { useDeleteLeaveRequest } = useUserLeaveService();
  const { mutateAsync: deleteRequest, isPending: isDeleting } =
    useDeleteLeaveRequest();

  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) setShowCancelConfirm(false);
    onOpenChange(isOpen);
  };

  const handleCancelConfirm = async () => {
    if (!request) return;
    try {
      await deleteRequest(request.id);
      toast.success('Leave request cancelled successfully.');
      handleClose(false);
    } catch {
      toast.error('Failed to cancel leave request. Please try again.');
    }
  };

  if (!request) return null;

  const config = STATUS_CONFIG[request.status];
  const durationDays = calculateDaysBetween(request.startDate, request.endDate);
  const isPending = request.status === 'pending';

  return (
    <ReusableDialog
      open={open}
      onOpenChange={handleClose}
      title="Leave Request Details"
      description=""
      trigger={undefined}
      className="md:min-w-lg!"
    >
      <div className="space-y-5">
        {/* Status Banner */}
        <div
          className={cn(
            'flex items-center gap-3 rounded-lg border px-4 py-3',
            config.bannerClass
          )}
        >
          <Icon
            name={config.icon}
            size={20}
            className={config.iconClass}
            variant="Bold"
          />
          <div className="flex-1">
            <p className={cn('text-sm font-semibold', config.iconClass)}>
              {config.label}
            </p>
            {request.approvedAt && request.status !== 'pending' && (
              <p className="text-muted-foreground text-xs">
                on {formatDate(request.approvedAt)}
              </p>
            )}
          </div>
          <Badge
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium capitalize',
              config.badgeClass
            )}
          >
            {config.label}
          </Badge>
        </div>

        {/* Leave Type + Request Date */}
        <div>
          <h3 className="text-lg font-bold">{request.type}</h3>
          <p className="text-primary/60 mt-0.5 flex items-center gap-1.5 text-sm">
            <Icon
              name="Calendar"
              size={13}
              variant="Outline"
              className="text-primary/60"
            />
            Requested {formatDate(request.createdAt)}
          </p>
        </div>

        <Separator />

        {/* Duration + Date Range Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-2xl font-black">{durationDays}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">Working Days</p>
          </div>
          <div className="bg-primary/10 flex items-center justify-center rounded-lg p-3 text-center">
            <div>
              <p className="text-sm font-semibold">
                {formatDate(request.startDate)}
              </p>
              <p className="text-muted-foreground mt-0.5 flex items-center justify-center gap-1 text-xs">
                <Icon name="Calendar" size={11} variant="Outline" />
                Start Date
              </p>
            </div>
          </div>
          <div className="bg-primary/10 flex items-center justify-center rounded-lg p-3 text-center">
            <div>
              <p className="text-sm font-semibold">
                {formatDate(request.endDate)}
              </p>
              <p className="text-muted-foreground mt-0.5 flex items-center justify-center gap-1 text-xs">
                <Icon name="Calendar" size={11} variant="Outline" />
                End Date
              </p>
            </div>
          </div>
        </div>

        {/* Reviewed By */}
        {request.approvedBy && (
          <>
            <Separator />
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-full">
                <Icon
                  name="User"
                  size={16}
                  className="text-primary"
                  variant="Bold"
                />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">
                  {request.status === 'approved'
                    ? 'Approved by'
                    : 'Reviewed by'}
                </p>
                <p className="text-sm font-medium">{request.approvedBy}</p>
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Reason */}
        <div className="space-y-2">
          <p className="flex items-center gap-1.5 text-sm font-semibold">
            <Icon name="InfoCircle" size={15} variant="Outline" />
            Reason for Leave
          </p>
          <p className="bg-primary/10 text-muted-foreground rounded-lg px-4 py-3 text-sm leading-relaxed">
            {request.reason}
          </p>
        </div>

        {/* Rejection Reason */}
        {request.status === 'rejected' && request.rejectionReason && (
          <div className="space-y-2">
            <p className="text-destructive flex items-center gap-1.5 text-sm font-semibold">
              <Icon
                name="CloseCircle"
                size={15}
                variant="Outline"
                className="text-destructive"
              />
              Rejection Reason
            </p>
            <p className="border-destructive/20 bg-destructive/5 text-destructive rounded-lg border px-4 py-3 text-sm leading-relaxed">
              {request.rejectionReason}
            </p>
          </div>
        )}

        {/* Supporting Document */}
        {request.supportingDocumentName && (
          <>
            <Separator />
            <div className="border-primary/20 bg-primary/5 flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <div className="bg-primary/15 rounded-md p-2">
                  <Icon
                    name="FileText"
                    size={16}
                    className="text-primary"
                    variant="Outline"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {request.supportingDocumentName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Supporting document
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:bg-primary/10"
              >
                <Icon name="Download" size={16} />
              </Button>
            </div>
          </>
        )}

        {/* Actions for pending requests */}
        {isPending && (
          <>
            <Separator />
            {showCancelConfirm ? (
              <div className="space-y-3">
                <div className="border-destructive/20 bg-destructive/5 rounded-lg border p-3">
                  <p className="text-destructive text-sm font-medium">
                    Cancel this leave request?
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    This action cannot be undone. Your request will be
                    permanently removed.
                  </p>
                </div>
                <div className="flex gap-3">
                  <MainButton
                    variant="destructiveOutline"
                    onClick={handleCancelConfirm}
                    className="flex-1 border-destructive/50"
                    isLeftIconVisible={false}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Cancelling...' : 'Yes, Cancel Request'}
                  </MainButton>
                  <MainButton
                    variant="outline"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1"
                    isLeftIconVisible={false}
                    disabled={isDeleting}
                  >
                    Keep Request
                  </MainButton>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <MainButton
                  variant="primary"
                  onClick={() => onEdit?.(request)}
                  isLeftIconVisible
                  className={`w-full`}
                  icon={<Icon name="Edit" size={15} variant="Outline" />}
                >
                  Edit Request
                </MainButton>
                <MainButton
                  variant="destructiveOutline"
                  onClick={() => setShowCancelConfirm(true)}
                  className={`w-full`}
                  isLeftIconVisible={false}
                >
                  Cancel Request
                </MainButton>
              </div>
            )}
          </>
        )}
      </div>
    </ReusableDialog>
  );
};
