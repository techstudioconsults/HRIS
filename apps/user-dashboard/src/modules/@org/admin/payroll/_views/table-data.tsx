/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatCurrency } from "@/lib/formatters";
import { IColumnDefinition, IRowAction } from "@/modules/@org/admin/_components/table/table";
import { Badge } from "@workspace/ui/components/badge";
import { AlertModal } from "@workspace/ui/lib";
import { cn } from "@workspace/ui/lib/utils";
import { AxiosError } from "axios";
import { Trash } from "iconsax-reactjs";
import { Edit, MinusCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";
import { Payslip } from "../types";

export const usePayrollRowActions = () => {
  const { setShowEmployeeInformationDrawer, setSelectedPayslipId, setEmployeeInformationActiveTab } = usePayrollStore();
  const { useDeletePayslip } = usePayrollService();
  const { mutateAsync: deletePayslip, isPending: isDeleting } = useDeletePayslip();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [payslipToDelete, setPayslipToDelete] = useState<Payslip | null>(null);

  const resetModalState = useCallback(() => {
    setIsDeleteModalOpen(false);
    setPayslipToDelete(null);
  }, []);

  const handleDeletePayslip = useCallback(async () => {
    if (!payslipToDelete || isDeleting) return;

    await deletePayslip(
      {
        payrollId: payslipToDelete.payrollId as any,
        payslipId: payslipToDelete.id,
      },
      {
        onSuccess: () => {
          toast.success("Employee removed from payroll successfully.");
          resetModalState();
        },
        onError: (error) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data.message
              : "Failed to remove employee from payroll. Please try again.";
          toast.error(message);
        },
      },
    );
  }, [deletePayslip, isDeleting, payslipToDelete, resetModalState]);

  const getRowActions = (payslip: Payslip): IRowAction<Payslip>[] => [
    {
      label: "View employee payroll details",
      onClick: () => {
        // Use employeeId so the drawer can fetch via
        // GET /payrolls/{{payrollId}}/payslips?employeeId={{employeeId}}
        setSelectedPayslipId(payslip.id ?? null);
        setEmployeeInformationActiveTab("employee-information");
        setShowEmployeeInformationDrawer(true);
      },
      icon: <MinusCircle className="text-high-warning" />,
    },
    ...(payslip?.status === "paid"
      ? []
      : [
          {
            label: "Edit employee payroll",
            onClick: () => {
              setSelectedPayslipId(payslip?.id ?? null);
              setEmployeeInformationActiveTab("salary-details");
              setShowEmployeeInformationDrawer(true);
            },
            icon: <Edit className="text-high-primary" />,
          },
          { type: "separator" as const },
          {
            label: "Remove employee from payroll",
            variant: "destructive" as const,
            onClick: () => {
              setPayslipToDelete(payslip);
              setIsDeleteModalOpen(true);
            },
            icon: <Trash className="text-destructive" />,
          },
        ]),
  ];

  const DeleteConfirmationModal = () => (
    <AlertModal
      isOpen={isDeleteModalOpen}
      onClose={() => {
        if (!isDeleting) {
          resetModalState();
        }
      }}
      onConfirm={handleDeletePayslip}
      loading={isDeleting}
      type="warning"
      title="Remove employee from payroll"
      description={`Are you sure you want to remove "${
        payslipToDelete?.employee?.name ?? "this employee"
      }" from this payroll? This action cannot be undone.`}
      confirmText={isDeleting ? "Removing..." : "Remove from payroll"}
      cancelText="Cancel"
    />
  );

  return { getRowActions, DeleteConfirmationModal };
};

export const payrollColumn: IColumnDefinition<Payslip>[] = [
  {
    header: "Name",
    accessorKey: "id",
    render: (_, payslip: Payslip) => (
      <span className="text-sm font-medium capitalize">{payslip.employee?.name ?? ""}</span>
    ),
  },
  {
    header: "Role",
    accessorKey: "employeeId",
    render: (_, payslip: Payslip) => <span className="text-sm capitalize">{payslip.employee?.role?.name ?? ""}</span>,
  },
  {
    header: "Gross Pay",
    accessorKey: "grossPay",
    render: (_, payslip: Payslip) => <span className="text-sm">{formatCurrency(payslip.grossPay)}</span>,
  },
  {
    header: "Deduction",
    accessorKey: "totalDeductions",
    render: (_, payslip: Payslip) => <span className="text-sm">{formatCurrency(payslip.totalDeductions)}</span>,
  },
  {
    header: "Bonus",
    accessorKey: "totalBonuses",
    render: (_, payslip: Payslip) => <span className="text-sm">{formatCurrency(payslip.totalBonuses)}</span>,
  },
  {
    header: "Net Pay",
    accessorKey: "netPay",
    render: (_, payslip: Payslip) => <span className="text-success text-sm">{formatCurrency(payslip.netPay)}</span>,
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_, payslip: Payslip) => (
      <Badge
        className={cn(
          "rounded-full px-4 py-2 text-sm capitalize",
          payslip.status === "paid"
            ? "bg-success-50 text-success"
            : payslip.status === "pending"
              ? "bg-warning-50 text-warning"
              : payslip.status === "failed"
                ? "bg-destructive-50 text-destructive"
                : "bg-gray-100 text-gray-800",
        )}
      >
        {payslip.status}
      </Badge>
    ),
  },
];
