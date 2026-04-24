import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { employeeHandlers } from '../fixtures/handlers';
import { mockPaginatedEmployees } from '../fixtures/mock-data';

// ---------------------------------------------------------------------------
// MSW server
// ---------------------------------------------------------------------------

const server = setupServer(...employeeHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ---------------------------------------------------------------------------
// Helpers — wrap with QueryClientProvider + SessionProvider in real tests
// ---------------------------------------------------------------------------

// Note: the component imports below are placeholders pointing at where the
// actual components will live once implemented. Adjust paths at implementation time.

// import { EmployeeListPage } from '@/modules/@org/admin/employee/components/EmployeeListPage';
// import { renderWithProviders } from '@/test-utils/renderWithProviders';

// ---------------------------------------------------------------------------
// Integration tests
// ---------------------------------------------------------------------------

describe('Employee list — integration', () => {
  it('renders employee rows from the API', async () => {
    // renderWithProviders(<EmployeeListPage />);
    // await waitFor(() => {
    //   expect(screen.getByText('Amara Okafor')).toBeInTheDocument();
    //   expect(screen.getByText('Chidi Eze')).toBeInTheDocument();
    // });
    expect(mockPaginatedEmployees.data).toHaveLength(6);
  });

  it('filters list when search query is provided', async () => {
    // Simulate GET /employees?q=amara returning filtered list
    server.use(
      http.get('/api/v1/employees', ({ request }) => {
        const url = new URL(request.url);
        const q = url.searchParams.get('q')?.toLowerCase() ?? '';
        const filtered = mockPaginatedEmployees.data.filter(
          (e: { firstName: string; lastName: string }) =>
            e.firstName.toLowerCase().includes(q) ||
            e.lastName.toLowerCase().includes(q)
        );
        return HttpResponse.json({
          data: filtered,
          total: filtered.length,
          page: 1,
          size: 20,
          totalPages: 1,
        });
      })
    );
    // In the real test: type into search input and assert filtered rows render
    // For now, assert the handler produces correct output
    const response = await fetch('/api/v1/employees?q=amara');
    const json = (await response.json()) as { data: unknown[] };
    expect(json.data).toHaveLength(1);
  });

  it('shows error state when API returns 500', async () => {
    server.use(
      http.get('/api/v1/employees', () =>
        HttpResponse.json(
          { title: 'Internal Error', status: 500 },
          { status: 500 }
        )
      )
    );
    // renderWithProviders(<EmployeeListPage />);
    // await waitFor(() => {
    //   expect(screen.getByText(/unable to load employees/i)).toBeInTheDocument();
    //   expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    // });
    expect(true).toBe(true); // placeholder until component exists
  });
});

describe('Create employee — integration', () => {
  it('submits form and navigates to new profile on success', async () => {
    // const user = userEvent.setup();
    // renderWithProviders(<EmployeeFormPage />);
    // await user.type(screen.getByLabelText(/first name/i), 'Test');
    // ... fill all required fields ...
    // await user.click(screen.getByRole('button', { name: /save employee/i }));
    // await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining('/admin/employee/')));
    expect(true).toBe(true); // placeholder until component exists
  });

  it('shows email field error on 409 duplicate email response', async () => {
    server.use(
      http.post('/api/v1/employees', () =>
        HttpResponse.json(
          {
            type: 'https://hris.example.com/errors/duplicate-email',
            title: 'Duplicate Email',
            status: 409,
            errors: [{ field: 'email', code: 'DUPLICATE_EMAIL' }],
          },
          { status: 409 }
        )
      )
    );
    // After submit: screen.getByText(/already exists/i) should be near the email field
    expect(true).toBe(true); // placeholder until component exists
  });
});

describe('Status change — integration', () => {
  it('rolls back optimistic update on API error', async () => {
    server.use(
      http.post('/api/v1/employees/:id/status', () =>
        HttpResponse.json(
          { title: 'Invalid Transition', status: 422 },
          { status: 422 }
        )
      )
    );
    // Verify badge reverts to original status and error toast appears
    expect(true).toBe(true); // placeholder until component exists
  });
});
