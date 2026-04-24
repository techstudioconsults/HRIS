import { describe, it } from 'vitest';
import '@testing-library/jest-dom';
// import { setupServer } from 'msw/node';
// import { leaveHandlers } from '../fixtures/handlers';
// import { LeaveAdminPage } from '@/modules/@org/admin/leave/_views/leave-admin-page';

// const server = setupServer(...leaveHandlers);
// beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
// afterEach(() => server.resetHandlers());
// afterAll(() => server.close());

describe('Leave — Integration Tests', () => {
  describe('Leave Request Table', () => {
    it.todo('should fetch and display leave requests on mount');
    it.todo('should show skeleton rows while the requests are loading');
    it.todo('should show an error banner when the API returns 500');
    it.todo(
      'should refetch data when the retry button is clicked after an error'
    );
    it.todo(
      'should update the table when the status filter changes to "approved"'
    );
    it.todo(
      'should display the empty state when the filtered result is an empty array'
    );
    it.todo('should navigate to page 2 when the next page button is clicked');
  });

  describe('Leave Request Approval', () => {
    it.todo(
      'should open the detail drawer when a pending request row is clicked'
    );
    it.todo('should show the employee leave balance in the detail drawer');
    it.todo(
      'should update the row status badge to approved after clicking approve'
    );
    it.todo('should close the drawer after a successful approval');
    it.todo('should show an error toast if the approve API call returns 409');
  });

  describe('Leave Request Decline', () => {
    it.todo(
      'should show a required validation error if the decline reason is empty'
    );
    it.todo(
      'should show a validation error if the decline reason is fewer than 10 characters'
    );
    it.todo(
      'should submit the decline with reason and update the row status to declined'
    );
    it.todo('should show an error toast if the decline API call fails');
  });

  describe('Leave Type Management', () => {
    it.todo('should render a card for each leave type returned by the API');
    it.todo(
      'should open the create leave type drawer when the add button is clicked'
    );
    it.todo(
      'should save a new leave type and add its card to the list on success'
    );
    it.todo('should pre-populate the form when editing an existing leave type');
    it.todo('should remove the leave type card after archiving');
  });

  describe('First-Run Setup Wizard', () => {
    it.todo(
      'should render the wizard when the organisation has no leave types configured'
    );
    it.todo(
      'should advance to the policy step after adding at least one leave type'
    );
    it.todo('should display a review summary before final submission');
    it.todo(
      'should dismiss the wizard and show the dashboard after successful submission'
    );
    it.todo(
      'should not render the wizard when leave types are already configured'
    );
  });
});
