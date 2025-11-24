/* eslint-disable @typescript-eslint/no-explicit-any */
import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/i18n/utils";
import { queryKeys } from "@/lib/react-query/query-keys";
import { cn } from "@/lib/utils";
import { IColumnDefinition, IRowAction } from "@/modules/@org/admin/_components/table/table";
import { AxiosError } from "axios";
import { Edit, MinusCircle, Trash } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { usePayrollService } from "../services/use-service";
import { usePayrollStore } from "../stores/payroll-store";
import { Payslip } from "../types";

export const usePayrollRowActions = () => {
  const { setShowEmployeeInformationDrawer, setSelectedPayslipId, setEmployeeInformationActiveTab } = usePayrollStore();
  const { useDeletePayslip } = usePayrollService();
  const { mutateAsync: deletePayslip, isPending: isDeleting } = useDeletePayslip({
    // When an employee is removed from a payroll, also refresh the suspended-employees list
    // used in AddEmployeeDrawer (useGetSuspendedEmployeesByPayroll).
    invalidateQueries: (_result: any, variables: any) => {
      const payrollId = variables?.payrollId;

      const baseKeys = [["payrolls", "payslips"] as const, ["payrolls", "list", {}] as const];

      const suspendedKey = payrollId ? [queryKeys.employee.suspendedByPayroll(payrollId, {})] : [];

      // Return a new array to satisfy the ReadonlyArray<readonly unknown[]> requirement
      return [...baseKeys, ...suspendedKey];
    },
  });

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
    {
      label: "Edit employee payroll",
      onClick: () => {
        setSelectedPayslipId(payslip?.id ?? null);
        setEmployeeInformationActiveTab("salary-details");
        setShowEmployeeInformationDrawer(true);
      },
      icon: <Edit className="text-high-primary" />,
    },
    { type: "separator" },
    {
      label: "Remove employee from payroll",
      variant: "destructive",
      onClick: () => {
        setPayslipToDelete(payslip);
        setIsDeleteModalOpen(true);
      },
      icon: <Trash className="text-destructive" />,
    },
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
    render: (_, payslip: Payslip) => <span className="text-sm">{payslip.employee?.name ?? ""}</span>,
  },
  {
    header: "Role",
    accessorKey: "employeeId",
    render: (_, payslip: Payslip) => <span className="text-sm">{payslip.employee?.role?.name ?? ""}</span>,
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
