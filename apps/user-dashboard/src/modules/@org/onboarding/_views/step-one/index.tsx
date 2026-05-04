'use client';

import { MainButton } from '@workspace/ui/lib/button';
import { useCallback, useEffect } from 'react';

import { CompanyProfile } from '../../_components/forms/company-profile';
import { stepOneTourSteps } from '../../config/tour-steps';
import { routes } from '@/lib/routes/routes';
import { useTour } from '@workspace/ui/context/tour-context';

export const StepOne = () => {
  const { startTour } = useTour();

  const handleStartTour = useCallback(() => {
    startTour(stepOneTourSteps);
  }, [startTour]);

  useEffect(() => {
    handleStartTour();
  }, [handleStartTour]);

  return (
    <section
      className={`flex flex-col lg:items-center justify-between gap-8 lg:flex-row`}
    >
      <section className={`max-w-161.5 flex-1 space-y-10.25`}>
        <div className={`space-y-4`}>
          <p>Step 1 of 3</p>
          <div>
            <div className={`flex items-center gap-2`}>
              <div className={`bg-primary h-2 w-16 rounded-full`} />
              <div className={`h-2 w-16 rounded-full bg-gray-300`} />
              <div className={`h-2 w-16 rounded-full bg-gray-300`} />
            </div>
          </div>
        </div>
        <div className={`space-y-6`}>
          <h1 className={`text-xl lg:text-2xl xl:text-3xl font-semibold`}>
            Tell us a bit about your company to get started
          </h1>
          <p className={`xl:text-lg`}>
            Let&apos;s set the stage for your HR setup. Just a few quick details
            about your company and you&apos;ll be ready to manage your team with
            ease.
          </p>
        </div>
        <div className="flex gap-4">
          <MainButton
            href={routes.onboarding.welcome()}
            variant="primaryOutline"
          >
            Back
          </MainButton>
        </div>
      </section>
      <section className={`flex-1 md:scale-85`}>
        <CompanyProfile />
      </section>
    </section>
  );
};
