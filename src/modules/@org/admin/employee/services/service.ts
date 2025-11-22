import { HttpAdapter } from "@/lib/http/http-adapter";
import { getTeamsWithRoles, getRoles as sharedGetRoles } from "@/modules/@org/shared/organization-service";

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
    const response = await this.http.post<ApiResponse<Employee>>("/employees", data, headers);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  async getAllEmployees(filters: Filters) {
    const response = await this.http.get<PaginatedApiResponse<Employee>>(`/employees`, {
      ...filters,
    });
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getSuspendedEmployeesByPayroll(payrollId: string, filters: Filters) {
    const response = await this.http.get<PaginatedApiResponse<Employee>>(`/employees/payrolls/${payrollId}/absent`, {
      ...filters,
    });

    if (response?.status === 200) {
      return response.data;
    }
  }

  async getEmployeeById(id: string | null) {
    const response = await this.http.get<ApiResponse<Employee>>(`/employees/${id}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async updateEmployee(id: string, data: FormData) {
    const response = await this.http.patch<ApiResponse<Employee>>(`/employees/${id}`, data);
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

  async downloadEmployees(filters: Filters) {
    const response = await this.http.get(`/employees/download`, {
      ...filters,
    });
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
}
