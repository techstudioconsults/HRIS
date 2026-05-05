import React, { useMemo } from 'react';

import { DashboardBanner } from '@/modules/@org/admin/dashboard/_components/home-banner';
import { useSession } from '@/lib/session';
import { RecentActivities } from '@/modules/@org/user/home/_views/recent-activities';
import { CardGroup } from '@/modules/@org/_components/card-group';
import { UserDashboardCard } from '@/modules/@org/user/home/_components/user-dashboard-card';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { useAppService } from '@/services/app/use-app-service';
import type { Notification } from '@workspace/ui/lib/notification-widget';
import type { Activity, ActivityType } from '../../types';

function notificationTypeToActivityType(
  type: Notification['type']
): ActivityType {
  switch (type) {
    case 'success':
      return 'approved';
    case 'error':
      return 'rejected';
    default:
      return 'submitted';
  }
}

function mapNotificationsToActivities(
  notifications: Notification[]
): Activity[] {
  return notifications.map((notification) => ({
    id: notification.id,
    type: notificationTypeToActivityType(notification.type),
    title: notification.title,
    message: notification.message,
    timestamp: notification.timestamp,
  }));
}

export const ActiveUser: React.FC = () => {
  const { data: session } = useSession();
  const userName = session?.user.employee.fullName;
  const employeeId = session?.user.employee.id;

  const { useGetNotifications } = useAppService();
  const { data: notifications, isLoading: isLoadingNotifications } =
    useGetNotifications(employeeId);

  const activities = useMemo(
    () => mapNotificationsToActivities(notifications ?? []),
    [notifications]
  );

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
      <RecentActivities
        activities={activities}
        isLoading={isLoadingNotifications}
      />
    </Wrapper>
  );
};
