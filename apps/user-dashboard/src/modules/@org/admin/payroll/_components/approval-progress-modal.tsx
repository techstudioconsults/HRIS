"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { ReusableDialog } from "@workspace/ui/lib";
import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

import type { PayrollApproval } from "../types";

interface ApprovalProgressModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPayrollId: string;
  approvals: PayrollApproval[];
  isApprovalsLoading: boolean;
}

export const ApprovalProgressModal = ({
  open,
  onOpenChange,
  selectedPayrollId,
  approvals,
  isApprovalsLoading,
}: ApprovalProgressModalProperties) => {
  return (
    <ReusableDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Track Approvers Progress"
      className="min-w-2xl"
      headerClassName="text-xl"
      trigger={<div />}
    >
      <section className="space-y-4">
        {selectedPayrollId ? (
          isApprovalsLoading ? (
            <p className="text-muted-foreground text-sm">Loading approvers...</p>
          ) : approvals.length === 0 ? (
            <p className="text-muted-foreground text-sm">No approvers configured for this payroll.</p>
          ) : (
            approvals.map((approval) => {
              const name = approval.employee.name ?? "Approver";
              const role = (approval.approverRole as ReactNode) ?? <></>;
              const initials =
                name
                  .split(" ")
                  .map((part) => part.charAt(0))
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "AP";
              const statusLabel =
                approval.status && approval.status.length > 0
                  ? approval.status.charAt(0).toUpperCase() + approval.status.slice(1)
                  : "Pending";

              return (
                <section key={approval.employee.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={approval.employee.avatar ?? "https://github.com/shadcn.png"} alt={name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-foreground">{name}</p>
                      {role ? <p className="text-xs text-gray-500">{role}</p> : null}
                    </div>
                  </div>
                  <Badge
                    className={cn(
                      "rounded-full px-4 py-2",
                      statusLabel === "Pending" && "bg-warning-50 text-warning",
                      statusLabel === "Approved" && "bg-success-50 text-success",
                      statusLabel === "Declined" && "bg-destructive-50 text-destructive",
                    )}
                  >
                    {statusLabel}
                  </Badge>
                </section>
              );
            })
          )
        ) : (
          <p className="text-muted-foreground text-sm">Select a payroll to view approvers.</p>
        )}
      </section>
    </ReusableDialog>
  );
};
