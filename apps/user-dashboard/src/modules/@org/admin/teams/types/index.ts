import type {
  OnboardingSchemaRole as FormRole,
  OnboardingSchemaTeam as TeamFormType,
} from '@/modules/@org/onboarding/types';

// ── Team workflow store types ─────────────────────────────────────────────────

/** @deprecated - Use nuqs `modal` URL param instead. Kept for test-local usage only. */
export type TeamWorkflowDialog = 'none' | 'team' | 'role' | 'employee';
export type WorkflowMode = 'create' | 'edit' | 'standalone';

export interface TeamWorkflowState {
  currentTeam: TeamFormType | null;
  currentRole: FormRole | null;
  isSubmitting: boolean;
  workflowMode: WorkflowMode;
  skipToNextStep: boolean; // Flag to determine if user wants to continue workflow
}

export interface TeamWorkflowActions {
  setCurrentTeam: (team: TeamFormType | null) => void;
  setCurrentRole: (role: FormRole | null) => void;
  setSubmitting: (submitting: boolean) => void;
  setSkipToNextStep: (skip: boolean) => void;
  resetWorkflow: () => void;
}

// ── Team DTOs ─────────────────────────────────────────────────────────────────

export interface CreateTeamDto {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  teamId: string;
  roleId: string;
}

export interface UpdateTeamDto extends Partial<CreateTeamDto> {
  id: string;
}

export interface TeamQueryParameters {
  page?: number;
  limit?: number;
  search?: string;
  teamId?: string;
  roleId?: string;
}

// ── add-new-employees.tsx ─────────────────────────────────────────────────────

/** Shape of one employee entry being constructed in the add-employees form. */
export interface FormEmployee {
  employeeId: string;
  roleId: string;
  customPermissions?: string[];
}

/**
 * Lightweight employee record used for lookup/search in the add-employees form.
 * Named `EmployeeLookup` to avoid collision with the global ambient `Employee` entity.
 */
export interface EmployeeLookup {
  id: string;
  name: string;
  email: string;
}

/**
 * Lightweight role record used for lookup/search in the add-employees form.
 * Shared with `RoleLite` from add-new-members — unified here as `RoleLookup`.
 */
export interface RoleLookup {
  id: string;
  name: string;
  description?: string;
}

export interface AddNewEmployeesProperties {
  isEdit?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  onSubmit: (data: FormEmployee) => Promise<void>;
  onCancel: (event: import('react').FormEvent) => void;
  onDelete?: (employeeId: string) => Promise<void>;
  isSubmitting?: boolean;
  availableRoles?: RoleLookup[];
  availableEmployees?: EmployeeLookup[];
}

export type FormEmployeeField = keyof FormEmployee;
export type FormEmployeeValue = string | string[] | undefined;

// ── add-new-members.tsx ───────────────────────────────────────────────────────

/** One member-to-sub-team assignment row in the add-members form. */
export interface MemberAssignment {
  employeeId: string;
  /** Optional depending on use-case */
  roleId: string;
}

/**
 * Lightweight role option used in the add-members form.
 * Identical shape to `RoleLookup`; kept as a separate export for semantic clarity
 * at the call-site.
 */
export interface RoleLite {
  id: string;
  name: string;
  description?: string;
}

export interface AddNewMembersProperties {
  /** Team whose current members should be available. */
  parentTeamId: string;
  availableRoles?: RoleLite[];
  onSubmit: (data: MemberAssignment) => Promise<void>;
  onCancel: (event: import('react').FormEvent) => void;
  isSubmitting?: boolean;
}

// ── add-new-roles.tsx ─────────────────────────────────────────────────────────

/**
 * Shape of one role entry being constructed in the add-roles form.
 * Prefixed `Teams` to distinguish from the `FormRole` alias in the team-store
 * (which is `Role` from the onboarding schema).
 */
export interface TeamsFormRole {
  name: string;
  permissions: string[];
}

export interface RolesAndPermissionProperties {
  isEdit?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  onSubmit: (data: Role) => Promise<void>;
  onCancel: (event: import('react').FormEvent) => void;
  onDelete?: (roleId: string) => Promise<void>;
  onComplete?: () => void;
  isSubmitting?: boolean;
}

// ── team-table.tsx (_components/team-table.tsx) ───────────────────────────────

/**
 * Employee record shape used in the legacy EmployeeTable component.
 * Suffixed `TableRow` to distinguish from global ambient `Employee` and
 * the `EmployeeLookup` used in add-new-employees.
 */
export interface EmployeeTableRow {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
}

export interface EmployeeTableProperties {
  employees: EmployeeTableRow[];
  departments: string[];
  roles: string[];
  className?: string;
}

// ── filter-form.tsx ───────────────────────────────────────────────────────────

export interface FilterValues {
  search?: string;
  status?: string;
  sortBy?: string;
  limit?: string;
  page?: string;
}

export type FilterOption = {
  value: string;
  label: string;
};

// ── use-team-editing.ts ───────────────────────────────────────────────────────

export interface UseTeamEditingReturn {
  isEditing: boolean;
  editingTeam: TeamFormType | null;
  openEditDialog: (team: TeamFormType) => void;
  closeEditDialog: () => void;
  handleUpdateTeam: (data: { name: string }) => Promise<void>;
  isSubmitting: boolean;
}

// ── team-header-section.tsx ───────────────────────────────────────────────────

export interface TeamHeaderSectionProperties {
  search: string | null;
  status: string | null;
  sortBy: string | null;
  limit: number;
  page: number;
  onSearchChange: (query: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (newFilters: any) => void;
  onAddTeamClick: () => void;
}

// ── team-table-section.tsx ────────────────────────────────────────────────────

export interface TeamTableSectionProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiFilters: any;
  debouncedSearch: string;
  status: string | null;
  sortBy: string | null;
  onPageChange: (newPage: number) => void;
  onResetFilters: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rowActions: (team: any) => any[];
  onAddTeamClick: () => void;
}

// ── teams.unit.test.tsx (test-local types) ────────────────────────────────────

/** Union of dialog names used in the test-local Zustand store under test. */
export type TestDialog = 'none' | 'team' | 'role' | 'employee';

/** State shape of the Zustand store exercised in the teams unit tests. */
export interface TestStoreState {
  dialog: TestDialog;
  workflowMode: WorkflowMode;
  currentTeam: { id: string; name: string } | null;
  skipToNextStep: boolean;
  openTeamDialog: (
    team?: { id: string; name: string } | null,
    mode?: WorkflowMode
  ) => void;
  openRoleDialog: (team: { id: string; name: string }) => void;
  openEmployeeDialog: (team: { id: string; name: string }) => void;
  closeDialog: () => void;
  resetWorkflow: () => void;
}
