/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { MainButton } from '@workspace/ui/lib/button';
import { useCallback, useEffect } from 'react';

import { EmployeeSetupForm } from '../../_components/forms/employee/employee-setup';
import { stepThreeTourSteps } from '../../config/tour-steps';
import { useTour } from '@workspace/ui/context/tour-context';

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
    <section
      className={`flex flex-col lg:items-center justify-between gap-8 lg:flex-row`}
    >
      <section className={`max-w-[646px] flex-1 space-y-[41px]`}>
        <div className={`space-y-4`}>
          <p>Step 3 of 3</p>
          <div>
            <div className={`flex items-center gap-2`}>
              <div className={`bg-primary h-2 w-16 rounded-full`} />
              <div className={`bg-primary h-2 w-16 rounded-full`} />
              <div className={`bg-primary h-2 w-16 rounded-full`} />
            </div>
          </div>
        </div>
        <div className={`space-y-6`}>
          <h1 className={`text-xl lg:text-2xl xl:text-3xl font-semibold`}>
            Bring your team onboard
          </h1>
          <p className={`xl:text-lg`}>
            Start with suggested departments and tailor them to fit your
            organization. Add custom roles under each department and control
            what they can access.
          </p>
        </div>
        <div className="flex gap-4">
          <MainButton href="/onboarding/step-2" variant="primaryOutline">
            Back
          </MainButton>
        </div>
      </section>
      <section className={`flex-1 md:scale-85`}>
        <EmployeeSetupForm />
      </section>
    </section>
  );
};
// No HOC dependency injection; hooks are used inside forms directly.
