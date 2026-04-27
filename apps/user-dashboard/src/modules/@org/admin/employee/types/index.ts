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
  apiFilters: Filters;
  onSearchChange: (query: string) => void;
  onFilterChange: (newFilters: Filters) => void;
}

export interface EmployeeTableSectionProperties {
  apiFilters: Filters;
  debouncedSearch: string;
  teamId: string | null;
  roleId: string | null;
  status: string | null;
  sortBy: string | null;
  onPageChange: (newPage: number) => void;
  onResetFilters: () => void;
}
