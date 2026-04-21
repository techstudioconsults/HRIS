import { HttpAdapter } from '@/lib/http/http-adapter';

import type {
  CreateLeaveRequestPayload,
  LeaveRequest,
  LeaveType,
  RejectLeaveRequestPayload,
  UpdateLeaveRequestPayload,
} from '../types';

export class UserLeaveService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  // =============================
  // Leave Types - User can view only
  // =============================
  async getLeaveTypes(filters: QueryParameters = {}) {
    const response = await this.http.get<PaginatedApiResponse<LeaveType>>(
      '/leaves',
      filters
    );
    if (response?.status === 200) {
      return response.data.data.items;
    }

    return [];
  }

  async getLeaveTypeById(id: string) {
    const response = await this.http.get<{ data: LeaveType }>(`/leaves/${id}`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  // =============================
  // Leave Requests
  // =============================
  async getLeaveRequests(filters: QueryParameters = {}) {
    const response = await this.http.get<PaginatedApiResponse<LeaveRequest>>(
      '/leave-request',
      filters
    );
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async getLeaveRequestById(id: string) {
    const response = await this.http.get<{ data: LeaveRequest }>(
      `/leave-request/${id}`
    );
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async createLeaveRequest(data: CreateLeaveRequestPayload) {
    const formData = new FormData();
    formData.append('leaveId', data.leaveId);
    formData.append('startDate', data.startDate);
    formData.append('endDate', data.endDate);
    formData.append('reason', data.reason);
    if (data.document) {
      formData.append('document', data.document);
    }
    const response = await this.http.post<{ data: LeaveRequest }>(
      '/leave-request',
      formData
    );
    if (response?.status === 201) {
      return response.data.data;
    }
  }

  async updateLeaveRequest(id: string, data: UpdateLeaveRequestPayload) {
    const formData = new FormData();
    if (data.leaveId) formData.append('leaveId', data.leaveId);
    if (data.startDate) formData.append('startDate', data.startDate);
    if (data.endDate) formData.append('endDate', data.endDate);
    if (data.reason) formData.append('reason', data.reason);
    if (data.document) formData.append('document', data.document);
    const response = await this.http.patch<{ data: LeaveRequest }>(
      `/leave-request/${id}`,
      formData
    );
    if (response?.status === 200) {
      return response.data.data;
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
      `/leave-request/${id}/reject`,
      data
    );
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  async deleteLeaveRequest(id: string) {
    const response = await this.http.delete<{
      success: boolean;
      message: string;
    }>(`/leave-request/${id}`);
    if (response?.status === 200) {
      return response.data;
    }
  }
}
