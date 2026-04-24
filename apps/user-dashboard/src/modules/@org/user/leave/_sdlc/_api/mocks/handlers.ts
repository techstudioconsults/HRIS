import { http, HttpResponse, delay } from 'msw';
import { mockLeaveTypes, mockLeaveRequests } from './mock-data';

const BASE = '/api/v1';

export const userLeaveHandlers = [
  // List leave types
  http.get(`${BASE}/leaves`, async () => {
    await delay(200);
    return HttpResponse.json({ status: 'success', data: mockLeaveTypes });
  }),

  // List employee's leave requests
  http.get(`${BASE}/leave-request`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const page = Number(url.searchParams.get('page') ?? '1');
    const size = Number(url.searchParams.get('size') ?? '20');

    let items = [...mockLeaveRequests];
    if (status) {
      items = items.filter((r) => r.status === status);
    }

    const total = items.length;
    const start = (page - 1) * size;
    const paged = items.slice(start, start + size);

    return HttpResponse.json({
      status: 'success',
      data: paged,
      pagination: { total, page, size, totalPages: Math.ceil(total / size) },
    });
  }),

  // Create leave request
  http.post(`${BASE}/leave-request`, async ({ request }) => {
    await delay(500);
    // FormData — extract fields
    const formData = await request.formData();
    const leaveId = formData.get('leaveId') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const reason = formData.get('reason') as string;

    if (!leaveId || !startDate || !endDate || !reason) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/validation-error',
          title: 'Validation Error',
          status: 422,
          errors: [
            !leaveId && {
              field: 'leaveId',
              code: 'REQUIRED',
              message: 'Please select a leave type.',
            },
            !startDate && {
              field: 'startDate',
              code: 'REQUIRED',
              message: 'Please select a start date.',
            },
            !endDate && {
              field: 'endDate',
              code: 'REQUIRED',
              message: 'Please select an end date.',
            },
            !reason && {
              field: 'reason',
              code: 'REQUIRED',
              message: 'Please provide a reason.',
            },
          ].filter(Boolean),
        },
        { status: 422 }
      );
    }

    const leaveType = mockLeaveTypes.find((lt) => lt.id === leaveId);
    const newRequest = {
      id: `lr_${Date.now()}`,
      employeeId: 'emp_01',
      employeeName: 'Amara Okafor',
      leaveTypeId: leaveId,
      type: leaveType?.name ?? 'Unknown',
      startDate,
      endDate,
      days: 1, // simplified for mock
      reason,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(
      { status: 'success', data: newRequest },
      { status: 201 }
    );
  }),

  // Update pending leave request
  http.patch(`${BASE}/leave-request/:id`, async ({ params, request }) => {
    await delay(400);
    const existing = mockLeaveRequests.find((r) => r.id === params.id);

    if (!existing) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    if (existing.status !== 'pending') {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/request-not-pending',
          title: 'Request Not Pending',
          status: 409,
          detail: 'Only pending leave requests can be edited.',
        },
        { status: 409 }
      );
    }

    const formData = await request.formData();
    const updated = {
      ...existing,
      startDate: (formData.get('startDate') as string) ?? existing.startDate,
      endDate: (formData.get('endDate') as string) ?? existing.endDate,
      reason: (formData.get('reason') as string) ?? existing.reason,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({ status: 'success', data: updated });
  }),

  // Delete pending leave request
  http.delete(`${BASE}/leave-request/:id`, async ({ params }) => {
    await delay(300);
    const existing = mockLeaveRequests.find((r) => r.id === params.id);

    if (!existing) {
      return HttpResponse.json(
        { title: 'Not Found', status: 404 },
        { status: 404 }
      );
    }
    if (existing.status !== 'pending') {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/request-not-pending',
          title: 'Request Not Pending',
          status: 409,
          detail: 'Only pending leave requests can be deleted.',
        },
        { status: 409 }
      );
    }

    return new HttpResponse(null, { status: 204 });
  }),
];
