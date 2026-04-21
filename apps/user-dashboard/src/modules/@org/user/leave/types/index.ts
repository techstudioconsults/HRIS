import type { RequestLeaveFormValues } from '../schemas/request-leave-form';

// User Leave Module Types
export interface LeaveType {
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
export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  leaveTypeId: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
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
  rejectedRequests: number;
  leavesByType: Array<{
    leaveType: string;
    count: number;
  }>;
}
export interface CreateLeaveRequestPayload {
  leaveId: string;
  startDate: string;
  endDate: string;
  reason: string;
  document?: File;
}
export interface UpdateLeaveRequestPayload {
  leaveId?: string;
  startDate?: string;
  endDate?: string;
  reason?: string;
  document?: File;
}
export interface RejectLeaveRequestPayload {
  rejectionReason: string;
}

export type RequestLeaveSubmitData = RequestLeaveFormValues & {
  document?: File;
};

export interface RequestLeaveFormProps {
  leaveTypes: LeaveType[];
  isLoadingTypes?: boolean;
  initialData?: Partial<RequestLeaveFormValues> | null;
  onSubmit: (data: RequestLeaveSubmitData) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export interface UserLeaveHeaderProps {
  onCreateRequest?: () => void;
  onSearch?: (query: string) => void;
}

export interface LeaveCardProps {
  request: LeaveRequest;
  onViewDetails?: (request: LeaveRequest) => void;
}

export interface LeaveRequestSubmittedModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface UserLeaveBodyProps {
  searchQuery?: string;
  onViewDetails?: (request: LeaveRequest) => void;
}

export interface LeaveDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: LeaveRequest | null;
  onEdit?: (request: LeaveRequest) => void;
}

export type LeaveModalState =
  | 'request'
  | 'edit'
  | 'details'
  | 'submitted'
  | null;

export interface RequestLeaveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialRequest?: LeaveRequest | null;
}
