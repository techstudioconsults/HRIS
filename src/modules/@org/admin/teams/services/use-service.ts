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
  const useGetAllTeams = (filters: IFilters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(queryKeys.team.list(filters), (service) => service.getAllTeams(filters), options);

  const useGetTeamsById = (id: string, options?: any) =>
    useServiceQuery(queryKeys.team.details(id), (service) => service.getTeamById(id), options);

  // Mutations
  const useDeleteTeam = () =>
    useServiceMutation((service, id: string) => service.deleteTeam(id), {
      onSuccess: () => {
        // Invalidate all team list queries
        return [queryKeys.team.list()];
      },
    });

  return {
    // Queries
    useGetAllTeams,
    useGetTeamsById,

    // Mutations
    useDeleteTeam,
  };
};
