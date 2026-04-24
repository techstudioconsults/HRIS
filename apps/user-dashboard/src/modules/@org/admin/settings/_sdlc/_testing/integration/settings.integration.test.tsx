import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { settingsHandlers } from '../fixtures/handlers';
import { mockAccountSettings, mockRolesResponse } from '../fixtures/mock-data';

// ---------------------------------------------------------------------------
// MSW server
// ---------------------------------------------------------------------------

const server = setupServer(...settingsHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ---------------------------------------------------------------------------
// Integration tests
// ---------------------------------------------------------------------------

describe('Account settings tab — integration', () => {
  it('loads account settings from the API', async () => {
    const res = await fetch('/api/v1/settings/account');
    const json = (await res.json()) as { data: typeof mockAccountSettings };
    expect(json.data.name).toBe('Techstudio Academy Ltd');
    expect(json.data.contactEmail).toBe('admin@techstudioacademy.com');
  });

  it('saves updated account settings', async () => {
    const res = await fetch('/api/v1/settings/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Techstudio Academy Updated' }),
    });
    const json = (await res.json()) as { data: { name: string } };
    expect(res.status).toBe(200);
    expect(json.data.name).toBe('Techstudio Academy Updated');
  });

  it('returns error on 500', async () => {
    server.use(
      http.patch('/api/v1/settings/account', () =>
        HttpResponse.json(
          { title: 'Internal Error', status: 500 },
          { status: 500 }
        )
      )
    );
    const res = await fetch('/api/v1/settings/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test' }),
    });
    expect(res.status).toBe(500);
    // In real component test: form values are preserved, error toast shown
  });
});

describe('Payroll settings tab — integration', () => {
  it('loads payroll settings with deductions', async () => {
    const res = await fetch('/api/v1/settings/payroll');
    const json = (await res.json()) as {
      data: { payCycle: string; deductions: unknown[] };
    };
    expect(json.data.payCycle).toBe('MONTHLY');
    expect(json.data.deductions).toHaveLength(3);
  });

  it('saves updated pay cycle', async () => {
    const res = await fetch('/api/v1/settings/payroll', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ payCycle: 'BI_WEEKLY' }),
    });
    const json = (await res.json()) as { data: { payCycle: string } };
    expect(res.status).toBe(200);
    expect(json.data.payCycle).toBe('BI_WEEKLY');
  });
});

describe('Roles tab — integration', () => {
  it('loads system and custom roles', async () => {
    const res = await fetch('/api/v1/settings/roles');
    const json = (await res.json()) as { data: typeof mockRolesResponse };
    expect(json.data.system).toHaveLength(4);
    expect(json.data.custom).toHaveLength(1);
  });

  it('creates a new custom role', async () => {
    const res = await fetch('/api/v1/settings/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Role',
        permissions: ['admin:employees:read'],
      }),
    });
    const json = (await res.json()) as {
      data: { name: string; isSystem: boolean };
    };
    expect(res.status).toBe(201);
    expect(json.data.name).toBe('New Role');
    expect(json.data.isSystem).toBe(false);
  });

  it('returns 409 for duplicate role name', async () => {
    const res = await fetch('/api/v1/settings/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Recruitment Lead',
        permissions: ['admin:employees:read'],
      }),
    });
    expect(res.status).toBe(409);
    const json = (await res.json()) as { errors: Array<{ code: string }> };
    expect(json.errors[0].code).toBe('DUPLICATE_ROLE_NAME');
    // In real component test: name field shows inline error
  });

  it('deletes a custom role', async () => {
    const res = await fetch('/api/v1/settings/roles/role_custom_01', {
      method: 'DELETE',
    });
    expect(res.status).toBe(204);
  });

  it('returns 403 when attempting to delete a system role', async () => {
    const res = await fetch('/api/v1/settings/roles/role_super_admin', {
      method: 'DELETE',
    });
    expect(res.status).toBe(403);
    // In real component test: delete button not shown for system roles (UI prevention)
  });
});

describe('Security settings — integration', () => {
  it('loads security settings', async () => {
    const res = await fetch('/api/v1/settings/security');
    const json = (await res.json()) as {
      data: { enforce2FA: boolean; sessionTimeoutMinutes: number };
    };
    expect(json.data.enforce2FA).toBe(false);
    expect(json.data.sessionTimeoutMinutes).toBe(60);
  });

  it('saves 2FA enforcement toggle', async () => {
    const res = await fetch('/api/v1/settings/security', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enforce2FA: true }),
    });
    const json = (await res.json()) as { data: { enforce2FA: boolean } };
    expect(res.status).toBe(200);
    expect(json.data.enforce2FA).toBe(true);
  });
});
