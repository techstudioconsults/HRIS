/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

// import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TeamService } from "./service";

export const useTeamService = () => {
  // const queryClient = useQueryClient();
  const { useServiceQuery } = createServiceHooks<TeamService>(dependencies.TEAM_SERVICE);

  // Queries
  const useGetAllTeams = (filters: IFilters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(["teams", "list", filters], (service) => service.getAllTeams(filters), options);

  const useGetTeamsById = (id: string, options?: any) =>
    useServiceQuery(["teams", "detail", id], (service) => service.getTeamById(id), options);

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
    useGetAllTeams,
    useGetTeamsById,

    // Mutations
    // useCreateEmployee,
    // useUpdateEmployee,
    // useDeleteEmployee,
  };
};
