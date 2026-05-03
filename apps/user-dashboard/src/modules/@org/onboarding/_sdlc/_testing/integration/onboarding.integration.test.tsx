import React from 'react';
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  vi,
} from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';

import { onboardingTestHandlers } from '../fixtures/handlers';
import { fixtureCompanyProfile } from '../fixtures/mock-data';

// ---------------------------------------------------------------------------
// Hoisted mock references — must be declared before vi.mock() calls
// ---------------------------------------------------------------------------

const mockPush = vi.hoisted(() => vi.fn());

const mockGetCompanyProfile = vi.hoisted(() =>
  vi.fn().mockReturnValue({ data: null, isPending: false })
);
const mockUpdateCompanyProfile = vi.hoisted(() => vi.fn());
const mockCreateTeam = vi.hoisted(() => vi.fn());
const mockUpdateTeam = vi.hoisted(() => vi.fn());
const mockDeleteTeam = vi.hoisted(() => vi.fn());
const mockCreateRole = vi.hoisted(() => vi.fn());
const mockUpdateRole = vi.hoisted(() => vi.fn());
const mockDeleteRole = vi.hoisted(() => vi.fn());
const mockOnboardEmployees = vi.hoisted(() => vi.fn());
const mockSetSetupStatus = vi.hoisted(() => vi.fn());

const mockToast = vi.hoisted(() => ({
  success: vi.fn(),
  warning: vi.fn(),
  error: vi.fn(),
}));

// ---------------------------------------------------------------------------
// Module mocks
// ---------------------------------------------------------------------------

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => <a href={href}>{children}</a>,
}));

vi.mock('sonner', () => ({ toast: mockToast }));

vi.mock('../../../services/use-onboarding-service', () => ({
  useOnboardingService: () => ({
    useGetCompanyProfile: mockGetCompanyProfile,
    useUpdateCompanyProfile: () => ({
      mutateAsync: mockUpdateCompanyProfile,
      isPending: false,
    }),
    useGetTeams: () => ({ data: [], isPending: false }),
    useCreateTeam: () => ({ mutateAsync: mockCreateTeam, isPending: false }),
    useUpdateTeam: () => ({ mutateAsync: mockUpdateTeam, isPending: false }),
    useDeleteTeam: () => ({ mutateAsync: mockDeleteTeam, isPending: false }),
    useCreateRole: () => ({ mutateAsync: mockCreateRole, isPending: false }),
    useUpdateRole: () => ({ mutateAsync: mockUpdateRole, isPending: false }),
    useDeleteRole: () => ({ mutateAsync: mockDeleteRole, isPending: false }),
    useOnboardEmployees: () => ({
      mutateAsync: mockOnboardEmployees,
      isPending: false,
    }),
    useGetSetupStatus: () => ({ data: null, isPending: false }),
    useSetSetupStatus: () => ({
      mutateAsync: mockSetSetupStatus,
      isPending: false,
    }),
    useGetTeamsWithRoles: () => ({ data: [], isPending: false }),
    useGetRoles: () => ({ data: [], isPending: false }),
    useGetRole: () => ({ data: null, isPending: false }),
  }),
}));

vi.mock('@workspace/ui/context/tour-context', () => ({
  useTour: () => ({ startTour: vi.fn(), stopTour: vi.fn() }),
}));

// FormField must integrate with react-hook-form's FormProvider context
vi.mock('@workspace/ui/lib/inputs/FormFields', async () => {
  const { useController } = await import('react-hook-form');
  return {
    FormField: ({
      name,
      label,
      type = 'text',
      placeholder,
    }: {
      name: string;
      label: string;
      type?: string;
      placeholder?: string;
    }) => {
      const { field } = useController({ name, defaultValue: '' });
      return (
        <>
          <label htmlFor={name}>{label}</label>
          <input id={name} type={type} placeholder={placeholder} {...field} />
        </>
      );
    },
  };
});

vi.mock('@workspace/ui/hooks', () => ({
  useLocationData: () => ({
    countries: [],
    states: [],
    cities: [],
    selectedCountry: '',
    selectedState: '',
    countriesLoading: false,
    statesLoading: false,
    citiesLoading: false,
    handleCountryChange: vi.fn(),
    handleStateChange: vi.fn(),
  }),
}));

vi.mock('@workspace/ui/lib/select-dropdown/combo-box', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComboBox: ({ value, onValueChange, placeholder }: any) => (
    <input
      aria-label={placeholder}
      value={value ?? ''}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
}));

