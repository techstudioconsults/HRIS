import { HttpAdapter } from "@/lib/http/http-adapter";

export interface BonusPayload {
  name: string;
  amount: number;
  payrollPolicyId?: string;
  payProfileId?: string;
  status: "active" | "inactive";
  type: "fixed" | "percentage";
}

export interface BonusEntity {
  id: string;
  name: string;
  amount: number;
  status: "active" | "inactive";
  type: "fixed" | "percentage";
  payrollPolicyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class BonusDeductionService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  // Bonuses
  async listBonuses(filters: Filters = Object.create({ page: 1 })) {
    const response = await this.http.get<ApiResponse<BonusEntity>>(`/bonuses`, { ...filters });
    if (response?.status === 200) return response.data;
  }

  async createBonus(data: BonusPayload) {
    const response = await this.http.post<{ data: BonusEntity }>(`/bonuses`, data);
    if (response?.status === 201) return response.data.data;
  }

  async updateBonus(id: string, data: Partial<BonusPayload>) {
    const response = await this.http.patch<{ data: BonusEntity }>(`/bonuses/${id}`, data);
    if (response?.status === 200) return response.data.data;
  }

  async deleteBonus(id: string) {
    const response = await this.http.delete<{ success: boolean }>(`/bonuses/${id}`);
    if (response?.status === 200) return response.data;
  }

  // Deductions
  async listDeductions(filters: Filters = Object.create({ page: 1 })) {
    const response = await this.http.get<ApiResponse<BonusEntity>>(`/deductions`, { ...filters });
    if (response?.status === 200) return response.data;
  }

  async createDeduction(data: BonusPayload) {
    const response = await this.http.post<{ data: BonusEntity }>(`/deductions`, data);
    if (response?.status === 201) return response.data.data;
  }

  async updateDeduction(id: string, data: Partial<BonusPayload>) {
    const response = await this.http.patch<{ data: BonusEntity }>(`/deductions/${id}`, data);
    if (response?.status === 200) return response.data.data;
  }

  async deleteDeduction(id: string) {
    const response = await this.http.delete<{ success: boolean }>(`/deductions/${id}`);
    if (response?.status === 200) return response.data;
  }
}
