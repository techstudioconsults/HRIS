export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  teamId: string;
  roleId: string;
}

export interface UpdateEmployeeDto extends Partial<CreateEmployeeDto> {
  id: string;
}

export interface EmployeeQueryParameters {
  page?: number;
  limit?: number;
  search?: string;
  teamId?: string;
  roleId?: string;
}

// ---------------------------------------------------------------------------
// add-employee form — normalized role helpers
// ---------------------------------------------------------------------------

export type RoleInput = { id: string | number; name: string };
export type RoleLite = { id: string; name: string };

// ---------------------------------------------------------------------------
// Employee page component props
// ---------------------------------------------------------------------------

export interface EmployeeHeaderSectionProperties {
  search: string | null;
  teamId: string | null;
  roleId: string | null;
  status: string | null;
  sortBy: string | null;
  limit: number;
  page: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiFilters: any;
  onSearchChange: (query: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (newFilters: any) => void;
}

export interface EmployeeTableSectionProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiFilters: any;
  debouncedSearch: string;
  teamId: string | null;
  roleId: string | null;
  status: string | null;
  sortBy: string | null;
  onPageChange: (newPage: number) => void;
  onResetFilters: () => void;
}

// ---------------------------------------------------------------------------
// Employee filter form
// ---------------------------------------------------------------------------

export interface FilterValues {
  search?: string;
  teamId?: string;
  roleId?: string;
  status?: string;
  sortBy?: string;
  limit?: string;
  page?: string;
}
