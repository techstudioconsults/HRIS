'use client';

import { DashboardBanner } from '../../../../admin/dashboard/_components/home-banner';
import { OnboardingHeader } from './onboarding-header';
import { useSession } from 'next-auth/react';
import { QuickActionCard } from '@/modules/@org/user/home/_components/quick-action-card';
import { cn } from '@workspace/ui/lib/utils';

interface OnboardingProperties {
  steps: OnboardingStep[];
}

export const Onboarding = ({ steps }: OnboardingProperties) => {
  const completedSteps = steps.filter((step) => step.isCompleted).length || 4;
  const { data: session } = useSession();
  return (
    <div>
      <DashboardBanner
        img={`/images/dashboard/man.svg`}
        title={`Welcome, ${session?.user.employee.fullName}`}
        desc="Complete your company profile to unlock the full experience and get started with your HR setup."
      />
      <div className="my-10">
        <OnboardingHeader
          completedSteps={completedSteps}
          totalSteps={steps.length}
        />
      </div>
      <div className="space-y-8">
        {steps.map((step) => (
          <QuickActionCard
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
