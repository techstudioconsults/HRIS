import { IColumnDefinition, IRowAction } from "@/modules/@org/admin/_components/table/table";
import { useRouter } from "next/navigation";

import { PayrollSummary } from "../types";

export const usePayrollRowActions = () => {
  const router = useRouter();

  const getRowActions = () => {
    const actions: IRowAction<PayrollSummary>[] = [];
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

export const payrollColumn: IColumnDefinition<PayrollSummary>[] = [
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Role",
    accessorKey: "role",
  },
  {
    header: "Gross Pay",
    accessorKey: "grossPay",
  },
  {
    header: "Net Pay",
    accessorKey: "netPay",
  },
  {
    header: "Deduction",
    accessorKey: "deduction",
  },
  {
    header: "Bonus",
    accessorKey: "bonus",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
];
