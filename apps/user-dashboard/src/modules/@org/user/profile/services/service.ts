import { HttpAdapter } from '@/lib/http/http-adapter';

export class UserProfileService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getMyProfile(employeeId: string) {
    const response = await this.http.get<ApiResponse<Employee>>(
      `/employees/${employeeId}`
    );
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async updateMyProfile(employeeId: string, data: FormData) {
    const headers = { 'Content-Type': 'multipart/form-data' };
    const response = await this.http.patch<ApiResponse<Employee>>(
      `/employees/${employeeId}`,
      data,
      headers
    );
    if (response?.status === 200) {
      return response.data.data;
    }
  }
}
