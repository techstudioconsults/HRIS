import { HttpAdapter } from '@/lib/http/http-adapter';

import type { CreateLeaveRequestPayload, LeaveRequest, LeaveType } from '../types/index';

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

export class UserLeaveService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  // =============================
  // Leave Types - User can view only
  // =============================
  async getLeaveTypes(filters: QueryParameters = {}) {
    const response = await this.http.get<PaginatedResponse<LeaveType> | { data: LeaveType[] }>('/leaves', filters);
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

  // =============================
  // Leave Requests - User can create and view their own
  // =============================
  async getLeaveRequests(filters: QueryParameters = {}) {
    const response = await this.http.get<PaginatedResponse<LeaveRequest> | { data: LeaveRequest[] }>(
      '/leave-requests',
      filters
    );
    if (response?.status === 200) {
      return response.data;
    }
  }

  async createLeaveRequest(data: CreateLeaveRequestPayload) {
    const response = await this.http.post<{ data: LeaveRequest }>('/leave-requests', data);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  async getLeaveRequestById(id: string) {
    const response = await this.http.get<{ data: LeaveRequest }>(`/leave-requests/${id}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }
}
