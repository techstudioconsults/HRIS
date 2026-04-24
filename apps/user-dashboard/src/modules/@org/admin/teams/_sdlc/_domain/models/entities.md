---
section: domain
topic: entities
---

# Admin Teams — Domain Entities

## Core Types

```typescript
export type TeamStatus = 'active' | 'inactive' | 'archived' | 'suspended';
export type MemberStatus = 'active' | 'inactive' | 'pending' | 'removed';
export type WorkflowMode = 'create' | 'edit' | 'standalone';
export type TeamPermission =
  | 'read'
  | 'write'
  | 'manage'
  | 'delete'
  | 'invite'
  | 'remove'
  | 'assign_roles'
  | 'manage_budget'
  | 'create_goals'
  | 'view_analytics';

export interface Team {
  id: string;
  organisationId: string;
  name: string;
  description: string;
  status: TeamStatus;
  parentTeamId?: string | null;
  memberCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamRole {
  id: string;
  teamId: string;
  name: string;
  description?: string;
  permissions: TeamPermission[];
  isDefault: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  roleId: string;
  roleName: string;
  customPermissions?: TeamPermission[];
  status: MemberStatus;
  joinedAt: string;
}

export interface TeamWithRoles extends Team {
  roles: TeamRole[];
}

// ── API DTOs ─────────────────────────────────────────────────────────────────

export interface CreateTeamDto {
  name: string;
  description: string;
  parentTeamId?: string;
}

export interface UpdateTeamDto extends Partial<CreateTeamDto> {
  id: string;
  status?: TeamStatus;
}

export interface CreateRoleDto {
  name: string;
  teamId: string;
  permissions: TeamPermission[];
}

export interface AssignEmployeeDto {
  employeeId: string;
  roleId: string;
  customPermissions?: TeamPermission[];
}

// ── Pagination ────────────────────────────────────────────────────────────────

export interface TeamQueryParameters {
  page?: number;
  limit?: number;
  search?: string;
  teamId?: string;
  roleId?: string;
}

export interface PaginatedTeams {
  data: Team[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
```

## Zod Schemas

```typescript
import { z } from 'zod';

export const CreateTeamSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500),
  parentTeamId: z.string().optional(),
});

export const CreateRoleSchema = z.object({
  name: z.string().min(1, 'Role name is required').max(50),
  permissions: z
    .array(
      z.enum([
        'read',
        'write',
        'manage',
        'delete',
        'invite',
        'remove',
        'assign_roles',
        'manage_budget',
        'create_goals',
        'view_analytics',
      ])
    )
    .min(1, 'Select at least one permission'),
});

export const AssignEmployeeSchema = z.object({
  employeeId: z.string().min(1, 'Please select an employee'),
  roleId: z.string().min(1, 'Please select a role'),
  customPermissions: z.array(z.string()).optional(),
});
```
