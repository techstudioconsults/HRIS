import { describe, it, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
// import type { Activity, SetupTask } from '@/modules/@org/user/home/types';

describe('Home — Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('TODO: rendering — ActiveUserView', () => {
    it.todo('should render the active-user view without errors');
    it.todo(
      'should display the authenticated employee first name in the welcome header'
    );
    it.todo('should render three quick-action cards');
    it.todo('should render the recent activities feed');
    it.todo('should show loading skeleton while activities are being fetched');
  });

  describe('TODO: rendering — OnboardingView', () => {
    it.todo(
      'should render the onboarding view when userSetupComplete is false'
    );
    it.todo(
      'should display onboarding header with correct completed/total steps'
    );
    it.todo('should render all four setup tasks');
    it.todo('should disable the button for locked setup tasks');
    it.todo('should mark completed tasks with a completed visual indicator');
  });

  describe('TODO: view switching — HomePage', () => {
    it.todo('should render ActiveUserView when userSetupComplete is true');
    it.todo('should render OnboardingView when userSetupComplete is false');
    it.todo(
      'should default to OnboardingView when userSetupComplete is undefined'
    );
  });

  describe('TODO: ActivityItem', () => {
    it.todo('should render correct icon for "approved" activity type');
    it.todo('should render correct icon for "rejected" activity type');
    it.todo('should render correct icon for "available" activity type');
    it.todo('should render correct icon for "submitted" activity type');
    it.todo('should render the activity message and timestamp');
  });

  describe('TODO: QuickActionCard', () => {
    it.todo('should render title, description, and button');
    it.todo('should call onClick when button is clicked');
    it.todo('should navigate to the correct href');
  });
});
