import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
// import { Edit, Eye, MinusCircle, Trash } from "lucide-react";
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

export const teamColumn: IColumnDefinition<Team>[] = [
  {
    header: "Team Name",
    accessorKey: "name",
    render: (_, team: Team) => <span>{team.name}</span>,
  },
  {
    header: "Team Lead",
    accessorKey: "manager",
  },
  {
    header: "Sub Teams",
    accessorKey: "subteams",
    render: (_, team: Team) => <span>{team.subteams?.length} Team</span>,
  },
  {
    header: "Members",
    accessorKey: "members",
  },
];

export const useTeamRowActions = () => {
  const router = useRouter();

  const getRowActions = () => {
    const actions: IRowAction<Team>[] = [];
    actions.push(
      {
        label: "View team",
        onClick: async () => {
          router.push(`/`);
        },
        // icon: <MinusCircle className={`text-high-warning`} />,
      },
      {
        label: "Edit team",
        onClick: () => {
          router.push(`/`);
        },
        // icon: <Eye className={`text-high-primary`} />,
      },
      {
        label: "Delete team",
        onClick: () => {
          router.push(`/`);
        },
        // icon: <Eye className={`text-high-primary`} />,
      },
    );
    return actions;
  };
  return { getRowActions };
};

// export const useDeletedProductRowActions = () => {
//   const router = useRouter();
//   const { useDeleteProductPermanently, useRestoreDeleteProduct } = useProductService();

//   const restoreMutation = useRestoreDeleteProduct();
//   const permanentDeleteMutation = useDeleteProductPermanently();

//   const getRowActions = (product: IProduct) => {
//     const actions: IRowAction<IProduct>[] = [
//       {
//         label: "Recover to Draft",
//         onClick: async () => {
//           try {
//             await restoreMutation.mutateAsync(product.id);
//             Toast.getInstance().showToast({
//               title: "Success",
//               description: `Product ${product.title} restored to draft successfully!`,
//               variant: "success",
//             });
//             router.push(`/dashboard/${product.user_id}/products?tab=drafts`);
//           } catch {
//             Toast.getInstance().showToast({
//               title: "Error",
//               description: "Failed to restore product",
//               variant: "error",
//             });
//           }
//         },
//         icon: <Eye className="text-high-primary" />,
//       },
//       {
//         label: "Delete Permanently",
//         onClick: async () => {
//           try {
//             await permanentDeleteMutation.mutateAsync(product.id);
//             Toast.getInstance().showToast({
//               title: "Success",
//               description: `Product ${product.title} deleted permanently!`,
//               variant: "warning",
//             });
//             router.push(`/dashboard/${product.user_id}/products?tab=all-products`);
//           } catch {
//             Toast.getInstance().showToast({
//               title: "Error",
//               description: "Failed to delete product permanently",
//               variant: "error",
//             });
//           }
//         },
//         icon: <Trash className="text-high-danger" />,
//       },
//       {
//         label: "Preview",
//         onClick: () => {
//           router.push(`/dashboard/${product.user_id}/products/new?product_id=${product.id}&tab=preview`);
//         },
//         icon: <Eye className="text-high-primary" />,
//       },
//     ];

//     return actions;
//   };

//   return { getRowActions };
// };
