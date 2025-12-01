"use client";

import { cn } from "@workspace/ui/lib/utils";

import onboardingImage from "~/images/dashboard/banner_illustration.svg";
import { ActionBanner } from "../../_components/action-banner";
import { DashboardBanner } from "../../_components/home-banner";
import { OnboardingHeader } from "./onboarding-header";

interface OnboardingProperties {
  steps: OnboardingStep[];
}

export const Onboarding = ({ steps }: OnboardingProperties) => {
  const completedSteps = steps.filter((step) => step.isCompleted).length || 4;

  return (
    <div>
      <DashboardBanner
        img={onboardingImage.src}
        title="Welcome, Tosin"
        desc="Complete your company profile to unlock the full experience and get started with your HR setup."
      />
      <div className="my-4">
        <OnboardingHeader completedSteps={completedSteps} totalSteps={steps.length} />
      </div>
      <div className="flex flex-col gap-4">
        {steps.map((step) => (
          <ActionBanner
            key={step.title}
            title={step.title}
            description={step.description}
            button={{
              label: step.buttonLabel,
              onClick: step.action,
            }}
            icon={step.icon}
            isCompleted={step.isCompleted}
            className={cn(step.isCompleted && "hidden")}
          />
        ))}
      </div>
    </div>
  );
};
