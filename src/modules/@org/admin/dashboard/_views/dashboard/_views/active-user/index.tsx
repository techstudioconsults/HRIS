import { PageSection, PageWrapper } from "@/lib/animation";
import React from "react";

import { AttendanceAndRecentActivities } from "../../../../_components/attendanceandactivities";
import { CardSection } from "../../../../_components/card-section";
import { DashboardHeader } from "../../../../_components/dashboard-header";
import { LeaveAndPayroll } from "../../../../_components/leaveandpayroll";

export const ActiveUser: React.FC = () => {
  return (
    <PageWrapper className="space-y-6">
      <PageSection index={0}>
        <DashboardHeader />
      </PageSection>
      <PageSection index={1}>
        <CardSection />
      </PageSection>
      <PageSection index={2}>
        <LeaveAndPayroll />
      </PageSection>
      <PageSection index={3}>
        <AttendanceAndRecentActivities />
      </PageSection>
    </PageWrapper>
  );
};
