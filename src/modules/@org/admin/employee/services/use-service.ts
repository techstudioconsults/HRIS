/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

// import { useMutation, useQueryClient } from "@tanstack/react-query";

import { EmployeeService } from "./service";

export const useEmployeeService = () => {
  // const queryClient = useQueryClient();
  const { useServiceQuery } = createServiceHooks<EmployeeService>(dependencies.EMPLOYEE_SERVICE);

  // Queries
  const useGetAllEmployees = (filters: IFilters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(["employees", "list", filters], (service) => service.getAllEmployees(filters), options);

  const useGetEmployeeById = (id: string, options?: any) =>
    useServiceQuery(["employees", "detail", id], (service) => service.getEmployeeById(id), options);

  // Mutations
  // const useCreateEmployee = () =>
  //   useServiceMutation((service, data: CreateEmployeeDto) => service.createEmployee(data), {
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
  //     },
  //   });

  // const useUpdateEmployee = () =>
  //   useServiceMutation((service, data: UpdateEmployeeDto) => service.updateEmployee(data), {
  //     onSuccess: (_, variables) => {
  //       queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
  //       queryClient.invalidateQueries({ queryKey: ["employees", "detail", variables.id] });
  //     },
  //   });

  // const useDeleteEmployee = () => {
  //   return useMutation({
  //     mutationFn: (id: string) => {
  //       const service = container.get<EmployeeService>(dependencies.EMPLOYEE_SERVICE);
  //       return service.deleteEmployee(id);
  //     },
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ["employees", "list"] });
  //     },
  //   });
  // };

  return {
    // Queries
    useGetAllEmployees,
    useGetEmployeeById,

    // Mutations
    // useCreateEmployee,
    // useUpdateEmployee,
    // useDeleteEmployee,
  };
};
