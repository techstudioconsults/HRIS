import { HttpAdapter } from "@/lib/http/http-adapter";
import {
  getTeamsWithRoles,
  Role,
  RoleApiResponse,
  createRole as sharedCreateRole,
  deleteRole as sharedDeleteRole,
  getRoles as sharedGetRoles,
  updateRole as sharedUpdateRole,
  Team,
  TeamApiResponse,
} from "@/modules/@org/shared/organization-service";
import { CompanyProfileFormData } from "@/schemas";

import { CompanyProfile } from "../types";

export class OnboardingService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async updateCompanyProfile(data: CompanyProfileFormData) {
    const response = await this.http.patch<{ data: string; success: boolean }>(`/companies/current`, data);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async createCompany(data: CompanyProfileFormData) {
    const response = await this.http.post<{ data: string; success: boolean }>(`/companies`, data);
    if (response?.status === 200) {
      return response.data;
    }
  }

  // Team CRUD operations
  async getTeams(): Promise<Team[]> {
    return getTeamsWithRoles(this.http);
  }

  async createTeam(data: { name: string; parentId?: string }): Promise<Team> {
    const response = await this.http.post<{ data: TeamApiResponse; success: boolean }>(`/teams`, data);

    if (response?.status === 201) {
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        roles: [],
      };
    }
    throw new Error("Failed to create team");
  }

  async updateTeam(teamId: string, name: string): Promise<Team> {
    const response = await this.http.patch<{ data: TeamApiResponse; success: boolean }>(`/teams/${teamId}`, { name });
    if (response?.status === 200) {
      // Get the updated team's roles to maintain consistency
      const roles = await this.getRoles(teamId);
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        roles: roles,
      };
    }
    throw new Error("Failed to update team");
  }

  async deleteTeam(teamId: string): Promise<void> {
    await this.http.delete(`/teams/${teamId}`);
  }

  // Role CRUD operations
  async getRoles(teamId: string): Promise<Role[]> {
    return sharedGetRoles(this.http, teamId);
  }
  async getRole(roleId: string) {
    const response = await this.http.get<{ data: RoleApiResponse }>(`/roles/${roleId}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getCompanyProfile() {
    const response = await this.http.get<ApiResponse<CompanyProfile>>(`/companies/current`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async createRole(roleData: { name: string; teamId: string; permissions: string[] }): Promise<Role> {
    return sharedCreateRole(this.http, roleData);
  }

  async updateRole(roleId: string, roleData: { name?: string; permissions?: string[] }): Promise<Role> {
    return sharedUpdateRole(this.http, roleId, roleData);
  }

  async deleteRole(roleId: string): Promise<{ success: boolean }> {
    return sharedDeleteRole(this.http, roleId);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async onboardEmployees(data: { employees: any[] }) {
    const response = await this.http.post<{
      success: boolean;
      data: {
        onboardedEmployees: number;
        failedEmployees: number;
      };
    }>("/employees/onboard", data);

    if (response?.status === 201) {
      return response.data;
    }
    throw new Error("Failed to onboard employees");
  }
}
