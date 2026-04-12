'use client';

import { formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { MainButton } from '@workspace/ui/lib/button';
import { ReusableDialog } from '@workspace/ui/lib/dialog/Dialog';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { useLeaveStore } from '../stores/leave-store';

export function LeaveDetailsDrawer() {
  const {
    showLeaveDetailsDrawer,
    setShowLeaveDetailsDrawer,
    selectedLeaveRequestId,
    selectedLeaveRequest,
    setSelectedLeaveRequest,
    setSelectedLeaveRequestId,
  } = useLeaveStore();

  const leaveRequest = selectedLeaveRequest;

  const handleOpenChange = useCallback(
    (open: boolean) => {
      setShowLeaveDetailsDrawer(open);
      if (!open) {
        setSelectedLeaveRequest(null);
        setSelectedLeaveRequestId(null);
      }
    },
    [
      setSelectedLeaveRequest,
      setSelectedLeaveRequestId,
      setShowLeaveDetailsDrawer,
    ]
  );

  const handleApprove = async () => {
    if (!selectedLeaveRequestId) return;
    // Admin leave module currently only supports reading leave-requests.
    toast.info('Approve/Decline is not available in this build.');
    handleOpenChange(false);
  };

  return (
    <ReusableDialog
      trigger={''}
      open={showLeaveDetailsDrawer}
      onOpenChange={handleOpenChange}
      title="Leave Request"
      className="sm:min-w-xl!"
    >
      <div className="max-h-[80vh] overflow-y-auto pb-8">
        {leaveRequest ? (
          <div className="space-y-6">
            {/* Employee Info */}
            <div className="rounded-lg flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                {leaveRequest.employeeAvatar ? (
                  <Image
                    src={leaveRequest.employeeAvatar}
                    alt={leaveRequest.employeeName}
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-full bg-gray-200">
                    <Icon name="User" size={32} className="text-gray-500" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {leaveRequest.employeeName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Employee ID: {leaveRequest.employeeId}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge
                  className={cn(
                    'rounded-full px-3 py-1 text-sm capitalize',
                    leaveRequest.status === 'pending' &&
                      'bg-warning-50 text-warning',
                    leaveRequest.status === 'approved' &&
                      'bg-success-50 text-success',
                    leaveRequest.status === 'declined' &&
                      'bg-destructive-50 text-destructive'
                  )}
                >
                  {leaveRequest.status.charAt(0).toUpperCase() +
                    leaveRequest.status.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Leave Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Leave Information</h3>

              <div className="grid gap-4 grid-cols-2">
                <div className="rounded-md bg-primary/10 p-4">
                  <div className="text-primary flex items-center gap-2 text-sm">
                    <Icon name="Calendar" size={18} />
                    <span>Leave Type</span>
                  </div>
                  <p className="mt-1 font-medium">
                    {leaveRequest.leaveTypeName}
                  </p>
                </div>

                <div className="rounded-md bg-primary/10 p-4">
                  <div className="text-primary flex items-center gap-2 text-sm">
                    <Icon name="Clock" size={18} />
                    <span>Duration</span>
                  </div>
                  <p className="mt-1 font-medium">{leaveRequest.days} day(s)</p>
                </div>

                <div className="rounded-md bg-primary/10 p-4">
                  <div className="text-primary flex items-center gap-2 text-sm">
                    <Icon name="Calendar" size={18} />
                    <span>Start Date</span>
                  </div>
                  <p className="mt-1 font-medium">
                    {formatDate(leaveRequest.startDate)}
                  </p>
                </div>

                <div className="rounded-md bg-primary/10 p-4">
                  <div className="text-primary flex items-center gap-2 text-sm">
                    <Icon name="Calendar" size={18} />
                    <span>End Date</span>
                  </div>
                  <p className="mt-1 font-medium">
                    {formatDate(leaveRequest.endDate)}
                  </p>
                </div>
              </div>

              <div className="rounded-md">
                <h4 className="text-base font-semibold">Reason</h4>
                <p className="text-muted-foreground bg-muted rounded-md p-4 mt-2 text-sm">
                  {leaveRequest.reason}
                </p>
              </div>

              <div className="rounded-md bg-primary/10 p-4">
                <p className="text-sm font-medium text-foreground">
                  Requested On
                </p>
                <p className="mt-1 text-sm text-foreground">
                  {formatDate(leaveRequest.createdAt)}
                </p>
              </div>

              {leaveRequest.approvedBy && leaveRequest.approvedAt && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium text-foreground">
                    {leaveRequest.status === 'approved'
                      ? 'Approved By'
                      : 'Action By'}
                  </p>
                  <p className="mt-1 text-sm text-foreground">
                    {leaveRequest.approvedBy}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {formatDate(leaveRequest.approvedAt)}
                  </p>
                </div>
              )}
            </div>

            {/* NOTE: Approve/Decline actions are not supported from admin dashboard yet. */}
            {leaveRequest.status === 'pending' && (
              <div className="space-y-3 border-t pt-6">
                <MainButton
                  variant="primary"
                  onClick={handleApprove}
                  className="w-full"
                  isLeftIconVisible={false}
                >
                  Confirm Leave Request
                </MainButton>
                <MainButton
                  variant="destructiveOutline"
                  onClick={handleApprove}
                  className="w-full border-destructive/50 text-destructive"
                  isLeftIconVisible={false}
                >
                  Reject Leave Request
                </MainButton>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Leave request not found.</p>
          </div>
        )}
      </div>
    </ReusableDialog>
  );
}
