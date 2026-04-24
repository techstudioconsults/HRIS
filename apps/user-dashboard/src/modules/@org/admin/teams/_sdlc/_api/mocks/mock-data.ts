import type {
  Team,
  TeamRole,
  TeamMember,
  PaginatedTeams,
} from '@/modules/@org/admin/teams/types';

export const mockTeams: Team[] = [
  {
    id: 'team_01',
    organisationId: 'org_01',
    name: 'Engineering',
    description: 'Product engineering and platform team',
    status: 'active',
    memberCount: 4,
    createdBy: 'admin_01',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'team_02',
    organisationId: 'org_01',
    name: 'Finance',
    description: 'Finance and accounting team',
    status: 'active',
    memberCount: 2,
    createdBy: 'admin_01',
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
];

export const mockTeamsPaginated: PaginatedTeams = {
  data: mockTeams,
  total: 2,
  page: 1,
  size: 20,
  totalPages: 1,
};

export const mockRoles: TeamRole[] = [
  {
    id: 'role_01',
    teamId: 'team_01',
    name: 'Manager',
    permissions: ['read', 'write', 'manage', 'delete'],
    isDefault: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
  {
    id: 'role_02',
    teamId: 'team_01',
    name: 'Member',
    permissions: ['read', 'write'],
    isDefault: true,
    createdAt: '2026-01-10T08:00:00Z',
  },
];

export const mockMembers: TeamMember[] = [
  {
    id: 'membership_01',
    teamId: 'team_01',
    employeeId: 'emp_01',
    employeeName: 'Amara Okafor',
    employeeNumber: 'ORG-0001',
    roleId: 'role_01',
    roleName: 'Manager',
    status: 'active',
    joinedAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'membership_02',
    teamId: 'team_01',
    employeeId: 'emp_02',
    employeeName: 'Chidi Eze',
    employeeNumber: 'ORG-0002',
    roleId: 'role_02',
    roleName: 'Member',
    status: 'active',
    joinedAt: '2026-01-20T09:00:00Z',
  },
];
