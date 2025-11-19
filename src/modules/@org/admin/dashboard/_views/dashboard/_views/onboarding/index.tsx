"use client";

import { PageSection, PageWrapper } from "@/lib/animation";
import { cn } from "@/lib/utils";

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
    <PageWrapper>
      <PageSection index={0}>
        <DashboardBanner
          img={onboardingImage.src}
          title="Welcome, Tosin"
          desc="Complete your company profile to unlock the full experience and get started with your HR setup."
        />
      </PageSection>
      <PageSection index={1} className={`my-4`}>
        <OnboardingHeader completedSteps={completedSteps} totalSteps={steps.length} />
      </PageSection>
      <PageSection index={2} className="flex flex-col gap-4">
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
      </PageSection>
    </PageWrapper>
  );
};
