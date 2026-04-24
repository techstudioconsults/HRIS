import { http, HttpResponse } from 'msw';
import { mockFolders, mockFiles } from './mock-data';

export const resourcesHandlers = [
  http.get('/api/v1/resources/folders', ({ request }) => {
    const url = new URL(request.url);
    const parentId = url.searchParams.get('parentId');
    const filtered = mockFolders.filter((f) =>
      parentId === null || parentId === 'null'
        ? f.parentId === null
        : f.parentId === parentId
    );
    return HttpResponse.json({
      status: 'success',
      data: {
        items: filtered,
        total: filtered.length,
        page: 1,
        size: 25,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/v1/resources/folders', async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      parentId: string | null;
    };
    return HttpResponse.json(
      {
        status: 'success',
        data: {
          id: `folder-fixture-${Date.now()}`,
          name: body.name,
          parentId: body.parentId ?? null,
          organisationId: 'org-fixture-001',
          createdBy: 'user-fixture-001',
          updatedBy: 'user-fixture-001',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          childCount: 0,
          fileCount: 0,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  }),

  http.delete('/api/v1/resources/folders/:id', () => {
    return HttpResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
    });
  }),

  http.get('/api/v1/resources/files', ({ request }) => {
    const url = new URL(request.url);
    const folderId = url.searchParams.get('folderId');
    const filtered = mockFiles.filter((f) => f.folderId === folderId);
    return HttpResponse.json({
      status: 'success',
      data: {
        items: filtered,
        total: filtered.length,
        page: 1,
        size: 25,
        totalPages: 1,
      },
      timestamp: new Date().toISOString(),
    });
  }),

  http.post('/api/v1/resources/files/upload', () => {
    return HttpResponse.json(
      { status: 'success', data: [], timestamp: new Date().toISOString() },
      { status: 201 }
    );
  }),
];
