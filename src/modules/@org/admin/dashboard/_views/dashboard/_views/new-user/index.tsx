"use client";

import onboardingImage from "~/images/dashboard/banner_illustration.svg";
import { ActionBanner } from "../../_components/action-banner";
import { DashboardBanner } from "../../_components/home-banner";
import { AttendanceAndRecentActivities } from "../../../../_components/attendanceandactivities";
import { CardSection } from "../../../../_components/card-section";
import { LeaveAndPayroll } from "../../../../_components/leaveandpayroll";
import { OnboardingHeader } from "../onboarding/onboarding-header";

interface NewUserProperties {
  steps: OnboardingStep[];
  completedSteps: number;
}

export const NewUser = ({ steps, completedSteps }: NewUserProperties) => {
  const nextStep = steps.find((step) => !step.isCompleted);

  return (
    <section className="space-y-10">
      <section className="step-1 flex flex-col gap-4 lg:flex-row">
        <DashboardBanner
          img={onboardingImage.src}
          title="Welcome, Tosin"
          desc="Complete your company profile to unlock the full experience and get started with your HR setup."
        />
        <div className="flex flex-col justify-center gap-4">
          <OnboardingHeader completedSteps={completedSteps} totalSteps={steps.length} />
          {nextStep && (
            <ActionBanner
              title={nextStep.title}
              description={nextStep.description}
              button={{
                label: nextStep.buttonLabel,
                onClick: nextStep.action,
              }}
              icon={nextStep.icon}
              isCompleted={nextStep.isCompleted}
            />
          )}
        </div>
      </section>

      <section>
        <CardSection />
        <LeaveAndPayroll />
        <AttendanceAndRecentActivities />
      </section>
    </section>
  );
};
