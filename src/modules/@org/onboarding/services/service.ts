import { HttpAdapter } from "@/lib/http/http-adapter";
import { CompanyProfileFormData } from "@/schemas";

// types/api.ts

export interface TeamApiResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleApiResponse {
  id: string;
  name: string;
  teamId: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: string;
  name: string;
  roles: Role[];
}

export interface Role {
  id: string;
  name: string;
  teamId: string;
  permissions: string[];
}

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
    const response = await this.http.get<ApiResponse<TeamApiResponse>>(`/teams`);

    if (response?.status === 200) {
      // Get roles for each team
      const teamsWithRoles = await Promise.all(
        response.data.data.items.map(async (team) => {
          const roles = await this.getRoles(team.id);
          return {
            id: team.id,
            name: team.name,
            roles: roles,
          };
        }),
      );
      return teamsWithRoles;
    }
    return [];
  }

  async createTeam(name: string): Promise<Team> {
    const response = await this.http.post<{ data: TeamApiResponse; success: boolean }>(`/teams`, { name });

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
    const response = await this.http.get<ApiResponse<RoleApiResponse>>(`/roles?teamId=${teamId}`);

    if (response?.status === 200) {
      return response.data.data.items.map((role) => ({
        id: role.id,
        name: role.name,
        teamId: role.teamId,
        permissions: role.permissions,
      }));
    }
    return [];
  }
  async getRole(roleId: string) {
    const response = await this.http.get<{ data: RoleApiResponse }>(`/roles/${roleId}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async getCompanyProfile() {
    return {
      success: true,
      data: {
        id: "6a2f67c7-fb25-4e6d-94c5-fac023a2c42f",
        name: "Techstudio Academy",
        industry: "Tech Education",
        size: "medium",
        domain: "techstudioacademy.com",
        address: {
          addressLine1: "205",
          addressLine2: "lewsham rd",
          city: "Barking",
          state: "london",
          country: "united kingdom",
          postcode: "CR20 3NL",
        },
        createdAt: "2025-06-16T18:48:39.212Z",
        updatedAt: "2025-06-16T18:57:31.287Z",
      },
    };
    // const response = await this.http.get<{ data: RoleApiResponse }>(`/companies/current`);
    // if (response?.status === 200) {
    //   return response.data.data;
    // }
  }

  async createRole(role: Omit<Role, "id">): Promise<Role> {
    const response = await this.http.post<{ data: RoleApiResponse; success: boolean }>(`/roles`, role);
    if (response?.status === 201) {
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        teamId: response.data.data.teamId,
        permissions: response.data.data.permissions,
      };
    }
    throw new Error("Failed to create role");
  }

  async updateRole(roleId: string, role: Partial<Role>): Promise<Role> {
    const response = await this.http.patch<{ data: RoleApiResponse; success: boolean }>(`/roles/${roleId}`, role);
    if (response?.status === 200) {
      return {
        id: response.data.data.id,
        name: response.data.data.name,
        teamId: response.data.data.teamId,
        permissions: response.data.data.permissions,
      };
    }
    throw new Error("Failed to update role");
  }

  async deleteRole(roleId: string): Promise<void> {
    await this.http.delete(`/roles/${roleId}`);
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
