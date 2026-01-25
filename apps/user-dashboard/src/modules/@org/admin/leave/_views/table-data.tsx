import { formatDate } from "@/lib/formatters";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { Eye } from "lucide-react";
import Image from "next/image";

import { useLeaveStore } from "../stores/leave-store";
import type { LeaveRequest } from "../types";

export const useLeaveRowActions = () => {
  const { setShowLeaveDetailsDrawer, setSelectedLeaveRequestId } = useLeaveStore();

  const getRowActions = (request: LeaveRequest) => {
    return [
      {
        label: "View Details",
        onClick: () => {
          setSelectedLeaveRequestId(request.id);
          setShowLeaveDetailsDrawer(true);
        },
        icon: <Eye className="h-4 w-4" />,
      },
    ];
  };

  return { getRowActions };
};
export const leaveColumns: IColumnDefinition<LeaveRequest>[] = [
  {
    header: "Employee",
    accessorKey: "employeeName",
    render: (_value, row) => {
      const request = row as LeaveRequest;
      return (
        <div className="flex items-center gap-3">
          {request.employeeAvatar && (
            <Image
              src={request.employeeAvatar}
              alt={request.employeeName}
              width={32}
              height={32}
              className="size-8 rounded-full object-cover"
            />
          )}
          <span className="font-medium">{request.employeeName}</span>
        </div>
      );
    },
  },
  {
    header: "Leave Type",
    accessorKey: "leaveTypeName",
    render: (_value, row) => <span className="text-sm">{row.leaveTypeName}</span>,
  },
  {
    header: "Start Date",
    accessorKey: "startDate",
    render: (_value, row) => <span className="text-sm">{formatDate(row.startDate)}</span>,
  },
  {
    header: "End Date",
    accessorKey: "endDate",
    render: (_value, row) => <span className="text-sm">{formatDate(row.endDate)}</span>,
  },
  {
    header: "Days",
    accessorKey: "days",
    render: (_value, row) => <span className="text-sm font-medium">{row.days}</span>,
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_value, row) => {
      const status = row.status;
      return (
        <Badge
          className={cn(
            "rounded-full px-3 py-1 text-xs",
            status === "pending" && "bg-warning-50 text-warning",
            status === "approved" && "bg-success-50 text-success",
            status === "declined" && "bg-destructive-50 text-destructive",
          )}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      );
    },
  },
  {
    header: "Requested On",
    accessorKey: "createdAt",
    render: (_value, row) => <span className="text-sm text-gray-500">{formatDate(row.createdAt)}</span>,
  },
];
