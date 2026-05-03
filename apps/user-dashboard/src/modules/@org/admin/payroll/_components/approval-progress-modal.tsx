'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { ReusableDialog } from '@workspace/ui/lib/dialog';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { cn } from '@workspace/ui/lib/utils';
import type { AnyIconName } from '@workspace/ui/lib/icons/types';
import type { ReactNode } from 'react';

import type { ApprovalProgressModalProperties } from '../types';

type ApprovalStatus = 'pending' | 'approved' | 'declined';

function getStatus(node: string): ApprovalStatus {
  const s = node.toLowerCase();
  if (s === 'approved') return 'approved';
  if (s === 'declined' || s === 'rejected') return 'declined';
  return 'pending';
}

function formatTimestamp(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

const STATUS_META = {
  approved: {
    icon: 'CheckCircle' as AnyIconName,
    badgeClass: 'bg-success-50 text-success',
  },
  pending: {
    icon: 'Clock' as AnyIconName,
    badgeClass: 'bg-warning-50 text-warning',
  },
  declined: {
    icon: 'CloseCircle' as AnyIconName,
    badgeClass: 'bg-destructive-50 text-destructive',
  },
} as const satisfies Record<
  ApprovalStatus,
  { icon: AnyIconName; badgeClass: string }
>;

export const ApprovalProgressModal = ({
  open,
  onOpenChange,
  selectedPayrollId,
  approvals,
  isApprovalsLoading,
}: ApprovalProgressModalProperties) => {
  const total = approvals.length;
  const completed = approvals.filter(
    (a) => getStatus(a.status) === 'approved'
  ).length;

  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Approval Progress"
      headerClassName="text-xl"
      trigger={<div />}
    >
      <section className="space-y-6">
        {selectedPayrollId ? (
          isApprovalsLoading ? (
            <p className="text-muted-foreground text-sm">
              Loading approvers...
            </p>
          ) : approvals.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No approvers configured for this payroll.
            </p>
          ) : (
            <>
              <div className="bg-muted flex items-center gap-3 rounded-lg p-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary-50">
                  <Icon name="CheckCircle" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-foreground text-sm font-semibold">
                    {completed} of {total} approved
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {total - completed} remaining
                    {completed === total ? ' — all approvals complete' : ''}
                  </p>
                </div>
              </div>

              <ol className="relative border-l-2 border-muted ml-5 space-y-8 pl-6">
                {approvals.map((approval) => {
                  const status = getStatus(approval.status);
                  const meta = STATUS_META[status];

                  const name = approval.employee.name ?? 'Approver';
                  const role = (approval.approverRole as ReactNode) ?? '';
                  const initials =
                    name
                      .split(' ')
                      .map((part) => part.charAt(0))
                      .join('')
                      .toUpperCase()
                      .slice(0, 2) || 'AP';
                  const statusLabel =
                    status.charAt(0).toUpperCase() + status.slice(1);
                  const timestamp =
                    status !== 'pending' && approval.approvedAt
                      ? formatTimestamp(approval.approvedAt)
                      : null;

                  const isCompleted = status !== 'pending';

                  return (
                    <li key={approval.employee.id} className="relative">
                      <span
                        className={cn(
                          'absolute -left-[34px] flex size-7 items-center justify-center rounded-full border-2',
                          isCompleted
                            ? 'bg-primary-50 border-primary'
                            : 'bg-background border-muted-foreground/30'
                        )}
                      >
                        <Icon
                          name={meta.icon}
                          size={14}
                          className={cn(
                            isCompleted
                              ? status === 'declined'
                                ? 'text-destructive'
                                : 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        />
                      </span>

                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9">
                            <AvatarImage
                              src={
                                approval.employee.avatar ??
                                'https://github.com/shadcn.png'
                              }
                              alt={name}
                            />
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-foreground text-sm font-medium">
                              {name}
                            </p>
                            {role ? (
                              <p className="text-muted-foreground text-xs">
                                {role}
                              </p>
                            ) : null}
                            {timestamp ? (
                              <p className="text-muted-foreground mt-0.5 text-xs">
                                {timestamp}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <Badge
                          className={cn(
                            'rounded-full px-3 py-1 text-xs font-medium',
                            meta.badgeClass
                          )}
                        >
                          {statusLabel}
                        </Badge>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </>
          )
        ) : (
          <p className="text-muted-foreground text-sm">
            Select a payroll to view approvers.
          </p>
        )}
      </section>
    </ReusableDialog>
  );
};
