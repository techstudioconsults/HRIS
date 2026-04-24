import { http, HttpResponse } from 'msw';

export const homeHandlers = [
  http.get('/api/v1/employees/:id/activities', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        items: [
          {
            id: 'activity-1',
            type: 'approved',
            title: 'Leave Request Approved',
            message: 'Your annual leave for Oct 18-21 was approved.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'activity-2',
            type: 'available',
            title: 'Payslip Available',
            message: 'Your September 2025 payslip is now ready to view.',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: 'activity-3',
            type: 'submitted',
            title: 'New Leave Request Submitted',
            message:
              'You requested Annual Leave (Oct 10-13) — awaiting approval.',
            timestamp: '2025-09-22T09:00:00.000Z',
          },
          {
            id: 'activity-4',
            type: 'rejected',
            title: 'Leave Rejected',
            message: 'Your Casual Leave (Oct 2-3) was rejected.',
            timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
          },
        ],
        total: 4,
        page: 1,
        size: 20,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/employees/:id/profile', () => {
    return HttpResponse.json({
      status: 'success',
      data: {
        id: 'emp-001',
        firstName: 'Jane',
        lastName: 'Doe',
        userSetupComplete: true,
      },
      timestamp: new Date().toISOString(),
    });
  }),
];
