import { AlertModal } from "@/components/shared/dialog/alert-modal";
import { EmailTooltip, NameTooltip } from "@/components/shared/tooltip";
import { Badge } from "@/components/ui/badge";
import { IColumnDefinition, IRowAction } from "@/modules/@org/admin/_components/table/table";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { useEmployeeService } from "../services/use-service";

export const useEmployeeRowActions = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { useDeleteEmployee } = useEmployeeService();
  const { mutateAsync: deleteEmployee, isPending } = useDeleteEmployee();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetModalState = () => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
    setIsDeleting(false);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete || isDeleting) return;

    setIsDeleting(true);

    await deleteEmployee(employeeToDelete.id);
    // Manually invalidate the employees cache to ensure table refreshes
    await queryClient.invalidateQueries({ queryKey: ["employee", "list"] });
    toast.success(`Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} deleted successfully!`);

    // Close modal after successful deletion
    resetModalState();
  };

  const getRowActions = (employee: Employee) => {
    const actions: IRowAction<Employee>[] = [];
    actions.push(
      {
        label: "View employee",
        onClick: async () => {
          router.push(`/admin/employees/${employee.id}`);
        },
        // icon: <MinusCircle className={`text-high-warning`} />,
      },
      {
        label: "Edit Employee",
        onClick: () => {
          router.push(`/admin/employees/edit-employee?employeeid=${employee.id}`);
        },
        // icon: <Edit className={`text-high-primary`} />,
      },
      {
        label: "Delete Employee",
        onClick: () => {
          setEmployeeToDelete(employee);
          setIsDeleteModalOpen(true);
        },
        // icon: <Trash className={`text-high-error`} />,
      },
    );
    return actions;
  };

  const DeleteConfirmationModal = () => (
    <AlertModal
      isOpen={isDeleteModalOpen}
      onClose={() => {
        // Only allow closing if not currently deleting
        if (!isDeleting && !isPending) {
          resetModalState();
        }
      }}
      onConfirm={handleDeleteEmployee}
      loading={isDeleting || isPending}
      type="warning"
      title="Delete Employee"
      description={`Are you sure you want to delete "${employeeToDelete?.firstName} ${employeeToDelete?.lastName}"? This action cannot be undone.`}
      confirmText="Delete Employee"
      cancelText="Cancel"
    />
  );

  return { getRowActions, DeleteConfirmationModal };
};

export const employeeColumn: IColumnDefinition<Employee>[] = [
  {
    header: "Name",
    accessorKey: "firstName",
    render: (_, employee: Employee) => (
      <div className={`flex w-fit items-center gap-2`}>
        <Image
          src={
            typeof employee.avatar === "string" && employee.avatar.length > 0
              ? employee.avatar
              : "https://res.cloudinary.com/kingsleysolomon/image/upload/v1699879092/techstudio/icons/avatar_vvgjji_zzdq9m.png"
          }
          alt={employee.firstName}
          width={100}
          height={100}
          className={`bg-low-grey-III h-8 w-8 rounded-full object-cover`}
        />
        <div className="flex flex-col space-y-2">
          <NameTooltip name={`${employee.firstName} ${employee.lastName}`}>
            <span className="text-sm font-medium capitalize">{`${employee.firstName} ${employee.lastName}`}</span>
          </NameTooltip>
        </div>
      </div>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
    render: (_, employee: Employee) => (
      <EmailTooltip email={employee?.email}>
        <span className="truncate text-sm">{employee?.email.slice(0, 20)}...</span>
      </EmailTooltip>
    ),
  },
  {
    header: "Role",
    accessorKey: "role",
    render: (_, employee: Employee) => (
      <Badge className="capitalize" variant={`primary`}>
        {employee?.employmentDetails?.role?.name}
      </Badge>
    ),
  },
  {
    header: "Department",
    accessorKey: "department",
    render: (_, employee: Employee) => (
      <Badge className="capitalize" variant={`primary`}>
        {employee?.employmentDetails?.team?.name}
      </Badge>
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_, employee: Employee) => (
      <Badge className="min-w-fit capitalize" variant={employee.status === "active" ? "success" : "warning"}>
        {employee.status}
      </Badge>
    ),
  },
];
