'use client';

import { formatDate } from '@/lib/formatters';
import { useLeaveAdminModalParams } from '@/lib/nuqs/use-leave-admin-modal-params';
import { Textarea } from '@workspace/ui/components/textarea';
import { Badge } from '@workspace/ui/components/badge';
import { MainButton } from '@workspace/ui/lib/button';
import { ReusableDialog } from '@workspace/ui/lib/dialog/Dialog';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { useLeaveService } from '../services/use-service';
import { useLeaveStore } from '../stores/leave-store';
import type { LeaveRequest } from '../types';

export function LeaveDetailsDrawer() {
  // ── URL state (nuqs) — drawer open + entity ID survive refresh  ──────────
  const {
    isLeaveDetailsOpen,
    modalId: leaveRequestId,
    closeModal,
  } = useLeaveAdminModalParams();

  // ── Zustand — entity object (non-URL-serializable) ─────────────────────
  const { selectedLeaveRequest, setSelectedLeaveRequest } = useLeaveStore();

  // Cold-refresh recovery: if drawer is open but entity is not in Zustand,
  // fetch the leave requests list and derive the entry by ID.
  const { useGetLeaveRequests, useApproveLeaveRequest, useRejectLeaveRequest } =
    useLeaveService();

  const { data: leaveRequestsData, isLoading: isListLoading } =
    useGetLeaveRequests(
      {},
      {
        enabled:
          isLeaveDetailsOpen && !selectedLeaveRequest && !!leaveRequestId,
      }
    );

  // Derive the request: prefer Zustand (warm); fall back to list (cold refresh)
  const leaveRequest = useMemo(() => {
    if (selectedLeaveRequest) return selectedLeaveRequest;
    if (!leaveRequestId || !leaveRequestsData) return null;
    const items: LeaveRequest[] = Array.isArray(leaveRequestsData)
      ? (leaveRequestsData as LeaveRequest[])
      : ((leaveRequestsData as { data?: { items?: LeaveRequest[] } })?.data
          ?.items ?? []);
    return items.find((r) => r.id === leaveRequestId) ?? null;
  }, [selectedLeaveRequest, leaveRequestId, leaveRequestsData]);

  const { mutateAsync: approveRequest, isPending: isApproving } =
    useApproveLeaveRequest();
  const { mutateAsync: rejectRequest, isPending: isRejecting } =
    useRejectLeaveRequest();

  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeModal();
        setSelectedLeaveRequest(null);
        setShowRejectForm(false);
        setRejectionReason('');
      }
    },
    [closeModal, setSelectedLeaveRequest]
  );

  const handleApprove = async () => {
    if (!leaveRequestId) return;
    try {
      await approveRequest(leaveRequestId);
      toast.success('Leave request approved.');
      handleOpenChange(false);
    } catch {
      toast.error('Failed to approve leave request. Please try again.');
    }
  };

  const handleRejectConfirm = async () => {
    if (!leaveRequestId || !rejectionReason.trim()) return;
    try {
      await rejectRequest({
        id: leaveRequestId,
        data: { rejectionReason: rejectionReason.trim() },
      });
      toast.success('Leave request rejected.');
      handleOpenChange(false);
    } catch {
      toast.error('Failed to reject leave request. Please try again.');
    }
  };

  // Show loading skeleton on cold-refresh while list is being fetched
  const isLoading = isLeaveDetailsOpen && !leaveRequest && isListLoading;

  return (
    <ReusableDialog
      trigger={''}
      open={isLeaveDetailsOpen}
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
                    leaveRequest.status === 'rejected' &&
                      'bg-destructive/10 text-destructive'
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
                  <p className="mt-1 font-medium">{leaveRequest.type}</p>
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

            {leaveRequest.status === 'pending' && (
              <div className="space-y-4 border-t pt-6">
                {showRejectForm ? (
                  <div className="space-y-3">
                    <label className="text-sm font-medium">
                      Rejection Reason
                    </label>
                    <Textarea
                      placeholder="Provide a reason for rejecting this leave request..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                    <div className="flex gap-3">
                      <MainButton
                        variant="destructiveOutline"
                        onClick={handleRejectConfirm}
                        className="flex-1 border-destructive/50 text-destructive"
                        isLeftIconVisible={false}
                        disabled={!rejectionReason.trim() || isRejecting}
                      >
                        {isRejecting ? 'Rejecting...' : 'Confirm Rejection'}
                      </MainButton>
                      <MainButton
                        variant="outline"
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectionReason('');
                        }}
                        className="flex-1"
                        isLeftIconVisible={false}
                        disabled={isRejecting}
                      >
                        Cancel
                      </MainButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
                    <MainButton
                      variant="primary"
                      onClick={handleApprove}
                      className="w-full"
                      isLeftIconVisible={false}
                      disabled={isApproving}
                    >
                      {isApproving ? 'Approving...' : 'Confirm Leave Request'}
                    </MainButton>
                    <MainButton
                      variant="destructiveOutline"
                      onClick={() => setShowRejectForm(true)}
                      className="w-full border-destructive/50 text-destructive"
                      isLeftIconVisible={false}
                    >
                      Reject Leave Request
                    </MainButton>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
