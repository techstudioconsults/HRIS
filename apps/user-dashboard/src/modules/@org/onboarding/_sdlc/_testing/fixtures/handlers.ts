import { http, HttpResponse, delay } from 'msw';
import {
  fixtureCompanyProfile,
  fixtureTeams,
  fixtureNewTeamResponse,
  fixtureSetupStatus,
} from './mock-data';

const BASE = '/api/v1';

export const onboardingTestHandlers = [
  http.get(`${BASE}/companies/current`, async () => {
    await delay(50);
    return HttpResponse.json({
      status: 'success',
      data: fixtureCompanyProfile,
    });
  }),

  http.patch(`${BASE}/companies/current`, async () => {
    await delay(50);
    return HttpResponse.json({
      status: 'success',
      data: fixtureCompanyProfile,
    });
  }),

  http.get(`${BASE}/teams`, async () => {
    await delay(50);
    return HttpResponse.json({
      status: 'success',
      data: fixtureTeams.map(({ id, name }) => ({ id, name })),
    });
  }),

  http.post(`${BASE}/teams`, async () => {
    await delay(50);
    return HttpResponse.json(
      { status: 'success', data: fixtureNewTeamResponse },
      { status: 201 }
    );
  }),

  http.patch(`${BASE}/teams/:teamId`, async ({ request }) => {
    await delay(50);
    const body = (await request.json()) as { name: string };
    return HttpResponse.json({
      status: 'success',
      data: { id: 'team_01', name: body.name },
    });
  }),

  http.delete(`${BASE}/teams/:teamId`, async () => {
    await delay(50);
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${BASE}/roles/:teamId`, async ({ params }) => {
    await delay(50);
    const team = fixtureTeams.find((t) => t.id === params.teamId);
    return HttpResponse.json({ status: 'success', data: team?.roles ?? [] });
  }),

  http.post(`${BASE}/roles`, async ({ request }) => {
    await delay(50);
    const body = (await request.json()) as {
      name: string;
      teamId: string;
      permissions: string[];
    };
    return HttpResponse.json(
      { status: 'success', data: { id: 'role_new', ...body } },
      { status: 201 }
    );
  }),

  http.patch(`${BASE}/roles/:roleId`, async ({ request }) => {
    await delay(50);
    const body = await request.json();
    return HttpResponse.json({ status: 'success', data: body });
  }),

  http.delete(`${BASE}/roles/:roleId`, async () => {
    await delay(50);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(`${BASE}/employees/onboard`, async ({ request }) => {
    await delay(50);
    const body = (await request.json()) as { employees: unknown[] };
    return HttpResponse.json(
      { status: 'success', data: { invited: body.employees.length } },
      { status: 201 }
    );
  }),

  http.get(`${BASE}/employees/:employeeId/setup`, async () => {
    await delay(50);
    return HttpResponse.json({ status: 'success', data: fixtureSetupStatus });
  }),

  http.patch(`${BASE}/employees/:employeeId/setup`, async ({ request }) => {
    await delay(50);
    const body = await request.json();
    return HttpResponse.json({
      status: 'success',
      data: { ...fixtureSetupStatus, ...(body as object) },
    });
  }),
];

export const teamDeleteBlockedHandler = http.delete(
  `${BASE}/teams/:teamId`,
  async () =>
    HttpResponse.json(
      { title: 'Team has active employees.', status: 409 },
      { status: 409 }
    )
);

export const employeeDuplicateEmailHandler = http.post(
  `${BASE}/employees/onboard`,
  async () =>
    HttpResponse.json(
      {
        title: 'Duplicate email',
        status: 409,
        errors: [
          {
            field: 'employees[0].email',
            message: 'This email is already registered.',
          },
        ],
      },
      { status: 409 }
    )
);
