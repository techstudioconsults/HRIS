'use client';

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { onboardingSteps } from '../constants';
import { OnboardingStepCard } from '../_components/onboarding-step-card';
import dynamic from 'next/dynamic';
import { SuspenseLoading } from '@workspace/ui/lib';
const OnboardingStepPreview = dynamic(
  () =>
    import('../_components/onboarding-step-preview').then(
      (module) => module.OnboardingStepPreview
    ),
  {
    ssr: false,
    loading: () => <SuspenseLoading />,
  }
);

const STEP_AUTO_ADVANCE_INTERVAL_MS = 3000;

export const OnboardingStepper = () => {
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
    <div className="relative grid lg:grid-cols-2 lg:items-center gap-10">
      <div className="col-span-1 stepper-track" style={stepperStyle}>
        <div
          ref={stepListReference}
          className="gap-2 lg:gap-5 flex flex-col justify-between"
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
  );
};
