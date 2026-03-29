import type { OnboardingStepItem } from '../constants';
import { cn } from '@workspace/ui/lib/utils';

interface OnboardingStepCardProperties {
  step: OnboardingStepItem;
  isActive?: boolean;
  onSelect: () => void;
}

export const OnboardingStepCard = ({
  step,
  isActive = false,
  onSelect,
}: OnboardingStepCardProperties) => {
  return (
    <article className="relative">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={isActive}
        className="w-full rounded-md py-1 text-left outline-none
        transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-zinc-300"
      >
        <div className="flex flex-col gap-2">
          <h3
            className={cn(
              'transition-[color,font-size,letter-spacing] duration-300 ease-out',
              isActive
                ? 'text-[24px] font-semibold leading-tight tracking-[-0.02em] text-zinc-900 lg:text-[28px]'
                : 'text-[18px] font-medium leading-tight tracking-[-0.01em] text-zinc-600 lg:text-[20px]'
            )}
          >
            {step.title}
          </h3>
          <div
            aria-hidden={!isActive}
            className={cn(
              'grid max-w-[520px] overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-out',
              isActive
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[0fr] opacity-0'
            )}
          >
            <p className="overflow-hidden text-sm leading-normal tracking-[-0.02em] text-zinc-500 lg:text-base">
              {step.description}
            </p>
          </div>
        </div>
      </button>
    </article>
  );
};
