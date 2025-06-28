import React from "react";

import { AttendanceAndRecentActivities } from "../../_components/attendanceandactivities";
import { CardSection } from "../../_components/card-section";
import { DashboardHeader } from "../../_components/dashboard-header";
import { LeaveAndPayroll } from "../../_components/leaveandpayroll";

export const Dashboard: React.FC = () => {
  return (
    <>
      <DashboardHeader />
      <CardSection />
      <LeaveAndPayroll />
      <AttendanceAndRecentActivities />
    </>
  );
};
