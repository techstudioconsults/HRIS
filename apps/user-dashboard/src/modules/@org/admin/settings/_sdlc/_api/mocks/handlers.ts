import { http, HttpResponse, delay } from 'msw';
import {
  mockAccountSettings,
  mockPayrollSettings,
  mockSecuritySettings,
  mockHRSettings,
  mockNotificationSettings,
  mockRolesResponse,
  mockCustomRoles,
} from './mock-data';

const BASE = '/api/v1/settings';

export const settingsHandlers = [
  // Account
  http.get(`${BASE}/account`, async () => {
    await delay(200);
    return HttpResponse.json({ data: mockAccountSettings });
  }),
  http.patch(`${BASE}/account`, async ({ request }) => {
    await delay(500);
    const isMultipart = request.headers
      .get('content-type')
      ?.includes('multipart');
    let body: Record<string, unknown> = {};
    if (!isMultipart) {
      body = (await request.json()) as Record<string, unknown>;
    }
    return HttpResponse.json({
      data: {
        ...mockAccountSettings,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Payroll
  http.get(`${BASE}/payroll`, async () => {
    await delay(200);
    return HttpResponse.json({ data: mockPayrollSettings });
  }),
  http.patch(`${BASE}/payroll`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      data: {
        ...mockPayrollSettings,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Security
  http.get(`${BASE}/security`, async () => {
    await delay(200);
    return HttpResponse.json({ data: mockSecuritySettings });
  }),
  http.patch(`${BASE}/security`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      data: {
        ...mockSecuritySettings,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // HR
  http.get(`${BASE}/hr`, async () => {
    await delay(200);
    return HttpResponse.json({ data: mockHRSettings });
  }),
  http.patch(`${BASE}/hr`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      data: { ...mockHRSettings, ...body, updatedAt: new Date().toISOString() },
    });
  }),

  // Notifications
  http.get(`${BASE}/notifications`, async () => {
    await delay(200);
    return HttpResponse.json({ data: mockNotificationSettings });
  }),
  http.patch(`${BASE}/notifications`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      data: {
        ...mockNotificationSettings,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // Roles — list
  http.get(`${BASE}/roles`, async () => {
    await delay(200);
    return HttpResponse.json({ data: mockRolesResponse });
  }),

  // Roles — create
  http.post(`${BASE}/roles`, async ({ request }) => {
    await delay(400);
    const body = (await request.json()) as {
      name: string;
      permissions: string[];
    };

    const duplicate = mockCustomRoles.find(
      (r) => r.name.toLowerCase() === body.name?.toLowerCase()
    );
    if (duplicate) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/duplicate-role-name',
          title: 'Duplicate Role Name',
          status: 409,
          errors: [{ field: 'name', code: 'DUPLICATE_ROLE_NAME' }],
        },
        { status: 409 }
      );
    }

    const newRole = {
      id: `role_custom_${Date.now()}`,
      organisationId: 'org_01',
      name: body.name,
      isSystem: false,
      permissions: body.permissions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin_01',
    };
    return HttpResponse.json({ data: newRole }, { status: 201 });
  }),

  // Roles — update
  http.patch(`${BASE}/roles/:id`, async ({ params, request }) => {
    await delay(400);
    const role = mockCustomRoles.find((r) => r.id === params.id);
    if (!role) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    if (role.isSystem) {
      return HttpResponse.json(
        { title: 'Forbidden', status: 403 },
        { status: 403 }
      );
    }
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      data: { ...role, ...body, updatedAt: new Date().toISOString() },
    });
  }),

  // Roles — delete
  http.delete(`${BASE}/roles/:id`, async ({ params }) => {
    await delay(300);
    const role = mockCustomRoles.find((r) => r.id === params.id);
    if (role?.isSystem) {
      return HttpResponse.json(
        { title: 'Forbidden', status: 403 },
        { status: 403 }
      );
    }
    return new HttpResponse(null, { status: 204 });
  }),
];
