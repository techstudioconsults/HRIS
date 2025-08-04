/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceHooks } from "@/lib/react-query/use-service-query";
import { dependencies } from "@/lib/tools/dependencies";
import { CompanyProfileFormData } from "@/schemas";

import { OnboardingService, Role } from "./service";

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

  const useCreateTeam = () => useServiceMutation((service, name: string) => service.createTeam(name));

  const useUpdateTeam = () =>
    useServiceMutation((service, { teamId, name }: { teamId: string; name: string }) =>
      service.updateTeam(teamId, name),
    );

  const useDeleteTeam = () => useServiceMutation((service, teamId: string) => service.deleteTeam(teamId));

  const useCreateRole = () => useServiceMutation((service, role: Omit<Role, "id">) => service.createRole(role));

  const useUpdateRole = () =>
    useServiceMutation((service, { roleId, role }: { roleId: string; role: Partial<Role> }) =>
      service.updateRole(roleId, role),
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
