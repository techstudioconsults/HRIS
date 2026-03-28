import type { OnboardingStepItem } from '../constants';

interface OnboardingStepCardProperties {
  step: OnboardingStepItem;
  isActive?: boolean;
}

export const OnboardingStepCard = ({
  step,
  isActive = false,
}: OnboardingStepCardProperties) => {
  return (
    <article className="relative">
      <div className="flex flex-col gap-2 py-1">
        <h3
          className={
            isActive
              ? 'text-[30px] font-semibold leading-tight tracking-[-0.02em] text-zinc-900 lg:text-[34px]'
              : 'text-[24px] font-medium leading-tight tracking-[-0.01em] text-zinc-600 lg:text-[30px]'
          }
        >
          {step.title}
        </h3>
        {step.description ? (
          <p className="max-w-[320px] text-[16px] leading-normal tracking-[-0.02em] text-zinc-500 lg:text-[18px]">
            {step.description}
          </p>
        ) : null}
      </div>
    </article>
  );
};
