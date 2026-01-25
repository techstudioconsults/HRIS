// Leave Module Types

export interface LeaveType extends Record<string, unknown> {
  id: string;
  name: string;
  days: number | string;
  cycle: string;
  carryOver: boolean;
  /**
   * Max leave days allowed per request.
   * Optional because not all backends/environments return it.
   */
  maxLeaveDaysPerRequest?: number;
  /**
   * Eligibility in months (string), e.g. "12".
   */
  eligibility?: string;
  /**
   * Maximum number of leave days that can roll over to the next cycle.
   */
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
  status: "pending" | "approved" | "declined";
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyLeavePolicy {
  id: string;
  defaultLeaveTypes: LeaveType[];
  approvers: string[];
  requireManagerApproval: boolean;
  allowCarryOver: boolean;
  maxCarryOverDays?: number;
  createdAt?: string;
  updatedAt?: string;
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

export interface UpdateLeaveTypePayload {
  name?: string;
  days?: number;
  cycle?: string;
  carryOver?: boolean;
  description?: string;
  maxLeaveDaysPerRequest?: number;
  eligibility?: string;
  maxNumberOfRollOver?: number;
}

/**
 * Payload for creating a Leave Type.
 *
 * Note: Some backends accept additional policy-related fields (e.g. eligibility,
 * rollover/max per request). These are included here to match the current
 * [`LeaveSetupForm`](apps/user-dashboard/src/modules/@org/admin/leave/_components/forms/leave-setup-form.tsx:22)
 * payload transform.
 */
export interface CreateLeaveTypePayload {
  name: string;
  days: number;
  cycle: string;
  carryOver?: boolean;
  description?: string;
  maxLeaveDaysPerRequest?: number;
  /**
   * Eligibility in months (string).
   * Allowed values are validated in the UI as: ["3", "6", "12", "24", "36", "48"].
   */
  eligibility?: string;
  maxNumberOfRollOver?: number;
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
  status?: LeaveRequest["status"];
}

export interface UpdateCompanyLeavePolicyPayload {
  defaultLeaveTypes?: LeaveType[];
  approvers?: string[];
  requireManagerApproval?: boolean;
  allowCarryOver?: boolean;
  maxCarryOverDays?: number;
}
