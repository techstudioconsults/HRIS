import { http, HttpResponse } from 'msw';
import { mockLeaveData } from './mock-data';

export const leaveHandlers = [
  http.get('/api/v1/leave/requests', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const items = status
      ? mockLeaveData.leaveRequests.filter((r) => r.status === status)
      : mockLeaveData.leaveRequests;

    return HttpResponse.json({
      status: 'success',
      data: {
        items,
        total: items.length,
        page: 1,
        size: 20,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.patch('/api/v1/leave/requests/:id/approve', ({ params }) => {
    const leaveReq = mockLeaveData.leaveRequests.find(
      (r) => r.id === params['id']
    );
    if (!leaveReq) {
      return HttpResponse.json(
        {
          status: 'error',
          message: 'Leave request not found',
          timestamp: new Date().toISOString(),
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({
      status: 'success',
      data: {
        ...leaveReq,
        status: 'approved',
        actionedAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.patch(
    '/api/v1/leave/requests/:id/decline',
    async ({ params, request }) => {
      const body = (await request.json()) as { reason?: string };
      if (!body.reason || body.reason.length < 10) {
        return HttpResponse.json(
          {
            status: 'error',
            message: 'Decline reason must be at least 10 characters',
            timestamp: new Date().toISOString(),
          },
          { status: 422 }
        );
      }
      const leaveRequest = mockLeaveData.leaveRequests.find(
        (r) => r.id === params['id']
      );
      return HttpResponse.json({
        status: 'success',
        data: {
          ...(leaveRequest ?? {}),
          status: 'declined',
          declineReason: body.reason,
          actionedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      });
    }
  ),

  http.get('/api/v1/leave/types', () => {
    return HttpResponse.json({
      status: 'success',
      data: mockLeaveData.leaveTypes,
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/v1/leave/types', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json(
      {
        status: 'success',
        data: { id: `lt-new-${Date.now()}`, ...body },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.put('/api/v1/leave/types/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      status: 'success',
      data: { id: params['id'], ...body },
      timestamp: new Date().toISOString(),
    });
  }),

  http.patch('/api/v1/leave/types/:id/archive', ({ params }) => {
    return HttpResponse.json({
      status: 'success',
      data: { id: params['id'], isArchived: true },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/leave/policy', () => {
    return HttpResponse.json({
      status: 'success',
      data: mockLeaveData.leavePolicy,
      timestamp: new Date().toISOString(),
    });
  }),

  http.put('/api/v1/leave/policy', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    return HttpResponse.json({
      status: 'success',
      data: { ...mockLeaveData.leavePolicy, ...body },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/leave/balance/:employeeId', ({ params }) => {
    const balances = mockLeaveData.leaveBalances.filter(
      (b) => b.employeeId === params['employeeId']
    );
    return HttpResponse.json({
      status: 'success',
      data: balances,
      timestamp: new Date().toISOString(),
    });
  }),

  // TODO: add POST/PUT/DELETE handlers as endpoints are confirmed
];
