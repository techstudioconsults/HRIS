import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { userLeaveHandlers } from '../fixtures/handlers';
import { mockLeaveTypes, mockLeaveRequests } from '../fixtures/mock-data';

const server = setupServer(...userLeaveHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Leave types — integration', () => {
  it('loads leave types from the API', async () => {
    const res = await fetch('/api/v1/leaves');
    const json = (await res.json()) as { data: typeof mockLeaveTypes };
    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(3);
    expect(json.data[0].name).toBe('Annual Leave');
  });
});

describe('Leave requests list — integration', () => {
  it('loads the employee own requests', async () => {
    const res = await fetch('/api/v1/leave-request');
    const json = (await res.json()) as { data: typeof mockLeaveRequests };
    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(3);
  });

  it('filters by status', async () => {
    const res = await fetch('/api/v1/leave-request?status=pending');
    const json = (await res.json()) as { data: Array<{ status: string }> };
    expect(json.data.every((r) => r.status === 'pending')).toBe(true);
  });
});

describe('Create leave request — integration', () => {
  it('creates a new pending leave request', async () => {
    const formData = new FormData();
    formData.append('leaveId', 'lt_annual');
    formData.append('startDate', '2025-08-01');
    formData.append('endDate', '2025-08-05');
    formData.append('reason', 'Rest and relaxation');

    const res = await fetch('/api/v1/leave-request', {
      method: 'POST',
      body: formData,
    });
    const json = (await res.json()) as {
      data: { status: string; leaveTypeId: string };
    };
    expect(res.status).toBe(201);
    expect(json.data.status).toBe('pending');
    expect(json.data.leaveTypeId).toBe('lt_annual');
  });

  it('returns 422 when required fields are missing', async () => {
    const formData = new FormData();
    // missing leaveId, startDate, endDate, reason

    const res = await fetch('/api/v1/leave-request', {
      method: 'POST',
      body: formData,
    });
    expect(res.status).toBe(422);
    const json = (await res.json()) as { errors: Array<{ field: string }> };
    const fields = json.errors.map((e) => e.field);
    expect(fields).toContain('leaveId');
    expect(fields).toContain('startDate');
  });
});

describe('Edit leave request — integration', () => {
  it('updates a pending request', async () => {
    const formData = new FormData();
    formData.append('reason', 'Updated reason');

    const res = await fetch('/api/v1/leave-request/lr_01', {
      method: 'PATCH',
      body: formData,
    });
    const json = (await res.json()) as { data: { reason: string } };
    expect(res.status).toBe(200);
    expect(json.data.reason).toBe('Updated reason');
  });

  it('returns 409 when editing a non-pending request', async () => {
    const formData = new FormData();
    formData.append('reason', 'Try to edit approved request');

    const res = await fetch('/api/v1/leave-request/lr_02', {
      method: 'PATCH',
      body: formData,
    });
    expect(res.status).toBe(409);
    // In real component test: toast shown, modal closes
  });
});

describe('Delete leave request — integration', () => {
  it('deletes a pending request', async () => {
    const res = await fetch('/api/v1/leave-request/lr_01', {
      method: 'DELETE',
    });
    expect(res.status).toBe(204);
  });

  it('returns 409 when deleting an approved request', async () => {
    const res = await fetch('/api/v1/leave-request/lr_02', {
      method: 'DELETE',
    });
    expect(res.status).toBe(409);
  });
});

describe('Error handling — integration', () => {
  it('handles 500 on leave types fetch', async () => {
    server.use(
      http.get('/api/v1/leaves', () =>
        HttpResponse.json(
          { title: 'Internal Error', status: 500 },
          { status: 500 }
        )
      )
    );
    const res = await fetch('/api/v1/leaves');
    expect(res.status).toBe(500);
    // In real component test: form shows error state; submit button disabled
  });
});
