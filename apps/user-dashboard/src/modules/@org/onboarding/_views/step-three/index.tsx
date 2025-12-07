/* eslint-disable @typescript-eslint/no-explicit-any */
import { PageSection, PageWrapper } from "@/lib/animation";
import { MainButton } from "@workspace/ui/lib/button";
import { useCallback, useEffect } from "react";

import { EmployeeSetupForm } from "../../_components/forms/employee/employee-setup";
import { stepThreeTourSteps } from "../../config/tour-steps";
import { useTour } from "../../context/tour-context";

// Enhanced Employee type with teamId and roleId
export interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  teamId: string;
  roleId: string;
  permissions?: any[];
}

export interface OnboardEmployeesPayload {
  employees: Employee[];
}

export const EmployeeSetup = () => {
  const { startTour } = useTour();

  const handleStartTour = useCallback(() => {
    startTour(stepThreeTourSteps);
  }, [startTour]);

  useEffect(() => {
    handleStartTour();
  }, [handleStartTour]);

  return (
    <PageWrapper className={`flex flex-col items-center justify-between gap-8 lg:flex-row`}>
      <section className={`max-w-[646px] flex-1 space-y-[41px]`}>
        <PageSection index={0} className={`space-y-4`}>
          <p>Step 3 of 3</p>
          <div>
            <div className={`flex items-center gap-2`}>
              <div className={`bg-primary h-2 w-16 rounded-full`} />
              <div className={`bg-primary h-2 w-16 rounded-full`} />
              <div className={`bg-primary h-2 w-16 rounded-full`} />
            </div>
          </div>
        </PageSection>
        <PageSection index={1} className={`space-y-[24px]`}>
          <h1 className={`text-3xl font-semibold`}>Bring your team onboard</h1>
          <p className={`text-lg`}>
            Start with suggested departments and tailor them to fit your organization. Add custom roles under each
            department and control what they can access.
          </p>
        </PageSection>
        <PageSection index={2} className="flex gap-4">
          <MainButton href="/onboarding/step-2" variant="outline">
            Back
          </MainButton>
        </PageSection>
      </section>
      <section className={`flex-1 md:scale-85`}>
        <EmployeeSetupForm />
      </section>
    </PageWrapper>
  );
};
// No HOC dependency injection; hooks are used inside forms directly.
