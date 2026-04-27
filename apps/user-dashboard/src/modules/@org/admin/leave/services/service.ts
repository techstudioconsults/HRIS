import { HttpAdapter } from '@/lib/http/http-adapter';

import type {
  CreateLeaveTypePayload,
  LeaveRequest,
  LeaveType,
  RejectLeaveRequestPayload,
  UpdateLeaveTypePayload,
} from '../types';

export class LeaveService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  async createLeaveType(data: CreateLeaveTypePayload) {
    const response = await this.http.post<{ data: LeaveType }>('/leaves', data);
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  async getLeaveTypes(filters: Filters = {}) {
    const response = await this.http.get<
      PaginatedApiResponse<LeaveType> | { data: LeaveType[] }
    >('/leaves', filters as QueryParameters);
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
    const response = await this.http.put<{ data: LeaveType }>(
      `/leaves/${id}`,
      data
    );
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async deleteLeaveType(id: string) {
    const response = await this.http.delete<{ message: string }>(
      `/leaves/${id}`
    );
    if (response?.status === 200) {
      return response.data;
    }
  }

  // =============================,
  // Leave Requests
  // =============================
  /**
   * Fetch leave requests for the organization.
   *
   * NOTE: This module previously attempted to call a non-existent hook `useGetLeaves()`.
   * The backend route naming across the app suggests `/leave-requests`.
   */
  async getLeaveRequests(filters: Filters) {
    const response = await this.http.get<PaginatedApiResponse<LeaveRequest>>(
      '/leave-request',
      {
        ...filters,
      }
    );
    if (response?.status === 200) {
      return response.data;
    }
  }

  async approveLeaveRequest(id: string) {
    const response = await this.http.patch<{ data: LeaveRequest }>(
      `/leave-request/${id}/approve`
    );
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async rejectLeaveRequest(id: string, data: RejectLeaveRequestPayload) {
    const response = await this.http.patch<{ data: LeaveRequest }>(
      `/leave-requests/${id}/reject`,
      data
    );
    if (response?.status === 200) {
      return response.data.data;
    }
  }
}
