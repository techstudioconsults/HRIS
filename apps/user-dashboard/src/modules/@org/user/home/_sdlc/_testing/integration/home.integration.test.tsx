import { describe, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';

describe('Home — Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TODO: full page render — active-user', () => {
    it.todo(
      'should render the full active-user dashboard with mocked session and MSW handlers'
    );
    it.todo('should display employee name from mocked session');
    it.todo(
      'should render all activity items from the mocked activities API response'
    );
    it.todo('should render three quick-action cards with correct titles');
  });

  describe('TODO: full page render — onboarding', () => {
    it.todo(
      'should render the onboarding dashboard when session has userSetupComplete false'
    );
    it.todo(
      'should display the correct completed/total step count in the onboarding header'
    );
    it.todo('should render setup tasks with correct statuses from mocked data');
  });

  describe('TODO: error scenarios', () => {
    it.todo(
      'should show empty activity feed gracefully when activities API returns 500'
    );
    it.todo(
      'should not crash the dashboard when activities API is unavailable'
    );
    it.todo('should redirect to /auth/login when session is missing');
  });
});
