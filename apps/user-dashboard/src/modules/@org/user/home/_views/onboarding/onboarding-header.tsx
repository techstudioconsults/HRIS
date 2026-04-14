'use client';

import { ProgressBar } from '../../../../_components/progress-bar';

interface OnboardingHeaderProperties {
  completedSteps: number;
  totalSteps: number;
}

export const OnboardingHeader = ({
  completedSteps,
  totalSteps,
}: OnboardingHeaderProperties) => {
  return (
    <section className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col">
        <h5 className="text-lg font-semibold">Getting Started Checklist</h5>
        <p className={`text-sm`}>Complete the steps to activate your account</p>
      </div>
      <ProgressBar current={completedSteps} total={totalSteps} />
    </section>
  );
};
