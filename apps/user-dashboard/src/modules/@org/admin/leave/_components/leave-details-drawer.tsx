"use client";

import { formatDate } from "@/lib/formatters";
import { getApiErrorMessage } from "@/lib/tools/api-error-message";
import { Badge } from "@workspace/ui/components/badge";
import { Drawer, DrawerContent } from "@workspace/ui/components/drawer";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
import { Calendar, Clock, User } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useLeaveService } from "../services/use-service";
import { useLeaveStore } from "../stores/leave-store";

export function LeaveDetailsDrawer() {
  const { showLeaveDetailsDrawer, setShowLeaveDetailsDrawer, selectedLeaveRequestId } = useLeaveStore();

  const { useGetLeaveRequests } = useLeaveService();
  const { data: leaveRequests = [], isLoading, isError, error } = useGetLeaveRequests();

  const hasToastedLoadErrorReference = useRef(false);
  useEffect(() => {
    if (!isError) {
      hasToastedLoadErrorReference.current = false;
      return;
    }

    if (hasToastedLoadErrorReference.current) return;
    hasToastedLoadErrorReference.current = true;

    toast.error("Failed to load leave requests", {
      description: getApiErrorMessage(error, "Could not fetch leave requests from the server."),
    });
  }, [isError, error]);

  const leaveRequest = Array.isArray(leaveRequests)
    ? leaveRequests.find((request) => request.id === selectedLeaveRequestId)
    : undefined;

  const handleApprove = async () => {
    if (!selectedLeaveRequestId) return;
    // Admin leave module currently only supports reading leave-requests.
    toast.info("Approve/Decline is not available in this build.");
    setShowLeaveDetailsDrawer(false);
  };

  return (
    <>
      <Drawer open={showLeaveDetailsDrawer} onOpenChange={setShowLeaveDetailsDrawer}>
        <DrawerContent className="h-[90vh]">
          <div className="overflow-y-auto p-6">
            {isLoading ? (
              <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
                Loading leave request...
              </div>
            ) : leaveRequest ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Leave Request Details</h2>
                    <Badge
                      className={cn(
                        "rounded-full px-3 py-1 text-sm",
                        leaveRequest.status === "pending" && "bg-warning-50 text-warning",
                        leaveRequest.status === "approved" && "bg-success-50 text-success",
                        leaveRequest.status === "declined" && "bg-destructive-50 text-destructive",
                      )}
                    >
                      {leaveRequest.status.charAt(0).toUpperCase() + leaveRequest.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                {/* Employee Info */}
                <div className="rounded-lg border bg-gray-50 p-4">
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
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{leaveRequest.employeeName}</h3>
                      <p className="text-sm text-gray-600">Employee ID: {leaveRequest.employeeId}</p>
                    </div>
                  </div>
                </div>

                {/* Leave Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Leave Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Leave Type</span>
                      </div>
                      <p className="mt-1 font-medium">{leaveRequest.leaveTypeName}</p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Duration</span>
                      </div>
                      <p className="mt-1 font-medium">{leaveRequest.days} day(s)</p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Start Date</span>
                      </div>
                      <p className="mt-1 font-medium">{formatDate(leaveRequest.startDate)}</p>
                    </div>

                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>End Date</span>
                      </div>
                      <p className="mt-1 font-medium">{formatDate(leaveRequest.endDate)}</p>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-gray-600">Reason</p>
                    <p className="mt-2 text-sm text-gray-900">{leaveRequest.reason}</p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <p className="text-sm font-medium text-gray-600">Requested On</p>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(leaveRequest.createdAt)}</p>
                  </div>

                  {leaveRequest.approvedBy && leaveRequest.approvedAt && (
                    <div className="rounded-lg border p-4">
                      <p className="text-sm font-medium text-gray-600">
                        {leaveRequest.status === "approved" ? "Approved By" : "Action By"}
                      </p>
                      <p className="mt-1 text-sm text-gray-900">{leaveRequest.approvedBy}</p>
                      <p className="mt-1 text-xs text-gray-500">{formatDate(leaveRequest.approvedAt)}</p>
                    </div>
                  )}
                </div>

                {/* NOTE: Approve/Decline actions are not supported from admin dashboard yet. */}
                {leaveRequest.status === "pending" && (
                  <div className="border-t pt-6">
                    <MainButton variant="outline" onClick={handleApprove} className="w-full" isLeftIconVisible={false}>
                      Approve/Decline not available
                    </MainButton>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">Leave request not found</p>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
