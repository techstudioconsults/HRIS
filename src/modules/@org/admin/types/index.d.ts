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
    label: string;
    icon?: ReactNode;
    onClick: (row: T) => void;
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

  interface IPaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }

  interface IPaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: IPaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  }

  interface IPaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  }

  interface IPaginatedResponse<T> {
    data: T[];
    links: IPaginationLinks;
    meta: IPaginationMeta;
  }

  interface IFilters {
    page?: number;
    status?: string;
    start_date?: string;
    end_date?: string;
  }

  interface Team {
    id: string;
    name: string;
    lead: string;
    subTeam: string;
    members: number;
  }

  interface Role {
    id: string;
    name: string;
    permissions: Permission[];
  }

  type Permission =
    | "company:manage"
    | "employee:manage"
    | "team:manage"
    | "role:manage"
    | "payroll:manage"
    | "attendance:manage"
    | "leave:manage";

  interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    thumbnail: string;
    email: string;
    status: string;
    phoneNumber: string;
    password: string;
    team: Team;
    role: Role;
    document?: string; // Assuming this is a file path or URL
    dateOfBirth: string; // ISO date string
    gender: "male" | "female";
    startDate: string; // ISO date string
    employmentType: "full time" | "part time" | "contract";
    monthlySalary: number;
    pension: number;
    healthInsurance: number;
    otherDeductions: number;
    bankName: string;
    accountName: string;
    accountNumber: string;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    workMode: "remote" | "hybrid" | "on site";
  }

  interface Team {
    id: string;
    name: string;

    // ... other team properties
  }

  interface Role {
    id: string;
    name: string;
    // ... other role properties
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
