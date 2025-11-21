/* eslint-disable @typescript-eslint/no-explicit-any */
import { queryKeys } from "@/lib/react-query/query-keys";
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { CompanyProfileFormData } from "@/schemas";

import { OnboardingService } from "./service";

export const useOnboardingService = () => {
  const { useServiceMutation, useServiceQuery } = createServiceHooks<OnboardingService>(
    dependencies.ONBOARDING_SERVICE,
  );

  // Queries
  const useGetCompanyProfile = () =>
    useServiceQuery(queryKeys.onboarding.companyProfile(), (service) => service.getCompanyProfile());

  const useGetTeams = () => useServiceQuery(queryKeys.onboarding.teams(), (service) => service.getTeams());

  const useGetRoles = (teamId: string) =>
    useServiceQuery(queryKeys.onboarding.roles(teamId), (service) => service.getRoles(teamId));

  const useGetRole = (roleId: string) =>
    useServiceQuery(queryKeys.onboarding.role(roleId), (service) => service.getRole(roleId));

  // Combined query to fetch teams along with their roles (used in Team Setup form)
  const useGetTeamsWithRoles = () =>
    useServiceQuery(queryKeys.onboarding.teamsWithRoles(), async (service) => {
      const teams = await service.getTeams();
      const enriched = await Promise.all(
        teams.map(async (team: any) => ({
          ...team,
          roles: await service.getRoles(team.id!),
        })),
      );
      return enriched;
    });

  // Mutations
  const useUpdateCompanyProfile = () =>
    useServiceMutation((service, data: CompanyProfileFormData) => service.updateCompanyProfile(data), {
      invalidateQueries: () => [queryKeys.onboarding.companyProfile()],
    });

  // const useCreateCompany = () =>
  //   useServiceMutation((service, data: CompanyProfileFormData) => service.createCompany(data));

  const useCreateTeam = () =>
    useServiceMutation((service, data: { name: string; parentId?: string }) => service.createTeam(data), {
      invalidateQueries: () => [queryKeys.onboarding.teams(), queryKeys.onboarding.teamsWithRoles()],
    });

  const useUpdateTeam = () =>
    useServiceMutation(
      (service, { teamId, name }: { teamId: string; name: string }) => service.updateTeam(teamId, name),
      {
        invalidateQueries: () => [queryKeys.onboarding.teams(), queryKeys.onboarding.teamsWithRoles()],
      },
    );

  const useDeleteTeam = () =>
    useServiceMutation((service, teamId: string) => service.deleteTeam(teamId), {
      invalidateQueries: () => [queryKeys.onboarding.teams(), queryKeys.onboarding.teamsWithRoles()],
    });

  const useCreateRole = () =>
    useServiceMutation(
      (service, roleData: { name: string; teamId: string; permissions: string[] }) => service.createRole(roleData),
      {
        invalidateQueries: (_data, variables) => [
          queryKeys.onboarding.roles(variables.teamId),
          queryKeys.onboarding.teamsWithRoles(),
        ],
      },
    );

  const useUpdateRole = () =>
    useServiceMutation(
      (
        service,
        { roleId, name, permissions }: { roleId: string; name?: string; permissions?: string[]; teamId: string },
      ) => service.updateRole(roleId, { name, permissions }),
      {
        invalidateQueries: (_data, variables) => [
          queryKeys.onboarding.roles(variables.teamId),
          queryKeys.onboarding.teamsWithRoles(),
        ],
      },
    );

  const useDeleteRole = () =>
    useServiceMutation((service, roleId: string) => service.deleteRole(roleId), {
      invalidateQueries: () => [queryKeys.onboarding.teamsWithRoles()],
    });

  const useOnboardEmployees = () =>
    useServiceMutation((service, data: { employees: any[] }) => service.onboardEmployees(data));

  return {
    // Queries
    useGetCompanyProfile,
    useGetTeams,
    useGetRoles,
    useGetRole,
    useGetTeamsWithRoles,

    // Mutations
    useUpdateCompanyProfile,
    // useCreateCompany,
    useCreateTeam,
    useUpdateTeam,
    useDeleteTeam,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
    useOnboardEmployees,
  };
};
