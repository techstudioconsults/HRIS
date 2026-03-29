'use client';

import { useState } from 'react';
import { OrganizationOnboardingSectionHeader } from './_components/section-header';
import { OnboardingStepCard } from './_components/onboarding-step-card';
import { OnboardingStepPreview } from './_components/onboarding-step-preview';
import { onboardingSteps } from './constants';

export const OrganizationOnboarding = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = onboardingSteps[activeStepIndex] ?? onboardingSteps[0];

  return (
    <section
      data-home-organization-onboarding
      className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="space-y-12 lg:space-y-16">
          <div className="space-y-5">
            <OrganizationOnboardingSectionHeader />
          </div>

          <div className="relative grid lg:grid-cols-2 lg:items-center">
            <div className="col-span-1 space-y-6 border-l-10 rounded-lg pl-4 h-[400px] border-zinc-300/70">
              {onboardingSteps.map((step, index) => (
                <OnboardingStepCard
                  key={step.index}
                  step={step}
                  isActive={index === activeStepIndex}
                  onSelect={() => setActiveStepIndex(index)}
                />
              ))}
            </div>

            <div className="col-span-1">
              <OnboardingStepPreview
                src={activeStep.previewImageSrc}
                alt={activeStep.previewImageAlt}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