// ---------------------------------------------------------------------------
// MSW server
// Default state: GET /api/v1/companies/current returns fixtureCompanyProfile
// ---------------------------------------------------------------------------

const server = setupServer(...onboardingTestHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
  server.resetHandlers();
  mockGetCompanyProfile.mockReturnValue({ data: null, isPending: false });
  mockPush.mockReset();
  mockUpdateCompanyProfile.mockReset();
  mockCreateTeam.mockReset();
  mockUpdateTeam.mockReset();
  mockDeleteTeam.mockReset();
  mockCreateRole.mockReset();
  mockUpdateRole.mockReset();
  mockDeleteRole.mockReset();
  mockOnboardEmployees.mockReset();
  mockSetSetupStatus.mockReset();
  mockToast.success.mockReset();
  mockToast.warning.mockReset();
  mockToast.error.mockReset();
});
afterAll(() => server.close());

// =========================================================================
// I-01 & I-02 — Company Profile (Step 1 / CompanyProfile component)
// =========================================================================

describe('CompanyProfile (Step 1) — integration', () => {
  let CompanyProfile: React.ComponentType;

  beforeAll(async () => {
    const mod = await import('../../../_components/forms/company-profile');
    CompanyProfile = mod.CompanyProfile;
  });

  function renderCompanyProfile() {
    return render(<CompanyProfile />);
  }

  it('I-01: form pre-fills from GET /companies/current', async () => {
    // Arrange: override the query mock to return fixture company data
    mockGetCompanyProfile.mockReturnValue({
      data: fixtureCompanyProfile,
      isPending: false,
    });

    renderCompanyProfile();

    // The CompanyProfile useEffect calls reset() with the fixture data once
    // companyProfile is truthy.  The name input should reflect the fixture value.
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/company'?s?\s*name/i);
      expect((nameInput as HTMLInputElement).value).toBe(
        fixtureCompanyProfile.name
      );
    });
  });

  it('I-02: submitting Step 1 calls PATCH and navigates to /onboarding/step-2', async () => {
    // mutateAsync signature: (data, { onSuccess?, onError? }) — invoke onSuccess
    // to replicate TanStack Query's callback behaviour inside the component.
    mockUpdateCompanyProfile.mockImplementationOnce(
      async (_data: unknown, options?: { onSuccess?: () => void }) => {
        options?.onSuccess?.();
        return {};
      }
    );

    const user = userEvent.setup();
    renderCompanyProfile();

    // Fill all required fields so the form's isValid flag becomes true.
    await user.type(screen.getByLabelText(/company'?s?\s*name/i), 'Acme Corp');
    await user.type(
      screen.getByLabelText(/address line 1/i),
      '1 Innovation Drive'
    );
    await user.type(screen.getByLabelText(/postal code/i), '100001');

    // ComboBox is mocked as a plain <input>; target via aria-label (= placeholder).
    await user.type(screen.getByLabelText(/select your country/i), 'Nigeria');
    await user.type(screen.getByLabelText(/select state/i), 'Lagos State');
    await user.type(screen.getByLabelText(/select city/i), 'Lagos');

    await user.click(screen.getByRole('button', { name: /continue/i }));

    await waitFor(() => {
      expect(mockUpdateCompanyProfile).toHaveBeenCalledOnce();
      expect(mockPush).toHaveBeenCalledWith('/onboarding/step-2');
    });
  });
});

// =========================================================================
// I-03 to I-07 — Teams & Roles Setup (Step 2)
// =========================================================================

describe('TeamsSetup (Step 2) — integration', () => {
  it.todo('I-03: Step 2 loads teams from API and renders accordions');

  it.todo('I-04: Add team → new accordion appears');

  it.todo('I-05: Delete team (no employees) → accordion removed');

  it.todo('I-06: Delete team with employees → toast error shown');

  it.todo('I-07: Add role to team → role appears in accordion');
});

// =========================================================================
// I-08 to I-11 — Employee Onboarding (Step 3)
// =========================================================================

describe('EmployeeOnboarding (Step 3) — integration', () => {
  it.todo('I-08: Step 3 team dropdown populates from teams data');

  it.todo("I-09: Selecting team filters role dropdown to that team's roles");

  it.todo(
    'I-10: Batch employee invite succeeds → navigates to /admin/dashboard'
  );

  it.todo(
    'I-11: Duplicate email in batch → field error on affected employee email'
  );
});
