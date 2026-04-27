import React from 'react';

import { DashboardBanner } from '@/modules/@org/admin/dashboard/_components/home-banner';
import { useSession } from '@/lib/session';
import { RecentActivities } from '@/modules/@org/user/home/_views/recent-activities';
import { RECENT_ACTIVITIES } from '@/modules/@org/user/home/constants/recent-activities';
import { CardGroup } from '@/modules/@org/_components/card-group';
import { UserDashboardCard } from '@/modules/@org/user/home/_components/user-dashboard-card';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

export const ActiveUser: React.FC = () => {
  const { data: session } = useSession();
  const userName = session?.user.employee.fullName;
  return (
    <Wrapper className="my-0! p-0">
      <DashboardBanner
        img={`/images/dashboard/man.svg`}
        title={`Welcome, ${userName}`}
        desc="Complete your company profile to unlock the full experience and get started with your HR setup."
      />
      <CardGroup className={`grid-cols-1 lg:grid-cols-3!`}>
        <UserDashboardCard
          icon={`Calendar`}
          title={`Request Leave`}
          description={`Submit a new leave request`}
          color={`primary`}
          link={`/user/leave`}
        />
        <UserDashboardCard
          icon={`FileText`}
          title={`View Payslip`}
          description={`Access your payslip history`}
          color={`success`}
          link={`/user/payslip`}
        />
        <UserDashboardCard
          icon={`FileText`}
          title={`Attendance`}
          description={`Clock in and clock out`}
          color={`danger`}
          link={`/user/attendance`}
        />
      </CardGroup>
      <RecentActivities activities={RECENT_ACTIVITIES} />
    </Wrapper>
  );
};
