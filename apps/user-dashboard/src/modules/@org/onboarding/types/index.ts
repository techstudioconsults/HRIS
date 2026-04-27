// ============================================================================
// COMPANY PROFILE
// ============================================================================

export interface CompanyProfile {
  id: string;
  name: string;
  industry: string;
  size: string;
  domain: string;
  address: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// RAW API RESPONSE SHAPES (before transformation to domain entities)
// ============================================================================

export interface TeamApiResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleApiResponse {
  id: string;
  name: string;
  teamId: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ONBOARDING SETUP STATUS
// ============================================================================

export interface OnboardingSetupStatus {
  resetPassword?: boolean;
  reviewProfileDetails?: boolean;
  acknowledgePolicy?: boolean;
  reviewPayrollInfo?: boolean;
  takenTour?: boolean;
}

export type OnboardingSetupStatusApi = Omit<
  OnboardingSetupStatus,
  'takenTour'
> & {
  takenTour?: boolean;
};

// ============================================================================
// EMPLOYEE ONBOARDING PAYLOAD
// Distinct from the global Employee domain entity — this is the create-input
// shape used during the onboarding wizard (step 3).
// ============================================================================

export interface OnboardingEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  teamId: string;
  roleId: string;
  permissions?: unknown[];
}

export interface OnboardEmployeesPayload {
  employees: OnboardingEmployeeInput[];
}

// ============================================================================
// COMPONENT PROP TYPES
// ============================================================================

export interface SingleEmployeeFormProperties {
  index: number;
}

/** Local team/department shape used within the onboarding wizard employee form */
export interface OnboardingDepartment {
  id: string;
  name: string;
}

/** Local role shape used within the onboarding wizard employee form */
export interface OnboardingRole {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  permissions?: any[];
}

/** Role shape as defined by the onboarding form schema */
export interface OnboardingRoleFormData {
  id?: string;
  name: string;
  teamId?: string;
  permissions: string[];
}

export interface RolesAndPermissionProperties {
  isEdit?: boolean;
  initialData?: Partial<OnboardingRoleFormData> & { id?: string };
  onSubmit: (data: OnboardingRoleFormData) => Promise<void>;
  onCancel: (event: import('react').FormEvent) => void;
  onDelete?: (roleId: string) => Promise<void>;
  isSubmitting?: boolean;
}

export type TeamFormValues = { name: string };

export interface TeamFormProperties {
  /** Partial team shape used to pre-populate the form for edit scenarios */
  initialData?: { id?: string; name: string } | null;
  onSubmit: (data: TeamFormValues) => Promise<void> | void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

// ── Schema-inferred form types ────────────────────────────────────────────────
// Inferred from onboarding/_components/forms/schema.ts.
// Names prefixed with `OnboardingSchema` to avoid collision with global ambient
// `Role` and `Team` entity types.

import { type z } from 'zod';
import {
  roleSchema,
  teamSchema,
  teamSetupSchema,
} from '../_components/forms/schema';

/** z.infer of roleSchema — use OnboardingSchemaRole to avoid collision with global Role */
export type OnboardingSchemaRole = z.infer<typeof roleSchema>;
/** z.infer of teamSchema — use OnboardingSchemaTeam to avoid collision with global Team */
export type OnboardingSchemaTeam = z.infer<typeof teamSchema>;
export type TeamSetupFormData = z.infer<typeof teamSetupSchema>;
