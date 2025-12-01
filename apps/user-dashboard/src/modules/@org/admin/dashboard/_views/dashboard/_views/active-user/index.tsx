import React from "react";

import { AttendanceAndRecentActivities } from "../../../../_components/attendanceandactivities";
import { CardSection } from "../../../../_components/card-section";
import { DashboardHeader } from "../../../../_components/dashboard-header";
import { LeaveAndPayroll } from "../../../../_components/leaveandpayroll";

export const ActiveUser: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <CardSection />
      <LeaveAndPayroll />
      <AttendanceAndRecentActivities />
    </div>
  );
};
