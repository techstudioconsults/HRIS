declare global {
  // ============================================================================
  // PERMISSION & ENUM TYPES
  // ============================================================================

  type Permission =
    | 'company:manage'
    | 'employee:manage'
    | 'team:manage'
    | 'role:manage'
    | 'payroll:manage'
    | 'attendance:manage'
    | 'leave:manage'
    | 'resource:manage'
    | 'company:read'
    | 'employee:read'
    | 'team:read'
    | 'role:read'
    | 'payroll:read'
    | 'attendance:read'
    | 'leave:read'
    | 'resource:read';

  type Gender = 'male' | 'female';
  type EmploymentType = 'full time' | 'part time' | 'contract' | null;
  type WorkMode = 'remote' | 'hybrid' | 'onsite' | null;
  type EmploymentStatus = 'active' | 'inactive' | 'leave' | 'terminated';

  // ============================================================================
  // DOMAIN ENTITIES
  // ============================================================================

  interface Team extends Record<string, unknown> {
    id: string;
    name: string;
    manager: { id: string; name: string } | null;
    parent: { id: string; name: string } | null;
    subTeams: { id: string; name: string }[];
    members: number;
    createdAt: string;
    updatedAt: string;
  }

  interface Role {
    id: string;
    name: string;
    teamId: string;
    permissions: Permission[];
    createdAt: string;
    updatedAt: string;
  }

  interface Employee extends Record<string, unknown> {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    team: { id: string; name: string };
    role: { id: string; name: string; permissions: Permission[] };
    dateOfBirth?: string;
    gender?: Gender;
    startDate?: string;
    employmentType?: EmploymentType;
    workMode: WorkMode;
    monthlySalary?: number;
    pension?: number;
    healthInsurance?: number;
    otherDeductions?: number;
    bankName?: string;
    accountName?: string;
    accountNumber?: number;
    document?: string | null;
    avatar?: string | null;
    status: EmploymentStatus;
    createdAt: string;
    updatedAt: string;
  }
}

export {};
