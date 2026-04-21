import { HttpAdapter } from '@/lib/http/http-adapter';

import type { Payslip } from '@/modules/@org/admin/payroll/types';

export class UserPayslipService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async getPayslips(filters: Filters) {
    const response = await this.http.get<PaginatedApiResponse<Payslip>>(
      '/payslips',
      {
        ...filters,
      }
    );
    if (response?.status === 200) return response.data;
  }

  async getPayslipById(payslipId: string) {
    const response = await this.http.get<ApiResponse<Payslip>>(
      `/payslips/${payslipId}`
    );
    if (response?.status === 200) return response.data;
  }
}
