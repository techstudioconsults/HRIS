import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { act } from 'react';
import { create } from 'zustand';

// ─── Schemas under test ───────────────────────────────────────────────────────

const CreateTeamSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500),
  parentTeamId: z.string().optional(),
});

const CreateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50),
  permissions: z.array(z.string()).min(1, 'Select at least one permission'),
});

const AssignEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Please select an employee'),
  roleId: z.string().min(1, 'Please select a role'),
  customPermissions: z.array(z.string()).optional(),
});

// ─── Zustand store under test ─────────────────────────────────────────────────

type Dialog = 'none' | 'team' | 'role' | 'employee';
type WorkflowMode = 'create' | 'edit' | 'standalone';

interface StoreState {
  dialog: Dialog;
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

const createStore = () =>
  create<StoreState>((set) => ({
    dialog: 'none',
    workflowMode: 'create',
    currentTeam: null,
    skipToNextStep: false,
    openTeamDialog: (team, mode = 'create') =>
      set({
        dialog: 'team',
        currentTeam: team ?? null,
        workflowMode: mode,
        skipToNextStep: false,
      }),
    openRoleDialog: (team) => set({ dialog: 'role', currentTeam: team }),
    openEmployeeDialog: (team) =>
      set({ dialog: 'employee', currentTeam: team }),
    closeDialog: () => set({ dialog: 'none', skipToNextStep: false }),
    resetWorkflow: () =>
      set({
        dialog: 'none',
        workflowMode: 'create',
        currentTeam: null,
        skipToNextStep: false,
      }),
  }));

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('CreateTeamSchema', () => {
  const valid = {
    name: 'Engineering',
    description: 'Product engineering team for HRIS',
  };

  it('passes for valid input', () => {
    expect(() => CreateTeamSchema.parse(valid)).not.toThrow();
  });

  it('fails when name is shorter than 2 characters', () => {
    const result = CreateTeamSchema.safeParse({ ...valid, name: 'A' });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toContain(
      'Name must be at least 2 characters'
    );
  });

  it('fails when name exceeds 100 characters', () => {
    const result = CreateTeamSchema.safeParse({
      ...valid,
      name: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
  });

  it('fails when description is shorter than 10 characters', () => {
    const result = CreateTeamSchema.safeParse({
      ...valid,
      description: 'Too short',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.description).toContain(
      'Description must be at least 10 characters'
    );
  });
});

describe('CreateRoleSchema', () => {
  it('passes for valid role with permissions', () => {
    expect(() =>
      CreateRoleSchema.parse({ name: 'Lead', permissions: ['read', 'write'] })
    ).not.toThrow();
  });

  it('fails when name is empty', () => {
    const result = CreateRoleSchema.safeParse({
      name: '',
      permissions: ['read'],
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toContain(
      'Role name is required'
    );
  });

  it('fails when no permissions are selected', () => {
    const result = CreateRoleSchema.safeParse({
      name: 'Observer',
      permissions: [],
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.permissions).toContain(
      'Select at least one permission'
    );
  });
});

describe('AssignEmployeeSchema', () => {
  it('passes for valid assignment', () => {
    expect(() =>
      AssignEmployeeSchema.parse({ employeeId: 'emp_01', roleId: 'role_01' })
    ).not.toThrow();
  });

  it('fails when no employee is selected', () => {
    const result = AssignEmployeeSchema.safeParse({
      employeeId: '',
      roleId: 'role_01',
    });
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.employeeId).toContain(
      'Please select an employee'
    );
  });

  it('fails when no role is selected', () => {
    const result = AssignEmployeeSchema.safeParse({
      employeeId: 'emp_01',
      roleId: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('useTeamWorkflowStore', () => {
  let store: ReturnType<typeof createStore>;

  beforeEach(() => {
    store = createStore();
  });

  it('has correct initial state', () => {
    const { dialog, workflowMode, currentTeam } = store.getState();
    expect(dialog).toBe('none');
    expect(workflowMode).toBe('create');
    expect(currentTeam).toBeNull();
  });

  it('openTeamDialog sets dialog and mode', () => {
    act(() => store.getState().openTeamDialog(null, 'edit'));
    expect(store.getState().dialog).toBe('team');
    expect(store.getState().workflowMode).toBe('edit');
  });

  it('openRoleDialog carries currentTeam', () => {
    const team = { id: 'team_01', name: 'Engineering' };
    act(() => store.getState().openRoleDialog(team));
    expect(store.getState().dialog).toBe('role');
    expect(store.getState().currentTeam?.id).toBe('team_01');
  });

  it('closeDialog resets dialog and skipToNextStep', () => {
    act(() => {
      store.getState().openTeamDialog();
      store.getState().closeDialog();
    });
    expect(store.getState().dialog).toBe('none');
    expect(store.getState().skipToNextStep).toBe(false);
  });

  it('resetWorkflow clears all workflow state', () => {
    act(() => {
      store.getState().openRoleDialog({ id: 'team_01', name: 'Engineering' });
      store.getState().resetWorkflow();
    });
    const { dialog, currentTeam, workflowMode } = store.getState();
    expect(dialog).toBe('none');
    expect(currentTeam).toBeNull();
    expect(workflowMode).toBe('create');
  });
});
