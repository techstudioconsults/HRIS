'use client';

import { OrganizationOnboardingSectionHeader } from './_components/section-header';
import { OnboardingStepCard } from './_components/onboarding-step-card';
import { onboardingSteps } from './constants';
import dynamic from 'next/dynamic';
import { SuspenseLoading } from '@workspace/ui/lib';

const OnboardingPreview = dynamic(
  () =>
    import('./_components/onboarding-preview').then(
      (module) => module.OnboardingPreview
    ),
  {
    ssr: false,
    loading: () => <SuspenseLoading />,
  }
);

export const OrganizationOnboarding = () => {
  return (
    <section
      data-home-organization-onboarding
      className="px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1270px]">
        <div className="space-y-12 lg:space-y-16">
          <div className="space-y-5">
            <OrganizationOnboardingSectionHeader />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[1fr_1.07fr] lg:items-start lg:gap-9">
            <div className="space-y-6 border-l border-zinc-300/70">
              {onboardingSteps.map((step, index) => (
                <OnboardingStepCard
                  key={step.index}
                  step={step}
                  isActive={index === 0}
                />
              ))}
            </div>

            <div className="relative">
              <OnboardingPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
