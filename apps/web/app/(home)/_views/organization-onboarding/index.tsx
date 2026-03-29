'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { OrganizationOnboardingSectionHeader } from './_components/section-header';
import { OnboardingStepCard } from './_components/onboarding-step-card';
import { OnboardingStepPreview } from './_components/onboarding-step-preview';
import { onboardingSteps } from './constants';

const STEP_AUTO_ADVANCE_INTERVAL_MS = 2000;

export const OrganizationOnboarding = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });
  const stepListReference = useRef<HTMLDivElement | null>(null);

  const activeStep = onboardingSteps[activeStepIndex] ?? onboardingSteps[0];

  useEffect(() => {
    if (onboardingSteps.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveStepIndex(
        (previousStepIndex) => (previousStepIndex + 1) % onboardingSteps.length
      );
    }, STEP_AUTO_ADVANCE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const activeButton =
        stepListReference.current?.querySelector<HTMLButtonElement>(
          'button[aria-pressed="true"]'
        );
      const activeCard = activeButton?.closest<HTMLElement>('article');
      if (!activeCard) return;

      setIndicator({
        top: activeCard.offsetTop,
        height: activeCard.offsetHeight,
      });
    };

    updateIndicator();

    const resizeObserver = new ResizeObserver(() => {
      updateIndicator();
    });

    if (stepListReference.current) {
      resizeObserver.observe(stepListReference.current);
      const cards =
        stepListReference.current.querySelectorAll<HTMLElement>('article');
      cards.forEach((card) => resizeObserver.observe(card));
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [activeStepIndex]);

  const stepperStyle = {
    '--stepper-indicator-top': `${indicator.top}px`,
    '--stepper-indicator-height': `${indicator.height}px`,
  } as CSSProperties;

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
            <div className="col-span-1 stepper-track" style={stepperStyle}>
              <div
                ref={stepListReference}
                className="h-[400px] flex flex-col justify-between"
              >
                {onboardingSteps.map((step, index) => (
                  <OnboardingStepCard
                    key={step.index}
                    step={step}
                    isActive={index === activeStepIndex}
                    onSelect={() => setActiveStepIndex(index)}
                  />
                ))}
              </div>
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
