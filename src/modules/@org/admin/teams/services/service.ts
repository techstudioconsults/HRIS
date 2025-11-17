import { HttpAdapter } from "@/lib/http/http-adapter";
import { RoleApiResponse, TeamApiResponse } from "@/modules/@org/onboarding/services/service";

export interface CreateTeamDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  teamId: string;
  roleId: string;
}

export interface UpdateTeamDto extends Partial<CreateTeamDto> {
  id: string;
}

export interface TeamQueryParameters {
  page?: number;
  limit?: number;
  search?: string;
  teamId?: string;
  roleId?: string;
}

export class TeamService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async createTeam(data: FormData) {
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await this.http.post<{ data: Team }>("/Teams", data, headers);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  async getAllTeams(filters: Filters = Object.create({ page: 1 })) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<ApiResponse<Team>>(`/teams?${queryParameters}`);

    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadTeams(filters: Filters = Object.create({ page: 1 })) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<Blob>(`/teams/export?${queryParameters}`, {
      responseType: "blob",
    });

    if (response?.status === 200) {
      return response.data;
    }
  }

  async getTeamById(id: string | null) {
    const response = await this.http.get<{ data: Team }>(`/teams/${id}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async updateTeam(id: string, data: FormData) {
    const response = await this.http.patch<{ data: Team }>(`/teams/${id}`, data);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async deleteTeam(id: string) {
    const response = await this.http.delete<{ success: boolean }>(`/teams/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  // Team CRUD operations
  async getTeams() {
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

  async getRoles(teamId: string) {
    const response = await this.http.get<ApiResponse<RoleApiResponse>>(`/roles?teamId=${teamId}`);

    if (response?.status === 200) {
      const roles = response.data.data.items.map((role) => ({
        id: role.id,
        name: role.name,
        teamId: role.teamId,
        permissions: role.permissions,
      }));
      return roles;
    }
    return [];
  }

  async createRole(roleData: { name: string; teamId: string; permissions: string[] }) {
    const response = await this.http.post<{ data: RoleApiResponse; success: boolean }>(`/roles`, roleData);
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

  async updateRole(roleId: string, roleData: { name?: string; permissions?: string[] }) {
    const response = await this.http.patch<{ data: RoleApiResponse; success: boolean }>(`/roles/${roleId}`, roleData);
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

  async assignEmployeeToTeam(employeeId: string, teamId: string, roleId: string, customPermissions?: string[]) {
    const response = await this.http.post<{ data: unknown; success: boolean }>(`/teams/${teamId}/employees`, {
      employeeId,
      roleId,
      customPermissions,
    });
    if (response?.status === 201) {
      return response.data;
    }
    throw new Error("Failed to assign employee to team");
  }

  private buildQueryParameters(filters: Filters): string {
    const queryParameters = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        queryParameters.append(key, value.toString());
      }
    }
    return queryParameters.toString();
  }
}
