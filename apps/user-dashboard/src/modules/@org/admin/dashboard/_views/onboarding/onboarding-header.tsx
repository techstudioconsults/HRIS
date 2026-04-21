'use client';

import { OnboardingHeaderProperties } from '@/modules/@org/admin/dashboard/types';
import { ProgressBar } from '@/modules/@org/_components/progress-bar';

export const OnboardingHeader = ({
  completedSteps,
  totalSteps,
}: OnboardingHeaderProperties) => {
  return (
    <section className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        <h5 className="text-lg font-semibold">Getting Started Checklist</h5>
        <p className={`text-sm`}>
          Complete these key steps to set up your company and get started
          quickly
        </p>
      </div>
      <ProgressBar current={completedSteps} total={totalSteps} />
    </section>
  );
};
