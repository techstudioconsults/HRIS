import { useActiveTarget } from "@/context/active-target";
import { IColumnDefinition, IRowAction } from "@/modules/@org/admin/_components/table/table";
import { useQueryClient } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { AlertModal, EmailTooltip, NameTooltip } from "@workspace/ui/lib";
import { Edit, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useEmployeeShortcuts } from "../../employee/hooks/use-employee-shortcuts";
import { useEmployeeService } from "../services/use-service";

export const useEmployeeRowActions = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { useDeleteEmployee } = useEmployeeService();
  const { mutateAsync: deleteEmployee, isPending } = useDeleteEmployee();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const { entity: activeEmployee, set: setActiveEmployee } = useActiveTarget<Employee>();

  useEmployeeShortcuts();

  const resetModalState = useCallback(() => {
    setIsDeleteModalOpen(false);
    setEmployeeToDelete(null);
    // Clear active target after delete/cancel to avoid stale reference
    setActiveEmployee(null);
  }, [setActiveEmployee]);

  const handleDeleteEmployee = useCallback(async () => {
    if (!employeeToDelete || isPending) return;
    try {
      await deleteEmployee(employeeToDelete.id);
      await queryClient.invalidateQueries({ queryKey: ["employee", "list"] });
      toast.success(`Employee ${employeeToDelete.firstName} ${employeeToDelete.lastName} deleted successfully!`);
      resetModalState();
    } catch (error) {
      const message = (error as { message?: string })?.message || "Failed to delete employee. Please try again.";
      toast.error(message);
      // Optional: send to monitoring service instead of console
    }
  }, [employeeToDelete, isPending, deleteEmployee, queryClient, resetModalState]);

  const getRowActions = useCallback(
    (employee: Employee): IRowAction<Employee>[] => {
      return [
        {
          label: "View employee",
          // kbd: "Ctrl+V",
          icon: <Eye className="h-4 w-4" aria-hidden="true" />,
          onClick: () => {
            setActiveEmployee(employee);
            router.push(`/admin/employees/${employee.id}`);
          },
          // Accessibility improvement: assistive label for action
          ariaLabel: `View ${employee.firstName} ${employee.lastName}`,
        },
        {
          label: "Edit employee",
          // kbd: "Ctrl+E",
          icon: <Edit className="h-4 w-4" aria-hidden="true" />,
          onClick: () => {
            setActiveEmployee(employee);
            router.push(`/admin/employees/edit-employee?employeeid=${employee.id}`);
          },
          ariaLabel: `Edit ${employee.firstName} ${employee.lastName}`,
        },
        // { type: "separator" },
        // {
        //   label: "Delete employee",
        //   kbd: "Ctrl+Del",
        //   variant: "destructive",
        //   icon: <Trash className="text-destructive h-4 w-4" aria-hidden="true" />,
        //   onClick: () => {
        //     setActiveEmployee(employee);
        //     setEmployeeToDelete(employee);
        //     setIsDeleteModalOpen(true);
        //   },
        //   ariaLabel: `Delete ${employee.firstName} ${employee.lastName}`,
        // },
      ];
    },
    [router, setActiveEmployee],
  );

  useEffect(() => {
    const onDeleteRequest = () => {
      if (!activeEmployee) return;
      setEmployeeToDelete(activeEmployee);
      setIsDeleteModalOpen(true);
    };
    window.addEventListener("employee:request-delete", onDeleteRequest);
    return () => window.removeEventListener("employee:request-delete", onDeleteRequest);
  }, [activeEmployee]);

  const DeleteConfirmationModal = () => (
    <AlertModal
      isOpen={isDeleteModalOpen}
      onClose={() => {
        if (!isPending) {
          resetModalState();
        }
      }}
      onConfirm={handleDeleteEmployee}
      loading={isPending}
      type="warning"
      title="Delete Employee"
      description={`Are you sure you want to delete "${employeeToDelete?.firstName} ${employeeToDelete?.lastName}"? This action cannot be undone.`}
      confirmText={isPending ? "Deleting..." : "Delete Employee"}
      cancelText="Cancel"
    />
  );

  return { getRowActions, DeleteConfirmationModal, setActiveEmployee };
};

export const employeeColumn: IColumnDefinition<Employee>[] = [
  {
    header: "Name",
    accessorKey: "firstName",
    render: (_, employee: Employee) => (
      <>
        <div className="group hover:bg-muted/60 flex w-fit cursor-pointer items-center gap-2 rounded-md px-1 py-0.5 transition-colors">
          {/* <Image
            src={
              typeof employee.avatar === "string" && employee.avatar.length > 0
                ? employee.avatar
                : "https://res.cloudinary.com/kingsleysolomon/image/upload/v1699879092/techstudio/icons/avatar_vvgjji_zzdq9m.png"
            }
            alt={employee.firstName}
            width={100}
            height={100}
            className="bg-muted ring-border group-hover:ring-primary/40 h-8 w-8 rounded-full object-cover ring-1"
          /> */}
          <Avatar className={`bg-primary`}>
            <AvatarImage src={employee.avatar || ""} alt={`${employee.firstName} ${employee.lastName}`} />
            <AvatarFallback className="rounded-lg bg-transparent text-sm text-white">
              {`${employee.firstName} ${employee.lastName}`.slice(0, 2).toUpperCase() || "CN"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1">
            <NameTooltip name={`${employee.firstName} ${employee.lastName}`}>
              <span className="text-sm font-medium tracking-wide capitalize">{`${employee.firstName} ${employee.lastName}`}</span>
            </NameTooltip>
            <span className="muted-foreground text-[10px] uppercase">ID: {employee.id.slice(0, 8)}</span>
          </div>
        </div>
      </>
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
      <span className="text-primary text-sm font-medium capitalize">{employee?.employmentDetails?.role?.name}</span>
    ),
  },
  {
    header: "Department",
    accessorKey: "department",
    render: (_, employee: Employee) => (
      <span className="text-primary text-sm font-medium capitalize">{employee?.employmentDetails?.team?.name}</span>
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
