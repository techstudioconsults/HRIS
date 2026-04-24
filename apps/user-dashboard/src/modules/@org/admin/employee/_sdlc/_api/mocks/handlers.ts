import { http, HttpResponse, delay } from 'msw';
import {
  mockPaginatedEmployees,
  mockEmployees,
  mockDocuments,
  mockAuditEntries,
} from './mock-data';

const BASE = '/api/v1';

export const employeeHandlers = [
  // List employees
  http.get(`${BASE}/employees`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase() ?? '';
    const department = url.searchParams.get('department');
    const status = url.searchParams.get('status');
    const page = Number(url.searchParams.get('page') ?? '1');
    const size = Number(url.searchParams.get('size') ?? '20');

    let items = mockPaginatedEmployees.data;

    if (q) {
      items = items.filter(
        (e) =>
          e.firstName.toLowerCase().includes(q) ||
          e.lastName.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.employeeNumber.toLowerCase().includes(q)
      );
    }
    if (department) {
      items = items.filter((e) => e.department.id === department);
    }
    if (status) {
      items = items.filter((e) => e.employmentStatus === status);
    }

    const total = items.length;
    const start = (page - 1) * size;
    const paged = items.slice(start, start + size);

    return HttpResponse.json({
      data: paged,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    });
  }),

  // Get single employee
  http.get(`${BASE}/employees/:id`, async ({ params }) => {
    await delay(200);
    const employee = mockEmployees.find((e) => e.id === params.id);
    if (!employee) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/not-found',
          title: 'Employee Not Found',
          status: 404,
          detail: `No employee with id '${params.id}' exists.`,
        },
        { status: 404 }
      );
    }
    return HttpResponse.json({ data: employee });
  }),

  // Create employee
  http.post(`${BASE}/employees`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as Record<string, unknown>;

    // Simulate duplicate email check
    const duplicate = mockEmployees.find((e) => e.email === body['email']);
    if (duplicate) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/duplicate-email',
          title: 'Duplicate Email',
          status: 409,
          detail: 'An employee with this email address already exists.',
          errors: [{ field: 'email', code: 'DUPLICATE_EMAIL' }],
        },
        { status: 409 }
      );
    }

    const newEmployee = {
      id: `emp_${Date.now()}`,
      employeeNumber: `ORG-${String(mockEmployees.length + 1).padStart(4, '0')}`,
      ...body,
      employmentStatus: 'ON_PROBATION',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'admin_01',
    };
    return HttpResponse.json({ data: newEmployee }, { status: 201 });
  }),

  // Update employee
  http.patch(`${BASE}/employees/:id`, async ({ params, request }) => {
    await delay(400);
    const employee = mockEmployees.find((e) => e.id === params.id);
    if (!employee) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/not-found',
          title: 'Employee Not Found',
          status: 404,
        },
        { status: 404 }
      );
    }
    const body = (await request.json()) as Record<string, unknown>;
    const updated = {
      ...employee,
      ...body,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: updated });
  }),

  // Change employment status
  http.post(`${BASE}/employees/:id/status`, async ({ params, request }) => {
    await delay(400);
    const employee = mockEmployees.find((e) => e.id === params.id);
    if (!employee) {
      return HttpResponse.json(
        {
          type: 'https://hris.example.com/errors/not-found',
          title: 'Employee Not Found',
          status: 404,
        },
        { status: 404 }
      );
    }
    const body = (await request.json()) as { newStatus: string };
    const updated = {
      ...employee,
      employmentStatus: body.newStatus,
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: updated });
  }),

  // List documents
  http.get(`${BASE}/employees/:id/documents`, async ({ params }) => {
    await delay(200);
    const docs = mockDocuments.filter((d) => d.employeeId === params.id);
    return HttpResponse.json({ data: docs });
  }),

  // Upload document
  http.post(`${BASE}/employees/:id/documents`, async ({ params }) => {
    await delay(800);
    const newDoc = {
      id: `doc_${Date.now()}`,
      employeeId: params.id,
      type: 'OTHER',
      name: 'uploaded-document.pdf',
      url: 'https://storage.example.com/mock-signed-url-new',
      sizeBytes: 51200,
      mimeType: 'application/pdf',
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'admin_01',
    };
    return HttpResponse.json({ data: newDoc }, { status: 201 });
  }),

  // Delete document
  http.delete(`${BASE}/employees/:id/documents/:docId`, async () => {
    await delay(300);
    return new HttpResponse(null, { status: 204 });
  }),

  // Audit trail
  http.get(`${BASE}/employees/:id/audit`, async ({ params }) => {
    await delay(200);
    const entries = mockAuditEntries.filter((a) => a.employeeId === params.id);
    return HttpResponse.json({
      data: entries,
      total: entries.length,
      page: 1,
      size: 20,
      totalPages: 1,
    });
  }),
];
