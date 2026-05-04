import { HttpAdapter } from '@/lib/http/http-adapter';

import type {
  AttendanceMonthRecord,
  LeaveDistributionEntry,
  PayrollMonthSummary,
} from '../types/dashboard-api';

export class DashboardService {
  private readonly http: HttpAdapter;

  constructor(httpAdapter: HttpAdapter) {
    this.http = httpAdapter;
  }

  // Response: { success, data: { data: [{ month, total }] } }
  async getPayrollSummary(
    year: number
  ): Promise<readonly PayrollMonthSummary[] | undefined> {
    const response = await this.http.get<
      ApiResponse<{ data: readonly PayrollMonthSummary[] }>
    >(`/payrolls/summary`, { year } as QueryParameters);
    if (response?.status === 200) {
      return response.data.data.data;
    }
  }

  // Response: { success, data: [{ month, present, absent, late }] }
  async getAttendanceOverview(
    year: number
  ): Promise<readonly AttendanceMonthRecord[] | undefined> {
    const response = await this.http.get<
      ApiResponse<readonly AttendanceMonthRecord[]>
    >(`/attendances/records/overview`, { year } as QueryParameters);
    if (response?.status === 200) {
      return response.data.data;
    }
  }

  // Response: { success, data: [{ name, leaves, percentage }] }
  async getLeaveDistribution(): Promise<
    readonly LeaveDistributionEntry[] | undefined
  > {
    const response = await this.http.get<
      ApiResponse<readonly LeaveDistributionEntry[]>
    >(`/leave-requests/distribution`);
    if (response?.status === 200) {
      return response.data.data;
    }
  }
}
