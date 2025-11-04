import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/i18n/utils";
import { useRouter } from "next/navigation";

import { Payslip } from "../types";

export const usePayrollRowActions = () => {
  const router = useRouter();

  const getRowActions = () => {
    const actions: IRowAction<Payslip>[] = [];
    actions.push(
      {
        label: "View payroll",
        onClick: async (row) => {
          router.push(`/admin/payroll/${row.id}`);
        },
        // icon: <MinusCircle className={`text-high-warning`} />,
      },
      {
        label: "Edit Payroll",
        onClick: (row) => {
          router.push(`/admin/payroll/add-payroll?payrollid=${row.id}`);
        },
        // icon: <Edit className={`text-high-primary`} />,
      },
    );
    return actions;
  };

  //   const DeleteConfirmationModal = () => (
  //     <AlertModal
  //       isOpen={isDeleteModalOpen}
  //       onClose={() => {
  //         // Only allow closing if not currently deleting
  //         if (!isDeleting && !isPending) {
  //           resetModalState();
  //         }
  //       }}
  //       onConfirm={handleDeleteEmployee}
  //       loading={isDeleting || isPending}
  //       type="warning"
  //       title="Delete Employee"
  //       description={`Are you sure you want to delete "${employeeToDelete?.firstName} ${employeeToDelete?.lastName}"? This action cannot be undone.`}
  //       confirmText="Delete Employee"
  //       cancelText="Cancel"
  //     />
  //   );

  return { getRowActions };
};

export const payrollColumn: IColumnDefinition<Payslip>[] = [
  {
    header: "Name",
    accessorKey: "id",
    render: (_, payslip: Payslip) => <span>{payslip.employee?.name ?? ""}</span>,
  },
  {
    header: "Role",
    accessorKey: "employeeId",
    render: (_, payslip: Payslip) => <span>{payslip.employee?.role?.name ?? ""}</span>,
  },
  {
    header: "Gross Pay",
    accessorKey: "grossPay",
    render: (_, payslip: Payslip) => <span>{formatCurrency(payslip.grossPay)}</span>,
  },
  {
    header: "Deduction",
    accessorKey: "totalDeductions",
    render: (_, payslip: Payslip) => <span>{formatCurrency(payslip.totalDeductions)}</span>,
  },
  {
    header: "Bonus",
    accessorKey: "totalBonuses",
    render: (_, payslip: Payslip) => <span>{formatCurrency(payslip.totalBonuses)}</span>,
  },
  {
    header: "Net Pay",
    accessorKey: "netPay",
    render: (_, payslip: Payslip) => <span className="text-success">{formatCurrency(payslip.netPay)}</span>,
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_, payslip: Payslip) => (
      <Badge className="bg-warning-50 text-warning rounded-full px-4 py-2">{payslip.status}</Badge>
    ),
  },
];
