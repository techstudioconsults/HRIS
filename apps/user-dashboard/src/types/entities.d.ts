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
  type Status = 'active' | 'inactive' | 'terminated';

  // ============================================================================
  // DOMAIN ENTITIES
  // ============================================================================

  interface Team extends Record<string, unknown>, Timestamp {
    id: string;
    name: string;
    manager: { id: string; name: string } | null;
    parent: Team | null;
    subteams: Team[];
    members: number;
    roles?: Role[];
  }

  interface Role extends Timestamp {
    id: string;
    name: string;
    teamId: string;
    permissions: Permission[];
  }

  interface Employee extends Record<string, unknown>, Timestamp {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    avatar: string;
    phoneNumber: string;
    dateOfBirth: string;
    status: Status;
    document: string | null;
    employmentDetails: {
      startDate: string;
      employmentType: EmploymentType;
      workMode: WorkMode;
      team: Team;
      role: Role;
    };
    payProfile: {
      id: string;
      netPay: number;
      grossSalary: number;
      baseSalary: number;
      bankName: string;
      accountName: string;
      accountNumber: string;
    };
    notifications: {
      email: boolean;
      inApp: boolean;
    };
  }
}

export {};
