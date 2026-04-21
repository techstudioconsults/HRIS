'use client';

import { Card } from '@workspace/ui/components/card';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { RECENT_ACTIVITIES } from './constants';
import { Activity } from '@/modules/@org/admin/dashboard/types';

export function RecentActivities() {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'leave': {
        return <Icon name="Calendar" size={20} className="text-primary" />;
      }
      case 'payroll': {
        return <Icon name="CardReceive" size={20} className="text-success" />;
      }
      case 'report': {
        return <Icon name="Clock" size={20} className="text-warning" />;
      }
      case 'announcement': {
        return (
          <Icon name="MessageNotif" size={20} className="text-purple-500" />
        );
      }
      case 'attendance': {
        return <Icon name="Clock" size={20} className="text-info" />;
      }
      default: {
        return (
          <Icon name="Clock" size={20} className="text-muted-foreground" />
        );
      }
    }
  };

  return (
    <Card className="w-full ">
      <div className="border-b p-6 py-0">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
      </div>

      <div className="divide-y px-6">
        {RECENT_ACTIVITIES.map((activity) => (
          <div
            key={activity.id}
            className="hover:bg-muted/50 flex items-start gap-3 border-0 py-3 transition-colors"
          >
            <div className="mt-1 shrink-0">
              {getActivityIcon(activity.type)}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{activity.action}</p>
              <p className="text-muted-foreground text-xs">
                {activity.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
