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

  // Update company payroll policy (PUT)
  async updateCompanyPayrollPolicy(data: {
    frequency: string;
    payday: number;
    currency?: string;
    approvers: string[];
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  }) {
    const response = await this.http.put<ApiResponse<CompanyPayrollPolicy>>(`/payroll-policy/company`, data);
    if (response?.status === 200) {
      return response.data;
    }
  }

  // =============================
  // Bonuses CRUD
  // =============================
  async getBonuses(filters: { payrollPolicyId?: string; payProfileId?: string } = {}) {
    const response = await this.http.get<ApiResponse<unknown>>(`/bonuses`, filters);
    if (response?.status === 200) return response.data;
  }

  async createBonus(data: {
    name: string;
    amount: number;
    type: "fixed" | "percentage";
    status: "active" | "inactive";
    payrollPolicyId: string;
  }) {
    const response = await this.http.post<ApiResponse<unknown>>(`/bonuses`, data);
    if (response?.status === 201 || response?.status === 200) return response.data;
  }

  async updateBonus(
    id: string,
    data: Partial<{ name: string; amount: number; type: "fixed" | "percentage"; status: "active" | "inactive" }>,
  ) {
    // Backend expects a typo for the inactive state ("inavtive"). Work with the typo here only for updates.
    const patched: Partial<{
      name: string;
      amount: number;
      type: "fixed" | "percentage";
      status: "active" | "inactive" | "inavtive";
    }> = {
      ...data,
      ...(data.status ? { status: data.status === "inactive" ? "inavtive" : data.status } : {}),
    };
    const response = await this.http.patch<ApiResponse<unknown>>(`/bonuses/${id}`, patched);
    if (response?.status === 200) return response.data;
  }

  async deleteBonus(id: string) {
    const response = await this.http.delete<ApiResponse<{ success: boolean }>>(`/bonuses/${id}`);
    if (response?.status === 200) return response.data;
  }

  // =============================
  // Deductions CRUD
  // =============================
  async getDeductions(filters: { payrollPolicyId?: string; payProfileId?: string } = {}) {
    const response = await this.http.get<ApiResponse<unknown>>(`/deductions`, filters);
    if (response?.status === 200) return response.data;
  }

  async createDeduction(data: {
    name: string;
    amount: number;
    type: "fixed" | "percentage";
    status: "active" | "inactive";
    payrollPolicyId: string;
  }) {
    const response = await this.http.post<ApiResponse<unknown>>(`/deductions`, data);
    if (response?.status === 201 || response?.status === 200) return response.data;
  }

  async updateDeduction(
    id: string,
    data: Partial<{ name: string; amount: number; type: "fixed" | "percentage"; status: "active" | "inactive" }>,
  ) {
    // Backend expects a typo for the inactive state ("inavtive"). Work with the typo here only for updates.
    const patched: Partial<{
      name: string;
      amount: number;
      type: "fixed" | "percentage";
      status: "active" | "inactive" | "inavtive";
    }> = {
      ...data,
      ...(data.status ? { status: data.status === "inactive" ? "inavtive" : data.status } : {}),
    };
    const response = await this.http.patch<ApiResponse<unknown>>(`/deductions/${id}`, patched);
    if (response?.status === 200) return response.data;
  }

  async deleteDeduction(id: string) {
    const response = await this.http.delete<ApiResponse<{ success: boolean }>>(`/deductions/${id}`);
    if (response?.status === 200) return response.data;
  }
}
