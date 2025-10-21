import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";

export const useEmployeeRowActions = () => {
  const router = useRouter();

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
          router.push(`/admin/employees/add-employee?employeeid=${employee.id}`);
        },
        // icon: <Eye className={`text-high-primary`} />,
      },
    );
    return actions;
  };
  return { getRowActions };
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
              : "https://res.cloudinary.com/kingsleysolomon/image/upload/v1742989662/byte-alley/fisnolvvuvfiebxskgbs.svg"
          }
          alt={employee.firstName}
          width={100}
          height={100}
          className={`bg-low-grey-III h-8 w-8 rounded-full object-cover`}
        />
        <div className="flex flex-col space-y-2">
          <span className="text-sm font-medium lg:text-[16px]">{`${employee.firstName} ${employee.lastName}`}</span>
        </div>
      </div>
    ),
  },
  {
    header: "Email",
    accessorKey: "email",
  },
  {
    header: "Role",
    accessorKey: "email",
    render: (_, employee: Employee) => <span>{employee?.employmentDetails?.role?.name}</span>,
  },
  {
    header: "Department",
    accessorKey: "email",
    render: (_, employee: Employee) => <span>{employee?.employmentDetails?.team?.name}</span>,
  },
  {
    header: "Status",
    accessorKey: "status",
    render: (_, employee: Employee) => (
      <Badge
        className={cn(
          employee.id.includes(`7`) ? "bg-warning-50 text-warning" : "bg-success-50 text-success",
          "rounded-full px-4 py-2",
        )}
      >
        {/* {employee.status || "Active"} */}
        {employee.id.includes(`7`) ? "On Leave" : "Active"}
      </Badge>
    ),
  },
];
