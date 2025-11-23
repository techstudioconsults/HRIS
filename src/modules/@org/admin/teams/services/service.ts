import { HttpAdapter } from "@/lib/http/http-adapter";
import {
  getTeamsWithRoles,
  createRole as sharedCreateRole,
  getRoles as sharedGetRoles,
  updateRole as sharedUpdateRole,
} from "@/modules/@org/shared/organization-service";

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
    const response = await this.http.get<ApiResponse<Team>>(`/teams`, { ...filters });

    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadTeams(filters: Filters = Object.create({ page: 1 })) {
    const response = await this.http.get<Blob>(
      `/teams/export`,
      { ...filters },
      {
        responseType: "blob",
      },
    );

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
  async getTeams(): Promise<Team[]> {
    return getTeamsWithRoles(this.http);
  }

  async getRoles(teamId: string): Promise<Role[]> {
    return sharedGetRoles(this.http, teamId);
  }

  async createRole(roleData: { name: string; teamId: string; permissions: string[] }) {
    return sharedCreateRole(this.http, roleData);
  }

  async updateRole(roleId: string, roleData: { name?: string; permissions?: string[] }) {
    return sharedUpdateRole(this.http, roleId, roleData);
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
}
