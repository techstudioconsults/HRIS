import { HttpAdapter } from "@/lib/http/http-adapter";

import type { CompanyPayrollPolicy, PayrollSummary } from "../types";

export class PayrollService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getCompanyPayrollPolicy() {
    // Ensure leading slash for consistency with other endpoints
    const response = await this.http.get<ApiResponse<CompanyPayrollPolicy>>(`/payroll-policy/company`);

    if (response?.status === 200) {
      return response.data;
    }
  }

  async getAllPayrolls(filters: Filters = {}) {
    const response = await this.http.get<PaginatedApiResponse<PayrollSummary>>(`/payrolls`, {
      ...filters,
    });

    if (response?.status === 200) {
      return response.data;
    }
  }

  async downloadPayrolls(filters: Filters = {}) {
    const response = await this.http.get(`/payrolls/download`, {
      ...filters,
    });

    if (response?.status === 200) {
      return response.data;
    }
  }
}
