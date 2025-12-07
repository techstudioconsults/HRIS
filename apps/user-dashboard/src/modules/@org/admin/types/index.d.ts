/* eslint-disable @typescript-eslint/no-explicit-any */
// Define strict types for table data and actions
declare global {
  type DataItem = Record<string, any>;

  interface IColumnDefinition<T extends DataItem> {
    header: string;
    accessorKey: keyof T;
    render?: (value: T[keyof T], row: T) => ReactNode;
  }

  interface IRowAction<T> {
    label: string | ReactNode;
    icon?: ReactNode;
    onClick: (row: T) => void;
    kbd?: string;
    type?: "action" | "separator";
    variant?: "destructive" | "default";
    ariaLabel?: string;
  }

  interface IDashboardTableProperties<T extends DataItem> {
    data: T[];
    columns: IColumnDefinition<T>[];
    currentPage?: number;
    onPageChange?: (page: number) => void;
    totalPages?: number;
    itemsPerPage?: number;
    hasPreviousPage?: boolean;
    hasNextPage?: boolean;
    rowActions?: (row: T) => IRowAction<T>[];
    onRowClick?: (row: T) => void;
    showPagination?: boolean;
  }

  interface Team extends Record<string, unknown> {
    id: string;
    name: string;
    manager?: string;
    parent?: string;
    subteams?: string;
    members?: number;
    createdAt?: string;
    updatedAt?: string;
  }

  interface Role {
    id: string;
    name: string;
    teamId: string;
    permissions: Permission[];
  }

  type Permission =
    | "company:manage"
    | "employee:manage"
    | "team:manage"
    | "role:manage"
    | "payroll:manage"
    | "attendance:manage"
    | "leave:manage"
    | "resource:manage"
    | "company:read"
    | "employee:read"
    | "team:read"
    | "role:read"
    | "payroll:read"
    | "attendance:read"
    | "leave:read"
    | "resource:read";

  // New employee shape types based on backend payload
  type Gender = "male" | "female";
  type EmploymentType = "full time" | "part time" | "contract" | null;
  type WorkMode = "remote" | "hybrid" | "on site" | null;

  interface EmploymentDetails {
    startDate: string; // ISO date string
    employmentType: EmploymentType;
    workMode: WorkMode;
    team: {
      id: string;
      name: string;
    };
    role: Role;
  }

  interface PayProfile {
    id: string;
    netPay: number;
    grossSalary: number;
    baseSalary: number;
    bankName: string;
    accountName: string;
    accountNumber: string;
  }

  interface Employee extends Record<string, unknown> {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: Gender;
    avatar?: string | null;
    phoneNumber: string;
    dateOfBirth: string; // ISO date string
    status: string;
    document?: string | null; // File path or URL
    employmentDetails: EmploymentDetails;
    payProfile: PayProfile;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }

  interface OnboardingStep {
    title: string;
    description: string;
    buttonLabel: string;
    icon: string;
    isCompleted: boolean | undefined;
    action: () => void;
  }
}

export {};
