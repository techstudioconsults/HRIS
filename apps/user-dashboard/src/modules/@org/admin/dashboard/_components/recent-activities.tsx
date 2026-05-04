'use client';

import { Card } from '@workspace/ui/components/card';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { useAppService } from '@/services/app/use-app-service';
import { useSession } from '@/lib/session';
import { formatDateTime } from '@/lib/formatters';
import type { NotificationType } from '@workspace/ui/lib/notification-widget';

const MAX_VISIBLE_ACTIVITIES = 10;

function resolveActivityIcon(
  notificationType: NotificationType,
  title: string
) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('leave')) {
    return <Icon name="Calendar" size={20} className="text-primary" />;
  }
  if (lowerTitle.includes('payroll') || lowerTitle.includes('salary')) {
    return <Icon name="CardReceive" size={20} className="text-success" />;
  }
  if (lowerTitle.includes('attendance')) {
    return <Icon name="Clock" size={20} className="text-info" />;
  }
  if (notificationType === 'error') {
    return <Icon name="CloseCircle" size={20} className="text-danger" />;
  }
  if (notificationType === 'success') {
    return <Icon name="CheckCircle" size={20} className="text-success" />;
  }
  return (
    <Icon name="MessageNotif" size={20} className="text-muted-foreground" />
  );
}

export function RecentActivities() {
  const { data: session } = useSession();
  const employeeId = session?.user.employee.id;

  const { useGetNotifications } = useAppService();
  const { data: notifications = [], isPending } =
    useGetNotifications(employeeId);

  const visibleNotifications = notifications.slice(0, MAX_VISIBLE_ACTIVITIES);

  return (
    <Card className="w-full">
      <div className="border-b p-6 py-0">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
      </div>

      <div className="divide-y px-6">
        {isPending ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-start gap-3 py-3">
              <Skeleton className="mt-1 size-5 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))
        ) : visibleNotifications.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-muted-foreground text-sm">
              No recent activities
            </p>
          </div>
        ) : (
          visibleNotifications.map((notification) => (
            <div
              key={notification.id}
              className="hover:bg-muted/50 flex items-start gap-3 border-0 py-3 transition-colors"
            >
              <div className="mt-1 shrink-0">
                {resolveActivityIcon(notification.type, notification.title)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-muted-foreground text-xs">
                  {formatDateTime(notification.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
