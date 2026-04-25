import type {
  CompanyProfile,
  Team,
  Role,
  OnboardingSetupStatus,
} from '../../_domain/models/entities';

export const mockCompanyProfile: CompanyProfile = {
  id: 'co_01',
  name: 'Acme Corp',
  industry: 'Technology',
  size: '11-50',
  domain: 'acme',
  address: {
    addressLine1: '1 Innovation Drive',
    addressLine2: '',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    postcode: '100001',
  },
  createdAt: '2025-01-15T09:00:00Z',
  updatedAt: '2025-06-01T10:00:00Z',
};

export const mockRoles: Role[] = [
  {
    id: 'role_01',
    name: 'Senior Engineer',
    teamId: 'team_01',
    permissions: ['leave:read', 'payroll:read'],
  },
  {
    id: 'role_02',
    name: 'Junior Engineer',
    teamId: 'team_01',
    permissions: ['leave:read'],
  },
];

export const mockTeams: Team[] = [
  { id: 'team_01', name: 'Engineering', roles: mockRoles },
  {
    id: 'team_02',
    name: 'HR',
    roles: [
      {
        id: 'role_03',
        name: 'HR Manager',
        teamId: 'team_02',
        permissions: ['employee:manage', 'leave:manage'],
      },
    ],
  },
];

export const mockSetupStatus: OnboardingSetupStatus = {
  resetPassword: false,
  reviewProfileDetails: false,
  acknowledgePolicy: false,
  reviewPayrollInfo: false,
  takenTour: false,
};

export const mockSetupStatusComplete: OnboardingSetupStatus = {
  resetPassword: true,
  reviewProfileDetails: true,
  acknowledgePolicy: true,
  reviewPayrollInfo: true,
  takenTour: true,
};
