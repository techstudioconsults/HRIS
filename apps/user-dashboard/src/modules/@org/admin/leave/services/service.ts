import {HttpAdapter} from "@/lib/http/http-adapter";

import type {CreateLeaveTypePayload, LeaveRequest, LeaveType, UpdateLeaveTypePayload} from "../types/index";

type PaginatedResponse<TItem> = {
  items: TItem[];
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
};

export class LeaveService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async createLeaveType(data: CreateLeaveTypePayload) {
    const response = await this.http.post<{ data: LeaveType }>("/leaves", data);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  async getLeaveTypes(filters: Filters = {}) {
    // HttpAdapter expects an index-signature record; Filters is structurally compatible
    // but lacks an index signature, so we cast.
    // Backend commonly returns a paginated object: { items: LeaveType[], metadata: {...} }
    // Some environments may return { data: LeaveType[] }.
    const response = await this.http.get<PaginatedResponse<LeaveType> | { data: LeaveType[] }>(
        "/leaves",
        filters as QueryParameters,
    );
    if (response?.status === 200) {
      return response.data;
    }
  }

  async getLeaveTypeById(id: string) {
    const response = await this.http.get<{ data: LeaveType }>(`/leaves/${id}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async updateLeaveType(id: string, data: UpdateLeaveTypePayload) {
    const response = await this.http.put<{ data: LeaveType }>(`/leaves/${id}`, data);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async deleteLeaveType(id: string) {
    const response = await this.http.delete<{ message: string }>(`/leaves/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }

  // =============================
  // Leave Requests
  // =============================
  /**
   * Fetch leave requests for the organization.
   *
   * NOTE: This module previously attempted to call a non-existent hook `useGetLeaves()`.
   * The backend route naming across the app suggests `/leave-requests`.
   */
  async getLeaveRequests(filters: Filters = {}) {
    const response = await this.http.get<PaginatedResponse<LeaveRequest> | { data: LeaveRequest[] }>(
        "/leave-requests",
        filters as QueryParameters,
    );
    if (response?.status === 200) {
      return response.data;
    }
  }
}
