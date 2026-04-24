import React from 'react';
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { setupServer } from 'msw/node';
import { http, HttpResponse, delay } from 'msw';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { teamHandlers } from '../fixtures/handlers';
import { mockTeams } from '../fixtures/mock-data';

const server = setupServer(...teamHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const BASE = '/api/v1';

function wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

// ─── Stub components ──────────────────────────────────────────────────────────

function TeamsListStub() {
  const [teams, setTeams] = React.useState<{ id: string; name: string }[]>([]);
  const [empty, setEmpty] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/v1/teams')
      .then((r) => r.json())
      .then((j: { data: { id: string; name: string }[] }) => {
        if (j.data.length === 0) setEmpty(true);
        else setTeams(j.data);
      });
  }, []);

  if (empty) return <p data-testid="empty-state">No teams found</p>;
  return (
    <ul>
      {teams.map((t) => (
        <li key={t.id} data-testid="team-row">
          {t.name}
        </li>
      ))}
    </ul>
  );
}

function CreateTeamStub() {
  const [created, setCreated] = React.useState('');
  const [nameError, setNameError] = React.useState('');

  async function submit() {
    const fd = new FormData();
    fd.append('name', 'New Team');
    fd.append('description', 'A brand new team for testing');
    const res = await fetch('/api/v1/Teams', { method: 'POST', body: fd });
    if (res.ok) {
      const body = (await res.json()) as { data: { id: string } };
      setCreated(body.data.id);
    }
  }

  async function submitDuplicate() {
    const fd = new FormData();
    fd.append('name', 'Engineering');
    fd.append('description', 'Duplicate team name test');
    const res = await fetch('/api/v1/Teams', { method: 'POST', body: fd });
    if (res.status === 409) {
      const body = (await res.json()) as { code: string };
      setNameError(body.code);
    }
  }

  return (
    <div>
      <button onClick={submit}>Create Team</button>
      <button onClick={submitDuplicate}>Create Duplicate</button>
      {created && <p data-testid="created-id">{created}</p>}
      {nameError && <p data-testid="name-error">{nameError}</p>}
    </div>
  );
}

function DeleteTeamStub({
  teamId,
  hasMember,
}: {
  teamId: string;
  hasMember: boolean;
}) {
  const [deleted, setDeleted] = React.useState(false);
  const [error, setError] = React.useState('');

  async function doDelete() {
    const res = await fetch(`/api/v1/teams/${teamId}`, { method: 'DELETE' });
    if (res.ok) setDeleted(true);
    else {
      const body = (await res.json()) as { code: string };
      setError(body.code);
    }
  }

  if (hasMember) {
    // Override handler inline
  }

  return (
    <div>
      <button onClick={doDelete}>Delete</button>
      {deleted && <p data-testid="deleted">deleted</p>}
      {error && <p data-testid="delete-error">{error}</p>}
    </div>
  );
}

function AssignEmployeeStub({ teamId }: { teamId: string }) {
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  async function assign(employeeId: string) {
    const res = await fetch(`/api/v1/teams/${teamId}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, roleId: 'role_01' }),
    });
    if (res.ok) setSuccess(true);
    else {
      const body = (await res.json()) as { code: string };
      setError(body.code);
    }
  }

  return (
    <div>
      <button onClick={() => assign('emp_new')}>Assign New Employee</button>
      <button onClick={() => assign('emp_01')}>Assign Duplicate</button>
      {success && <p data-testid="assign-success">success</p>}
      {error && <p data-testid="assign-error">{error}</p>}
    </div>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Teams list', () => {
  it('loads and renders team rows', async () => {
    render(<TeamsListStub />, { wrapper });
    await waitFor(() =>
      expect(screen.getAllByTestId('team-row')).toHaveLength(mockTeams.length)
    );
  });

  it('shows empty state when no teams returned', async () => {
    server.use(
      http.get(`${BASE}/teams`, async () => {
        await delay(50);
        return HttpResponse.json({
          data: [],
          total: 0,
          page: 1,
          size: 20,
          totalPages: 0,
        });
      })
    );
    render(<TeamsListStub />, { wrapper });
    await waitFor(() =>
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    );
  });
});

describe('Create team', () => {
  it('creates a team and returns new team ID', async () => {
    const user = userEvent.setup();
    render(<CreateTeamStub />, { wrapper });
    await user.click(screen.getByRole('button', { name: /create team/i }));
    await waitFor(() =>
      expect(screen.getByTestId('created-id')).toBeInTheDocument()
    );
  });

  it('shows TEAM_NAME_EXISTS inline error on 409', async () => {
    server.use(
      http.post(`${BASE}/Teams`, async () => {
        await delay(50);
        return HttpResponse.json(
          { code: 'TEAM_NAME_EXISTS', title: 'Name exists', status: 409 },
          { status: 409 }
        );
      })
    );
    const user = userEvent.setup();
    render(<CreateTeamStub />, { wrapper });
    await user.click(screen.getByRole('button', { name: /create duplicate/i }));
    await waitFor(() =>
      expect(screen.getByTestId('name-error')).toHaveTextContent(
        'TEAM_NAME_EXISTS'
      )
    );
  });
});

describe('Delete team', () => {
  it('deletes a team with no members', async () => {
    server.use(
      http.delete(`${BASE}/teams/team_empty`, async () => {
        await delay(50);
        return HttpResponse.json({ success: true });
      })
    );
    const user = userEvent.setup();
    render(<DeleteTeamStub teamId="team_empty" hasMember={false} />, {
      wrapper,
    });
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() =>
      expect(screen.getByTestId('deleted')).toBeInTheDocument()
    );
  });

  it('shows TEAM_HAS_MEMBERS when team has active members', async () => {
    server.use(
      http.delete(`${BASE}/teams/team_01`, async () => {
        await delay(50);
        return HttpResponse.json(
          { code: 'TEAM_HAS_MEMBERS', title: 'Team has members', status: 409 },
          { status: 409 }
        );
      })
    );
    const user = userEvent.setup();
    render(<DeleteTeamStub teamId="team_01" hasMember={true} />, { wrapper });
    await user.click(screen.getByRole('button', { name: /delete/i }));
    await waitFor(() =>
      expect(screen.getByTestId('delete-error')).toHaveTextContent(
        'TEAM_HAS_MEMBERS'
      )
    );
  });
});

describe('Assign employee', () => {
  it('assigns a new employee successfully', async () => {
    const user = userEvent.setup();
    render(<AssignEmployeeStub teamId="team_01" />, { wrapper });
    await user.click(
      screen.getByRole('button', { name: /assign new employee/i })
    );
    await waitFor(() =>
      expect(screen.getByTestId('assign-success')).toBeInTheDocument()
    );
  });

  it('shows MEMBER_ALREADY_EXISTS when employee is already a member', async () => {
    const user = userEvent.setup();
    render(<AssignEmployeeStub teamId="team_01" />, { wrapper });
    await user.click(screen.getByRole('button', { name: /assign duplicate/i }));
    await waitFor(() =>
      expect(screen.getByTestId('assign-error')).toHaveTextContent(
        'MEMBER_ALREADY_EXISTS'
      )
    );
  });
});
