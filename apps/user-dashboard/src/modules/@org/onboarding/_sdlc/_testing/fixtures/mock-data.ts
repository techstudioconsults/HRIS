export const fixtureCompanyProfile = {
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

export const fixtureTeams = [
  {
    id: 'team_01',
    name: 'Engineering',
    roles: [
      {
        id: 'role_01',
        name: 'Senior Engineer',
        teamId: 'team_01',
        permissions: ['leave:read', 'payroll:read'],
      },
    ],
  },
];

export const fixtureNewTeamPayload = { name: 'Design' };
export const fixtureNewTeamResponse = {
  id: 'team_new',
  name: 'Design',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const fixtureEmployeePayload = {
  employees: [
    {
      firstName: 'Bola',
      lastName: 'Adeyemi',
      email: 'bola@acme.com',
      phoneNumber: '+2348012345678',
      password: 'TempPass123!',
      teamId: 'team_01',
      roleId: 'role_01',
    },
  ],
};

export const fixtureSetupStatus = {
  resetPassword: false,
  reviewProfileDetails: false,
  acknowledgePolicy: false,
  reviewPayrollInfo: false,
  takenTour: false,
};
