"use client";

import { Card } from "@workspace/ui/components/card";
import { Calendar, CardReceive, Clock, MessageNotif } from "iconsax-reactjs";

interface Activity {
  id: string;
  action: string;
  timestamp: string;
  type: "leave" | "payroll" | "report" | "announcement" | "attendance";
}

export function RecentActivities() {
  const activities: Activity[] = [
    {
      id: "1",
      action: "Anyanwu Emmanuella requested annual leave",
      timestamp: "30 minutes ago",
      type: "leave",
    },
    {
      id: "2",
      action: "Payroll for April was processed",
      timestamp: "2 hours ago",
      type: "payroll",
    },
    {
      id: "3",
      action: "Mbachu Charles requested sick leave (2 days)",
      timestamp: "2 days ago",
      type: "leave",
    },
    {
      id: "4",
      action: "Attendance report for April was exported",
      timestamp: "2 days ago",
      type: "report",
    },
  ];
  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "leave": {
        return <Calendar size={20} className="text-primary" />;
      }
      case "payroll": {
        return <CardReceive size={20} className="text-success" />;
      }
      case "report": {
        return <Clock size={20} className="text-warning" />;
      }
      case "announcement": {
        return <MessageNotif size={20} className="text-purple-500" />;
      }
      case "attendance": {
        return <Clock size={20} className="text-info" />;
      }
      default: {
        return <Clock size={20} className="text-muted-foreground" />;
      }
    }
  };

  return (
    <Card className="bg-background w-full rounded-xl">
      <div className="border-b p-4">
        <h3 className="text-lg font-semibold">Recent Activities</h3>
      </div>

      <div className="divide-y">
        {activities.map((activity) => (
          <div key={activity.id} className="hover:bg-muted/50 flex items-start gap-3 border-0 p-3 transition-colors">
            <div className="mt-1 flex-shrink-0">{getActivityIcon(activity.type)}</div>

            <div className="min-w-0 flex-1">
              <p className="font-medium">{activity.action}</p>
              <p className="text-muted-foreground text-sm">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
