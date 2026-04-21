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

// ── Store types ───────────────────────────────────────────────────────────────

export type {
  TeamWorkflowActions,
  TeamWorkflowDialog,
  TeamWorkflowState,
  WorkflowMode,
} from '../store/team-store';
