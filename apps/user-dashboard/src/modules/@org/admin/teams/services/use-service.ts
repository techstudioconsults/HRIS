/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from '@/lib/react-query/query-keys';
import { createServiceHooks } from '@/lib/react-query/use-service-query';
import { dependencies } from '@/lib/tools/dependencies';

// import { useMutation, useQueryClient } from "@tanstack/react-query";

import { TeamService } from './service';

export const useTeamService = () => {
  // const queryClient = useQueryClient();
  const { useServiceQuery, useServiceMutation } =
    createServiceHooks<TeamService>(dependencies.TEAM_SERVICE);

  // Queries
  const useGetAllTeams = (
    filters: Filters = Object.create({ page: 1 }),
    options?: any
  ) =>
    useServiceQuery(
      queryKeys.team.list(filters),
      (service) => service.getAllTeams(filters),
      options
    );

  const useGetTeamsById = (id: string, options?: any) =>
    useServiceQuery(
      queryKeys.team.details(id),
      (service) => service.getTeamById(id),
      options
    );

  const useGetRoles = (teamId: string, options?: any) =>
    useServiceQuery(
      ['roles', teamId],
      (service) => service.getRoles(teamId),
      options
    );

  const useDownloadTeams = (
    filters: Filters = Object.create({ page: 1 }),
    options?: any
  ) =>
    useServiceQuery(
      queryKeys.team.download(filters),
      (service) => service.downloadTeams(filters),
      options
    );

  // Mutations
  const useUpdateTeam = () =>
    useServiceMutation(
      (service, { id, data }: { id: string; data: FormData }) =>
        service.updateTeam(id, data),
      {
        invalidateQueries: (_, { id }) => [
          ['teams', 'list'] as unknown as readonly unknown[],
          queryKeys.team.details(id),
          queryKeys.employee.teams(),
        ],
      }
    );

  const useDeleteTeam = () =>
    useServiceMutation((service, id: string) => service.deleteTeam(id), {
      invalidateQueries: () => [
        ['teams', 'list'] as unknown as readonly unknown[],
        queryKeys.employee.teams(),
      ],
    });

  const useCreateRole = () =>
    useServiceMutation(
      (
        service,
        roleData: { name: string; teamId: string; permissions: string[] }
      ) => service.createRole(roleData),
      {
        invalidateQueries: (_, { teamId }) => [
          ['roles', teamId] as readonly unknown[],
          queryKeys.employee.teams(),
        ],
      }
    );

  const useUpdateRole = () =>
    useServiceMutation(
      (
        service,
        {
          roleId,
          name,
          permissions,
        }: { roleId: string; name?: string; permissions?: string[] }
      ) => service.updateRole(roleId, { name, permissions }),
      {
        invalidateQueries: () => [queryKeys.employee.teams()],
      }
    );

  const useDeleteRole = () =>
    useServiceMutation(
      (service, roleId: string) => service.deleteRole(roleId),
      {
        invalidateQueries: () => [queryKeys.employee.teams()],
      }
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
        }: {
          employeeId: string;
          teamId: string;
          roleId: string;
          customPermissions?: string[];
        }
      ) =>
        service.assignEmployeeToTeam(
          employeeId,
          teamId,
          roleId,
          customPermissions
        ),
      {
        onSuccess: () => {
          // Invalidate team and employee queries
          return [queryKeys.team.list(), ['employee', 'list']];
        },
      }
    );

  return {
    // Queries
    useGetAllTeams,
    useGetTeamsById,
    useGetRoles,
    useDownloadTeams,

    // Mutations
    useUpdateTeam,
    useDeleteTeam,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
    useAssignEmployeeToTeam,
  };
};
