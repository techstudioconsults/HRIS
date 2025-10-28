/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpAdapter } from "@/lib/http/http-adapter";

export class PayrollService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getAllPayrolls(filters: Filters = Object.create({ page: 1 })) {
    const response = await this.http.get<ApiResponse<PayrollService>>(`/payrolls`, {
      ...filters,
    });

    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadPayrolls(filters: Filters = Object.create({ page: 1 })) {
    const response = await this.http.get<Blob>(
      `/payrolls/export`,
      {
        ...filters,
      },
      {
        responseType: "blob",
      },
    );

    if (response?.status === 200) {
      return response.data;
    }
  }

  async getPayrollById(id: string | null) {
    const response = await this.http.get<{ data: PayrollService }>(`/payrolls/${id}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async createPayroll(data: any) {
    const response = await this.http.post<{ data: PayrollService }>("/payrolls", data);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  async updatePayroll(id: string, data: any) {
    const response = await this.http.patch<{ data: PayrollService }>(`/payrolls/${id}`, data);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async deletePayroll(id: string) {
    const response = await this.http.delete<{ success: boolean }>(`/payrolls/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getCompanyPayrollPolicy() {
    const response = await this.http.get<ApiResponse<PayrollService>>(`payroll-policy/company`);

    if (response?.status === 200) {
      return response.data;
    }
  }
}
