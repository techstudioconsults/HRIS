/* eslint-disable @typescript-eslint/no-explicit-any */

import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { useQueryClient } from "@tanstack/react-query";

import { EmployeeService } from "./service";

export const useEmployeeService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<EmployeeService>(dependencies.EMPLOYEE_SERVICE);

  // Queries with Suspense support
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

  const useUpdateEmployee = () => {
    const queryClient = useQueryClient();
    return useServiceMutation(
      (service, variables: { id: string; data: FormData; payrollIds?: string[] }) =>
        service.updateEmployee(variables.id, variables.data),
      {
        invalidateQueries: (_, { id, payrollIds }) => {
          const base: (readonly unknown[])[] = [
            ["employee", "list"],
            queryKeys.employee.details(id),
            ["payrolls", "list"], // partial matches all payroll list variants
          ];
          if (Array.isArray(payrollIds)) {
            for (const pid of payrollIds) {
              base.push(queryKeys.payroll.details(pid), ["payrolls", "payslips", pid]);
            }
          }
          return base;
        },
        onSuccess: async () => {
          // Fallback broad invalidation for any cached payroll detail/payslips if caller omitted payrollIds
          await queryClient.invalidateQueries({
            predicate: (q) => {
              const k = q.queryKey as unknown[];
              return Array.isArray(k) && k[0] === "payrolls" && (k[1] === "detail" || k[1] === "payslips");
            },
          });
        },
      },
    );
  };

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
