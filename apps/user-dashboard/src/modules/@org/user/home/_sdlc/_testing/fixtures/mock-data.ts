import type { Activity } from '@/modules/@org/user/home/types';

export const fixtureActivities: Activity[] = [
  {
    id: 'activity-fixture-1',
    type: 'approved',
    title: 'Leave Request Approved',
    message: 'Your annual leave for Oct 18-21 was approved.',
    timestamp: '2025-10-18T08:00:00.000Z',
  },
  {
    id: 'activity-fixture-2',
    type: 'available',
    title: 'Payslip Available',
    message: 'Your September 2025 payslip is now ready to view.',
    timestamp: '2025-09-30T10:00:00.000Z',
  },
  {
    id: 'activity-fixture-3',
    type: 'submitted',
    title: 'Leave Request Submitted',
    message: 'You requested Annual Leave (Oct 10-13) — awaiting approval.',
    timestamp: '2025-09-22T09:00:00.000Z',
  },
  {
    id: 'activity-fixture-4',
    type: 'rejected',
    title: 'Leave Rejected',
    message: 'Your Casual Leave (Oct 2-3) was rejected.',
    timestamp: '2025-10-03T14:00:00.000Z',
  },
];

export const fixtureEmployeeProfile = {
  id: 'emp-fixture-001',
  firstName: 'Jane',
  lastName: 'Doe',
  userSetupComplete: true,
};

export const fixtureNewEmployeeProfile = {
  id: 'emp-fixture-002',
  firstName: 'John',
  lastName: 'Smith',
  userSetupComplete: false,
};
