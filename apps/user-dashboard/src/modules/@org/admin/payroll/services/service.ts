import { HttpAdapter } from "@/lib/http/http-adapter";

import type { CompanyPayrollPolicy, CompanyWallet, Payroll, PayrollApproval, PayrollSummary, Payslip } from "../types";

export class PayrollService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  // =============================
  // Payroll Actions
  // =============================

  // Create payroll (supports immediate or scheduled creation)
  async createPayroll(data: { paymentDate: string }) {
    const response = await this.http.post<ApiResponse<Payroll>>(`/payrolls`, data);
    if (response?.status === 201 || response?.status === 200) return response.data;
  }

  // Run payroll (process disbursement/approval workflow)
  async runPayroll(data: { payrollId: string; date: string }) {
    const response = await this.http.post<ApiResponse<{ success: boolean; payroll: Payroll }>>(
      `/payrolls/${data.payrollId}/run`,
      {
        date: data.date,
      },
    );
    if (response?.status === 201) return response.data;
  }

  // Retry failed payroll (or stuck state)
  async retryPayroll(data: { payslipIds: string[] }) {
    const response = await this.http.post<ApiResponse<{ success: boolean; payroll: Payroll }>>(`/payrolls/retry`, data);
    if (response?.status === 200) return response.data;
  }

  // Get approved banks (used for payouts)
  async getApprovedBanks() {
    const response =
      await this.http.get<ApiResponse<Array<{ name: string; code: string }>>>(`/payrolls/approved-banks`);
    if (response?.status === 200) return response.data;
  }

  async getCompanyPayrollPolicy() {
    // Ensure leading slash for consistency with other endpoints
    const response = await this.http.get<ApiResponse<CompanyPayrollPolicy>>(`/payroll-policy/company`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getAllPayrolls(filters: Filters = {}) {
    const response = await this.http.get<ApiResponse<PayrollSummary>>(`/payrolls`, {
      ...filters,
    });
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getPayrollByID(payrollId: string) {
    const response = await this.http.get<ApiResponse<Payroll>>(`/payrolls/${payrollId}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  // Get approvals for a specific payroll
  async getPayrollApprovals(payrollId: string) {
    const response = await this.http.get<ApiResponse<PayrollApproval[]>>(`/payrolls/${payrollId}/approvals`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  // Decide (approve / decline) a payroll approval step
  async decidePayrollApproval(data: { payrollId: string; status: "approved" | "declined" }) {
    const response = await this.http.post<ApiResponse<PayrollApproval>>(`/payrolls/${data.payrollId}/approvals`, {
      status: data.status,
    });
    if (response?.status === 200 || response?.status === 201) {
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
  // Wallet Setup
  // =============================
  async getCompanyWallet() {
    const response = await this.http.get<ApiResponse<CompanyWallet>>(`/wallets/company`);
    if (response?.status === 200) {
      return response.data;
    }
  }
  async updateCompanyWallet(data: { firstName: string; lastName: string; email: string; phoneNumber: string }) {
    const response = await this.http.put<ApiResponse<CompanyWallet>>(`/wallets/company`, data);
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
    const patched: Partial<{
      name: string;
      amount: number;
      type: "fixed" | "percentage";
      status: "active" | "inactive";
    }> = {
      ...data,
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
    const patched: Partial<{
      name: string;
      amount: number;
      type: "fixed" | "percentage";
      status: "active" | "inactive";
    }> = {
      ...data,
    };
    const response = await this.http.patch<ApiResponse<unknown>>(`/deductions/${id}`, patched);
    if (response?.status === 200) return response.data;
  }

  async deleteDeduction(id: string) {
    const response = await this.http.delete<ApiResponse<{ success: boolean }>>(`/deductions/${id}`);
    if (response?.status === 200) return response.data;
  }

  // =============================
  // Payslips CRUD
  // =============================

  async getPayslips(payrollID: string, filters: Filters) {
    const response = await this.http.get<PaginatedApiResponse<Payslip>>(`/payslips`, {
      payrollId: payrollID,
      ...filters,
    });
    if (response?.status === 200) return response.data;
  }

  async getPayslipById(payrollId: string, payslipId: string) {
    const response = await this.http.get<ApiResponse<Payslip>>(`/payslips/${payslipId}`);
    if (response?.status === 200) return response.data;
  }

  async createPayslip(data: { payrollId: string; employeeId: string }) {
    const response = await this.http.post<ApiResponse<Payslip>>(`/payslips`, {
      payrollId: data.payrollId,
      employeeId: data.employeeId,
    });
    if (response?.status === 201 || response?.status === 200) return response.data;
  }

  async deletePayslip(payrollId: string, payslipId: string) {
    const response = await this.http.delete<ApiResponse<{ success: boolean }>>(`/payslips/${payslipId}`);
    if (response?.status === 200) return response.data;
  }
}
