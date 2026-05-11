// Payroll Summary: { success, data: { data: [{ month: string, total: number }] } }
export interface PayrollMonthSummary {
  readonly month: string;
  readonly total: number;
}

// Attendance Overview: { success, data: [{ month: string, present, absent, late }] }
export interface AttendanceMonthRecord {
  readonly month: string;
  readonly present: number;
  readonly absent: number;
  readonly late: number;
}

// Leave Distribution (direct array)
export interface LeaveDistributionEntry {
  readonly name: string;
  readonly leaves: number;
  readonly percentage: number;
}

// Company Setup: GET /companies/setup → data.firstTimeSetup
export interface CompanySetupChecklist {
  readonly hasTeam: boolean;
  readonly hasRoles: boolean;
  readonly hasEmployee: boolean;
  readonly hasClockInPolicy: boolean;
  readonly hasPayrollConfig: boolean;
  readonly hasLeavePolicy: boolean;
}

export interface CompanySetupData {
  readonly isComplete: boolean;
  readonly checklist: CompanySetupChecklist;
}
