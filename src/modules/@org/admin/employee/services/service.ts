import { HttpAdapter } from "@/lib/http/http-adapter";
import { RoleApiResponse, TeamApiResponse } from "@/modules/@org/onboarding/services/service";

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  teamId: string;
  roleId: string;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  id: string;
}

export interface EmployeeQueryParameters {
  page?: number;
  limit?: number;
  search?: string;
  teamId?: string;
  roleId?: string;
}

export class EmployeeService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async createEmployee(data: FormData) {
    const headers = { "Content-Type": "multipart/form-data" };
    const response = await this.http.post<{ data: Employee }>("/employees", data, headers);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  async getAllEmployees(filters: IFilters = Object.create({ page: 1 })) {
    const queryParameters = this.buildQueryParameters(filters);
    const response = await this.http.get<ApiResponse<Employee>>(`/employees?${queryParameters}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getEmployeeById(id: string | null) {
    const response = await this.http.get<{ data: Employee }>(`/employees/${id}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async updateEmployee(id: string, data: FormData) {
    const response = await this.http.patch<{ data: Employee }>(`/employees/${id}`, data);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async deleteEmployee(id: string) {
    const response = await this.http.delete<{ success: boolean }>(`/employees/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadEmployees() {
    const response = await this.http.get(`/employees/download`);
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
      return response.data.data.items.map((role) => ({
        id: role.id,
        name: role.name,
        teamId: role.teamId,
        permissions: role.permissions,
      }));
    }
    return [];
  }

  private buildQueryParameters(filters: IFilters): string {
    const queryParameters = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) {
        queryParameters.append(key, value.toString());
      }
    }
    return queryParameters.toString();
  }
}
