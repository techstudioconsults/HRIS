'use client';

import { Badge } from '@workspace/ui/components/badge';
import { MainButton } from '@workspace/ui/lib/button';
import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { cn } from '@workspace/ui/lib/utils';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { usePayrollService } from '../services/use-service';
import type { PayrollApproval } from '../types';

interface DevApprovalActionsModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPayrollId: string;
}

export const DevApprovalActionsModal = ({
  open,
  onOpenChange,
  selectedPayrollId,
}: DevApprovalActionsModalProperties) => {
  const { useGetPayrollApprovals, useDecidePayrollApproval } =
    usePayrollService();

  const { data: approvalsResponse, isLoading: isApprovalsLoading } =
    useGetPayrollApprovals(selectedPayrollId, {
      enabled: open && !!selectedPayrollId,
    });

  const { mutateAsync: decideApproval, isPending: isDecidingApproval } =
    useDecidePayrollApproval();

  const approvals = (approvalsResponse?.data ?? []) as PayrollApproval[];

  const handleDecision = async (
    payrollId: string,
    status: 'approved' | 'declined'
  ) => {
    if (!payrollId || isDecidingApproval) return;

    await decideApproval(
      { payrollId, status },
      {
        onSuccess: () => {
          toast.success(
            status === 'approved'
              ? 'Approval accepted successfully.'
              : 'Approval declined successfully.'
          );
        },
        onError: (error) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data.message
              : 'Unable to update approval. Please try again.';
          toast.error(message);
        },
      }
    );
  };

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Approvals (Development)"
      headerClassName="text-xl"
      trigger={<div />}
    >
      <section className="space-y-4">
        {!selectedPayrollId ? (
          <p className="text-muted-foreground text-sm">
            Select a payroll to manage approvals.
          </p>
        ) : isApprovalsLoading ? (
          <p className="text-muted-foreground text-sm">Loading approvals...</p>
        ) : approvals.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No approvals found for this payroll.
          </p>
        ) : (
          approvals.map((approval) => {
            const status = (approval.status ?? 'pending')
              .toString()
              .toLowerCase();
            const statusLabel =
              status.length > 0
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : 'Pending';

            return (
              <section
                key={approval.employee.id}
                className="border-border/50 space-y-3 rounded-lg border p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">
                    {approval.employee.name}
                  </p>
                  <Badge
                    className={cn(
                      'rounded-full px-3 py-1 text-xs',
                      status === 'pending' && 'bg-warning-50 text-warning',
                      status === 'approved' && 'bg-success-50 text-success',
                      status === 'declined' &&
                        'bg-destructive-50 text-destructive'
                    )}
                  >
                    {statusLabel}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <MainButton
                    variant="primary"
                    className="h-8"
                    isDisabled={isDecidingApproval || status === 'approved'}
                    onClick={() => {
                      void handleDecision(approval.payrollId, 'approved');
                    }}
                  >
                    Accept
                  </MainButton>
                  <MainButton
                    variant="outline"
                    className="h-8"
                    isDisabled={isDecidingApproval || status === 'declined'}
                    onClick={() => {
                      void handleDecision(approval.payrollId, 'declined');
                    }}
                  >
                    Decline
                  </MainButton>
                </div>
              </section>
            );
          })
        )}
      </section>
    </ReusableDialog>
  );
};
