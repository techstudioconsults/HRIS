import { HttpAdapter } from "@/lib/http/http-adapter";

import type { CompanyPayrollPolicy } from "../types";

export class PayrollService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getCompanyPayrollPolicy() {
    const response = await this.http.get<ApiResponse<CompanyPayrollPolicy>>(`payroll-policy/company`);

    if (response?.status === 200) {
      return response.data;
    }
  }
}
