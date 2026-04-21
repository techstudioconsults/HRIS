'use client';

import { cn } from '@workspace/ui/lib/utils';

import { ActionBanner } from '../../_components/action-banner';
import { DashboardBanner } from '../../_components/home-banner';
import { OnboardingHeader } from './onboarding-header';
import { useSession } from 'next-auth/react';
import type { OnboardingProperties } from '../../types';

export const Onboarding = ({ steps }: OnboardingProperties) => {
  const completedSteps = steps.filter((step) => step.isCompleted).length || 4;
  const { data: session } = useSession();
  return (
    <div>
      <DashboardBanner
        img={`/images/dashboard/woman.svg`}
        title={`Welcome, ${session?.user.employee.fullName}`}
        desc="Complete your company profile to unlock the full experience and get started with your HR setup."
      />
      <div className="my-4">
        <OnboardingHeader
          completedSteps={completedSteps}
          totalSteps={steps.length}
        />
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
            className={cn(step.isCompleted && 'hidden')}
          />
        ))}
      </div>
    </div>
  );
};
