/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";

// import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TeamService } from "./service";

export const useTeamService = () => {
  // const queryClient = useQueryClient();
  const { useServiceQuery, useServiceMutation } = createServiceHooks<TeamService>(dependencies.TEAM_SERVICE);

  // Queries
  const useGetAllTeams = (filters: Filters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(queryKeys.team.list(filters), (service) => service.getAllTeams(filters), options);

  const useGetTeamsById = (id: string, options?: any) =>
    useServiceQuery(queryKeys.team.details(id), (service) => service.getTeamById(id), options);

  const useGetRoles = (teamId: string, options?: any) =>
    useServiceQuery(["roles", teamId], (service) => service.getRoles(teamId), options);

  const useDownloadTeams = (filters: Filters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(queryKeys.team.download(filters), (service) => service.downloadTeams(filters), options);

  // Mutations
  const useDeleteTeam = () =>
    useServiceMutation((service, id: string) => service.deleteTeam(id), {
      onSuccess: () => {
        // Invalidate all team list queries
        return [queryKeys.team.list()];
      },
    });

  const useCreateRole = () =>
    useServiceMutation(
      (service, roleData: { name: string; teamId: string; permissions: string[] }) => service.createRole(roleData),
      {
        onSuccess: (_, { teamId }) => {
          // Invalidate roles for this team
          return [["roles", teamId]];
        },
      },
    );

  const useUpdateRole = () =>
    useServiceMutation(
      (service, { roleId, name, permissions }: { roleId: string; name?: string; permissions?: string[] }) =>
        service.updateRole(roleId, { name, permissions }),
      // {
      //   onSuccess: (_, { roleId }) => {
      //     // Invalidate all role queries
      //     return [["roles"]];
      //   },
      // },
    );

  const useAssignEmployeeToTeam = () =>
    useServiceMutation(
      (
        service,
        {
          employeeId,
          teamId,
          roleId,
          customPermissions,
        }: { employeeId: string; teamId: string; roleId: string; customPermissions?: string[] },
      ) => service.assignEmployeeToTeam(employeeId, teamId, roleId, customPermissions),
      {
        onSuccess: () => {
          // Invalidate team and employee queries
          return [queryKeys.team.list(), ["employee", "list"]];
        },
      },
    );

  return {
    // Queries
    useGetAllTeams,
    useGetTeamsById,
    useGetRoles,
    useDownloadTeams,

    // Mutations
    useDeleteTeam,
    useCreateRole,
    useUpdateRole,
    useAssignEmployeeToTeam,
  };
};
