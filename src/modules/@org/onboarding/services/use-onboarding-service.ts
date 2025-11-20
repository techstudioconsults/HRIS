/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { CompanyProfileFormData } from "@/schemas";

import { OnboardingService } from "./service";

export const useOnboardingService = () => {
  const { useServiceMutation, useServiceQuery } = createServiceHooks<OnboardingService>(
    dependencies.ONBOARDING_SERVICE,
  );

  // Queries
  const useGetCompanyProfile = () => useServiceQuery(["company-profile"], (service) => service.getCompanyProfile());

  const useGetTeams = () => useServiceQuery(["teams"], (service) => service.getTeams());

  const useGetRoles = (teamId: string) => useServiceQuery(["roles", teamId], (service) => service.getRoles(teamId));

  const useGetRole = (roleId: string) => useServiceQuery(["role", roleId], (service) => service.getRole(roleId));

  // Mutations
  const useUpdateCompanyProfile = () =>
    useServiceMutation((service, data: CompanyProfileFormData) => service.updateCompanyProfile(data));

  const useCreateCompany = () =>
    useServiceMutation((service, data: CompanyProfileFormData) => service.createCompany(data));

  const useCreateTeam = () =>
    useServiceMutation((service, data: { name: string; parentId?: string }) => service.createTeam(data));

  const useUpdateTeam = () =>
    useServiceMutation((service, { teamId, name }: { teamId: string; name: string }) =>
      service.updateTeam(teamId, name),
    );

  const useDeleteTeam = () => useServiceMutation((service, teamId: string) => service.deleteTeam(teamId));

  const useCreateRole = () =>
    useServiceMutation((service, roleData: { name: string; teamId: string; permissions: string[] }) =>
      service.createRole(roleData),
    );

  const useUpdateRole = () =>
    useServiceMutation(
      (service, { roleId, name, permissions }: { roleId: string; name?: string; permissions?: string[] }) =>
        service.updateRole(roleId, { name, permissions }),
    );

  const useDeleteRole = () => useServiceMutation((service, roleId: string) => service.deleteRole(roleId));

  const useOnboardEmployees = () =>
    useServiceMutation((service, data: { employees: any[] }) => service.onboardEmployees(data));

  return {
    // Queries
    useGetCompanyProfile,
    useGetTeams,
    useGetRoles,
    useGetRole,

    // Mutations
    useUpdateCompanyProfile,
    useCreateCompany,
    useCreateTeam,
    useUpdateTeam,
    useDeleteTeam,
    useCreateRole,
    useUpdateRole,
    useDeleteRole,
    useOnboardEmployees,
  };
};
