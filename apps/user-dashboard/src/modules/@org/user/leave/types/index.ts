// User Leave Module Types

export interface LeaveType extends Record<string, unknown> {
  id: string;
  name: string;
  days: number | string;
  cycle: string;
  carryOver: boolean;
  maxLeaveDaysPerRequest?: number;
  eligibility?: string;
  maxNumberOfRollOver?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LeaveRequest extends Record<string, unknown> {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  leaveTypeId: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
  approvedBy?: string;
  approvedAt?: string;
  supportingDocumentName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  leaveTypeId: string;
  leaveTypeName: string;
  total: number;
  used: number;
  remaining: number;
  pending: number;
}

export interface LeaveStatistics {
  totalLeaveRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  declinedRequests: number;
  leavesByType: {
    leaveType: string;
    count: number;
  }[];
}

export interface CreateLeaveRequestPayload {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface UpdateLeaveRequestPayload {
  employeeId?: string;
  leaveTypeId?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  status?: LeaveRequest['status'];
}
