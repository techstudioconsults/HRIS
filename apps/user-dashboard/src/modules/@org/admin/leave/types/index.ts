// Leave Module Types

export interface LeaveType {
  [key: string]: unknown;
  id: string;
  name: string;
  days: number;
  cycle: 'monthly' | 'quarterly' | 'yearly';
  maxLeaveDaysPerRequest: number;
  eligibility?: 3 | 6 | 12 | 24 | 36 | 48;
  eligibleEmployees?: Array<{ id: string; name: string }>;
  createdAt: string;
  // Optional fields present in some backend environments
  carryOver?: boolean;
  maxNumberOfRollOver?: number;
  description?: string;
}

export interface LeaveRequest {
  [key: string]: unknown;
  id: string;
  employee: {
    id: string;
    name: string;
    avatar: string;
  };
  type: string;
  startDate: string;
  endDate: string;
  days?: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
  rejectionReason: string | null;
  createdAt: string;
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
  cycle?: 'monthly' | 'quarterly' | 'yearly';
  maxLeaveDaysPerRequest?: number;
  eligibility?: string;
}

export interface CreateLeaveTypePayload {
  name: string;
  days: number;
  cycle: 'monthly' | 'quarterly' | 'yearly';
  maxLeaveDaysPerRequest?: number;
  eligibility?: string;
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

export interface RejectLeaveRequestPayload {
  rejectionReason: string;
}

export interface UpdateCompanyLeavePolicyPayload {
  defaultLeaveTypes?: LeaveType[];
  approvers?: string[];
  requireManagerApproval?: boolean;
  allowCarryOver?: boolean;
  maxCarryOverDays?: number;
}

export interface CreateLeaveTypeFormProperties {
  onClose?: () => void;
}

export interface EditLeaveTypeFormProperties {
  leaveType: LeaveType;
  onClose?: () => void;
}

export interface LeaveBodyProperties {
  searchQuery?: string;
  // IRowAction is declared globally in `apps/user-dashboard/src/modules/@org/admin/types/index.d.ts`
  getRowActions: (row: LeaveRequest) => IRowAction<LeaveRequest>[];
}

export interface LeaveHeaderProperties {
  onSearch: (query: string) => void;
}

export type LeaveRequestFormData = {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export interface LeaveRequestFormModalProperties {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type LeaveSetupFormValues = {
  name: string;
  days: number;
  maxPerRequest: number;
  leaveCycle: 'monthly' | 'quarterly' | 'yearly';
  enableRollover: boolean;
  maxRollover?: number;
  eligibility: string;
};

// ── Leave UI store state & actions ────────────────────────────────────────────

export interface LeaveUIState {
  showLeaveSetupModal: boolean;
  hasCompletedLeaveSetup: boolean;

  /**
   * In-memory entity cache for the leave-details drawer.
   * The drawer open/close and entity ID are now managed by nuqs
   * (useLeaveAdminModalParams). This field is only used as a warm cache
   * to avoid re-fetching the list on non-cold-refresh opens.
   */
  selectedLeaveRequest: LeaveRequest | null;
}

export interface LeaveUIActions {
  setShowLeaveSetupModal: (open: boolean) => void;
  setHasCompletedLeaveSetup: (status: boolean) => void;
  setSelectedLeaveRequest: (request: LeaveRequest | null) => void;
  resetUI: () => void;
}

// ── Schema-inferred form types ────────────────────────────────────────────────

import { type z } from 'zod';
import { leaveTypeFormSchema } from '../schemas/leave-type-form';

export type LeaveTypeFormValues = z.infer<typeof leaveTypeFormSchema>;
