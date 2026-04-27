import { http, HttpResponse, delay } from 'msw';
import { mockCompanyProfile, mockTeams, mockSetupStatus } from './mock-data';

const BASE = '/api/v1';

let localTeams = [...mockTeams];
let localSetupStatus = { ...mockSetupStatus };

export const onboardingHandlers = [
  // Company profile
  http.get(`${BASE}/companies/current`, async () => {
    await delay(200);
    return HttpResponse.json({ status: 'success', data: mockCompanyProfile });
  }),

  http.patch(`${BASE}/companies/current`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Partial<typeof mockCompanyProfile>;
    return HttpResponse.json({
      status: 'success',
      data: { ...mockCompanyProfile, ...body },
    });
  }),

  // Teams
  http.get(`${BASE}/teams`, async () => {
    await delay(200);
    return HttpResponse.json({
      status: 'success',
      data: localTeams.map(({ id, name }) => ({ id, name })),
    });
  }),

  http.post(`${BASE}/teams`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { name: string };
    const newTeam = {
      id: `team_${Date.now()}`,
      name: body.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localTeams = [...localTeams, { ...newTeam, roles: [] }];
    return HttpResponse.json(
      { status: 'success', data: newTeam },
      { status: 201 }
    );
  }),

  http.patch(`${BASE}/teams/:teamId`, async ({ params, request }) => {
    await delay(250);
    const body = (await request.json()) as { name: string };
    localTeams = localTeams.map((t) =>
      t.id === params.teamId ? { ...t, name: body.name } : t
    );
    return HttpResponse.json({
      status: 'success',
      data: { id: params.teamId, name: body.name },
    });
  }),

  http.delete(`${BASE}/teams/:teamId`, async ({ params }) => {
    await delay(250);
    localTeams = localTeams.filter((t) => t.id !== params.teamId);
    return new HttpResponse(null, { status: 204 });
  }),

  // Roles
  http.get(`${BASE}/roles/:teamId`, async ({ params }) => {
    await delay(150);
    const team = localTeams.find((t) => t.id === params.teamId);
    return HttpResponse.json({ status: 'success', data: team?.roles ?? [] });
  }),

  http.post(`${BASE}/roles`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as {
      name: string;
      teamId: string;
      permissions: string[];
    };
    const newRole = {
      id: `role_${Date.now()}`,
      name: body.name,
      teamId: body.teamId,
      permissions: body.permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    localTeams = localTeams.map((t) =>
      t.id === body.teamId
        ? {
            ...t,
            roles: [
              ...t.roles,
              {
                id: newRole.id,
                name: newRole.name,
                teamId: newRole.teamId,
                permissions: newRole.permissions,
              },
            ],
          }
        : t
    );
    return HttpResponse.json(
      { status: 'success', data: newRole },
      { status: 201 }
    );
  }),

  http.patch(`${BASE}/roles/:roleId`, async ({ params, request }) => {
    await delay(250);
    const body = (await request.json()) as Partial<{
      name: string;
      permissions: string[];
    }>;
    localTeams = localTeams.map((t) => ({
      ...t,
      roles: t.roles.map((r) =>
        r.id === params.roleId ? { ...r, ...body } : r
      ),
    }));
    return HttpResponse.json({
      status: 'success',
      data: { id: params.roleId, ...body },
    });
  }),

  http.delete(`${BASE}/roles/:roleId`, async ({ params }) => {
    await delay(200);
    localTeams = localTeams.map((t) => ({
      ...t,
      roles: t.roles.filter((r) => r.id !== params.roleId),
    }));
    return new HttpResponse(null, { status: 204 });
  }),

  // Employees — batch onboard
  http.post(`${BASE}/employees/onboard`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { employees: unknown[] };
    return HttpResponse.json(
      { status: 'success', data: { invited: body.employees.length } },
      { status: 201 }
    );
  }),

  // Setup status
  http.get(`${BASE}/employees/:employeeId/setup`, async () => {
    await delay(150);
    return HttpResponse.json({ status: 'success', data: localSetupStatus });
  }),

  http.patch(`${BASE}/employees/:employeeId/setup`, async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as Partial<typeof localSetupStatus>;
    localSetupStatus = { ...localSetupStatus, ...body };
    return HttpResponse.json({ status: 'success', data: localSetupStatus });
  }),
];

export const teamDeleteBlockedHandler = http.delete(
  `/api/v1/teams/:teamId`,
  async () => {
    await delay(200);
    return HttpResponse.json(
      {
        title: 'Team has active employees. Reassign them before deleting.',
        status: 409,
      },
      { status: 409 }
    );
  }
);

export const employeeOnboardDuplicateEmailHandler = http.post(
  `/api/v1/employees/onboard`,
  async () => {
    await delay(200);
    return HttpResponse.json(
      {
        title: 'Email already exists',
        status: 409,
        errors: [
          {
            field: 'employees[0].email',
            message: 'This email is already registered.',
          },
        ],
      },
      { status: 409 }
    );
  }
);
