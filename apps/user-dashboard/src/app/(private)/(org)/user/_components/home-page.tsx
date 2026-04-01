'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { WelcomeWidget } from './welcome-widget';
import { QuickActionCard } from './quick-action-card';
import { RecentActivities } from './recent-activities';
import { Activity } from './home-types';

// Mock activities - replace with API call if needed
const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'approved',
    title: 'Leave Request Approved',
    message: 'Your annual leave for Oct 18–21 was approved 🎉',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: '2',
    type: 'available',
    title: 'Payslip Available',
    message: 'Your September 2025 payslip is now ready to view 💵',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '3',
    type: 'submitted',
    title: 'New Leave Request (Just Submitted)',
    message:
      'You requested Annual Leave (Oct 10 – Oct 13) — awaiting approval.',
    timestamp: new Date('2025-09-22'),
  },
  {
    id: '4',
    type: 'rejected',
    title: 'Leave Rejected',
    message: 'Your Casual Leave (Oct 2 – Oct 3) was rejected.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
];

export const HomePage: React.FC = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'User';

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Widget */}
      <WelcomeWidget userName={userName} />

      {/* Quick Action Cards - 3 columns as per design */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[14.6px]">
        <QuickActionCard
          icon={({ className }) => (
            <Icon name="Calendar" size={24} className={className} />
          )}
          title="Request Leave"
          description="Submit a new leave request"
          bgColor="bg-[#E6F0FE]"
          borderColor="border-primary"
          iconColor="text-primary"
          href="/user/leave"
        />
        <QuickActionCard
          icon={({ className }) => (
            <Icon name="FileText" size={24} className={className} />
          )}
          title="View Payslip"
          description="Access your payslip history"
          bgColor="bg-[#E7F5EC]"
          borderColor="border-[#0F973D]"
          iconColor="text-success"
          href="/user/payslip"
        />
        <QuickActionCard
          icon={({ className }) => (
            <Icon name="Clock" size={24} className={className} />
          )}
          title="Attendance"
          description="Clock in and clock out"
          bgColor="bg-[#F8ECE9]"
          borderColor="border-[#EB7047]"
          iconColor="text-danger"
          href="/user/attendance"
        />
      </div>

      {/* Recent Activities */}
      <RecentActivities activities={MOCK_ACTIVITIES} />
    </div>
  );
};
