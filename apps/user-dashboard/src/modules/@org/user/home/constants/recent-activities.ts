import { Activity } from '@/modules/@org/user/home/home-types';

export const RECENT_ACTIVITIES: Activity[] = [
  {
    id: 'activity-1',
    type: 'approved',
    title: 'Leave Request Approved',
    message: 'Your annual leave for Oct 18-21 was approved.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-2',
    type: 'available',
    title: 'Payslip Available',
    message: 'Your September 2025 payslip is now ready to view',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'activity-3',
    type: 'submitted',
    title: 'New Leave Request (Just Submitted)',
    message:
      'You requested Annual Leave (Oct 10 - Oct 13) - awaiting approval.',
    timestamp: '2025-09-22T09:00:00.000Z',
  },
  {
    id: 'activity-4',
    type: 'rejected',
    title: 'Leave Rejected',
    message: 'Your Casual Leave (Oct 2 - Oct 3) was rejected.',
    timestamp: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
];
