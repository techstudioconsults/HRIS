// Example usage of the TopBar component with the new NotificationWidget and UserMenu

import { Notification } from "@workspace/ui/lib";
import TopBar from ".";

// Sample notification data
const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "New employee onboarded",
    message: "John Doe has been successfully onboarded to the system",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    read: false,
    actionUrl: "/employees/john-doe",
  },
  {
    id: "2",
    title: "Leave request pending",
    message: "Sarah Smith has requested leave from Dec 20-25",
    type: "warning",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionUrl: "/leave-requests/123",
  },
  {
    id: "3",
    title: "System maintenance scheduled",
    message: "System will be down for maintenance on Saturday 2am-4am",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: "4",
    title: "Timesheet approved",
    message: "Your timesheet for last week has been approved",
    type: "success",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
  },
  {
    id: "5",
    title: "Failed payment processing",
    message: "Unable to process payroll for employee ID #4567",
    type: "error",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionUrl: "/payroll/issues",
  },
];

// Example usage in your layout or page:
export function ExampleLayout() {
  return (
    <div>
      <TopBar
        adminName="Kingsley Ifijeh"
        adminEmail="kingsley@example.com"
        adminRole="System Administrator"
        adminAvatar="https://github.com/shadcn.png" // Replace with actual avatar
        notifications={sampleNotifications}
      />
      {/* Rest of your layout */}
    </div>
  );
}

// Without notifications (empty state)
export function ExampleLayoutEmptyNotifications() {
  return (
    <div>
      <TopBar adminName="Jane Smith" adminEmail="jane@example.com" adminRole="HR Manager" notifications={[]} />
      {/* Rest of your layout */}
    </div>
  );
}

// Minimal usage
export function ExampleLayoutMinimal() {
  return (
    <div>
      <TopBar adminName="John Admin" />
      {/* Rest of your layout */}
    </div>
  );
}
