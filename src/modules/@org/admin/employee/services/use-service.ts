/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { EmployeeService } from "./service";

export const useEmployeeService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<EmployeeService>(dependencies.EMPLOYEE_SERVICE);

  // Queries
  const useGetAllEmployees = (filters: Filters = {}, options?: any) =>
    useServiceQuery(queryKeys.employee.list(filters), (service) => service.getAllEmployees(filters), options);

  const useGetSuspendedEmployeesByPayroll = (payrollId: string, filters: Filters = {}, options?: any) =>
    useServiceQuery(
      queryKeys.employee.suspendedByPayroll(payrollId, filters),
      (service) => service.getSuspendedEmployeesByPayroll(payrollId, filters),
      options,
    );

  const useGetEmployeeById = (id: string, options?: any) =>
    useServiceQuery(queryKeys.employee.details(id), (service) => service.getEmployeeById(id), options);

  const useGetAllTeams = (options?: any) =>
    useServiceQuery(queryKeys.employee.teams(), (service) => service.getTeams(), options);

  // Use mutation for on-demand filtered downloads
  const useDownloadEmployees = () =>
    useServiceMutation((service, filters: Filters) => service.downloadEmployees(filters));

  // Mutations with proper cache invalidation
  const useCreateEmployee = () =>
    useServiceMutation((service, data: FormData) => service.createEmployee(data), {
      invalidateQueries: () => {
        // Invalidate all employee list queries (with any filters)
        return [["employee", "list"]];
      },
    });

  const useUpdateEmployee = () =>
    useServiceMutation((service, { id, data }: { id: string; data: FormData }) => service.updateEmployee(id, data), {
      invalidateQueries: (_, { id }) => {
        // Invalidate all employee list queries (with any filters) and specific employee details
        return [["employee", "list"], queryKeys.employee.details(id)];
      },
    });

  const useDeleteEmployee = () =>
    useServiceMutation((service, id: string) => service.deleteEmployee(id), {
      invalidateQueries: () => {
        // Invalidate all employee list queries (with any filters)
        return [["employee", "list"]];
      },
    });

  return {
    // Queries
    useGetAllEmployees,
    useGetSuspendedEmployeesByPayroll,
    useGetEmployeeById,
    useGetAllTeams,
    useDownloadEmployees,
    // Mutations
    useCreateEmployee,
    useUpdateEmployee,
    useDeleteEmployee,
  };
};
