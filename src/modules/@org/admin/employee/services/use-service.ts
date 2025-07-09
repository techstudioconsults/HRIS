/* eslint-disable @typescript-eslint/no-explicit-any */

import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

import { EmployeeService } from "./service";

// use-service.ts
export const useEmployeeService = () => {
  const { useServiceQuery } = createServiceHooks<EmployeeService>(dependencies.EMPLOYEE_SERVICE);

  // Queries
  const useGetAllEmployees = (filters: IFilters = {}, options?: any) =>
    useServiceQuery(["employees", "list", filters], (service) => service.getAllEmployees(filters), options);

  const useGetEmployeeById = (id: string, options?: any) =>
    useServiceQuery(["employees", "detail", id], (service) => service.getEmployeeById(id), options);

  const useGetAllTeams = (options?: any) =>
    useServiceQuery(["employees", "teams"], (service) => service.getTeams(), options);

  const useDownloadEmployees = (options?: any) =>
    useServiceQuery(["employees", "download"], (service) => service.downloadEmployees(), options);

  return {
    useGetAllEmployees,
    useGetEmployeeById,
    useGetAllTeams,
    useDownloadEmployees,
  };
};
