import { http, HttpResponse } from 'msw';

export const leaveHandlers = [
  http.get('/api/v1/leave/requests', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        items: [],
        total: 0,
        page: 1,
        size: 20,
        totalPages: 0,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.patch('/api/v1/leave/requests/:id/approve', ({ params }) => {
    return HttpResponse.json({
      status: 'success',
      data: {
        id: params['id'],
        status: 'approved',
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.patch('/api/v1/leave/requests/:id/decline', ({ params }) => {
    return HttpResponse.json({
      status: 'success',
      data: {
        id: params['id'],
        status: 'declined',
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/leave/types', () => {
    return HttpResponse.json({
      status: 'success',
      data: [],
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/v1/leave/types', () => {
    return HttpResponse.json(
      {
        status: 'success',
        data: {},
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.put('/api/v1/leave/types/:id', ({ params }) => {
    return HttpResponse.json({
      status: 'success',
      data: { id: params['id'] },
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
      data: {},
      timestamp: new Date().toISOString(),
    });
  }),

  http.put('/api/v1/leave/policy', () => {
    return HttpResponse.json({
      status: 'success',
      data: {},
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/leave/balance/:employeeId', ({ params }) => {
    return HttpResponse.json({
      status: 'success',
      data: [],
      timestamp: new Date().toISOString(),
    });
  }),

  // TODO: add POST/PUT/DELETE handlers as endpoints are confirmed
];
