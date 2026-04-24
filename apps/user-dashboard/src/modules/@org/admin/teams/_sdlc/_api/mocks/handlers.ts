import { http, HttpResponse, delay } from 'msw';
import {
  mockTeams,
  mockTeamsPaginated,
  mockRoles,
  mockMembers,
} from './mock-data';

const BASE = '/api/v1';

export const teamHandlers = [
  // ── Teams ──────────────────────────────────────────────────────────────────

  http.get(`${BASE}/teams`, async () => {
    await delay(250);
    return HttpResponse.json(mockTeamsPaginated);
  }),

  http.post(`${BASE}/Teams`, async ({ request }) => {
    await delay(400);
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const newTeam = {
      id: `team_${Date.now()}`,
      organisationId: 'org_01',
      name,
      description,
      status: 'active' as const,
      memberCount: 0,
      createdBy: 'admin_01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: newTeam }, { status: 201 });
  }),

  http.get(`${BASE}/teams/:id`, async ({ params }) => {
    await delay(200);
    const team = mockTeams.find((t) => t.id === params.id);
    if (!team) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    return HttpResponse.json({ data: team });
  }),

  http.patch(`${BASE}/teams/:id`, async ({ params, request }) => {
    await delay(350);
    const formData = await request.formData();
    const team = mockTeams.find((t) => t.id === params.id);
    if (!team) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    const updated = {
      ...team,
      name: (formData.get('name') as string | null) ?? team.name,
      description:
        (formData.get('description') as string | null) ?? team.description,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: updated });
  }),

  http.delete(`${BASE}/teams/:id`, async ({ params }) => {
    await delay(300);
    const team = mockTeams.find((t) => t.id === params.id);
    if (!team) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    if (team.memberCount > 0) {
      return HttpResponse.json(
        { title: 'Team Has Members', status: 409, code: 'TEAM_HAS_MEMBERS' },
        { status: 409 }
      );
    }
    return HttpResponse.json({ success: true });
  }),

  http.get(`${BASE}/teams/export`, async () => {
    await delay(500);
    const csv =
      'id,name,description,memberCount\n' +
      mockTeams
        .map((t) => `${t.id},${t.name},${t.description},${t.memberCount}`)
        .join('\n');
    return new HttpResponse(csv, {
      status: 200,
      headers: { 'Content-Type': 'text/csv' },
    });
  }),

  // ── Roles ──────────────────────────────────────────────────────────────────

  http.get(`${BASE}/teams/:id/roles`, async () => {
    await delay(200);
    return HttpResponse.json({ data: mockRoles });
  }),

  http.post(`${BASE}/teams/:id/roles`, async ({ params, request }) => {
    await delay(350);
    const body = (await request.json()) as {
      name: string;
      permissions: string[];
    };
    const duplicate = mockRoles.find(
      (r) => r.teamId === params.id && r.name === body.name
    );
    if (duplicate) {
      return HttpResponse.json(
        { title: 'Role name exists', status: 409, code: 'ROLE_NAME_EXISTS' },
        { status: 409 }
      );
    }
    const newRole = {
      id: `role_${Date.now()}`,
      teamId: String(params.id),
      name: body.name,
      permissions: body.permissions as never[],
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: newRole }, { status: 201 });
  }),

  http.patch(`${BASE}/teams/:id/roles/:roleId`, async ({ params, request }) => {
    await delay(300);
    const body = (await request.json()) as {
      name?: string;
      permissions?: string[];
    };
    const role = mockRoles.find((r) => r.id === params.roleId);
    if (!role) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    const updated = { ...role, ...body };
    return HttpResponse.json({ data: updated });
  }),

  // ── Members ────────────────────────────────────────────────────────────────

  http.post(`${BASE}/teams/:id/employees`, async ({ params, request }) => {
    await delay(400);
    const body = (await request.json()) as {
      employeeId: string;
      roleId: string;
      customPermissions?: string[];
    };
    const existing = mockMembers.find(
      (m) => m.teamId === params.id && m.employeeId === body.employeeId
    );
    if (existing) {
      return HttpResponse.json(
        {
          title: 'Member already exists',
          status: 409,
          code: 'MEMBER_ALREADY_EXISTS',
        },
        { status: 409 }
      );
    }
    return HttpResponse.json({ data: { success: true } }, { status: 201 });
  }),
];
