import { PageSection, PageWrapper } from "@/lib/animation";
import { MainButton } from "@workspace/ui/lib/button";
import { useCallback, useEffect } from "react";

import { CompanyProfile } from "../../_components/forms/company-profile";
import { stepOneTourSteps } from "../../config/tour-steps";
import { useTour } from "../../context/tour-context";

export const StepOne = () => {
  const { startTour } = useTour();

  const handleStartTour = useCallback(() => {
    startTour(stepOneTourSteps);
  }, [startTour]);

  useEffect(() => {
    handleStartTour();
  }, [handleStartTour]);

  return (
    <PageWrapper className={`flex flex-col items-center justify-between gap-8 lg:flex-row`}>
      <section className={`max-w-[646px] flex-1 space-y-[41px]`}>
        <PageSection index={0} className={`space-y-4`}>
          <p>Step 1 of 3</p>
          <div>
            <div className={`flex items-center gap-2`}>
              <div className={`bg-primary h-2 w-16 rounded-full`} />
              <div className={`h-2 w-16 rounded-full bg-gray-300`} />
              <div className={`h-2 w-16 rounded-full bg-gray-300`} />
            </div>
          </div>
        </PageSection>
        <PageSection index={1} className={`space-y-[24px]`}>
          <h1 className={`text-3xl font-semibold`}>Tell us a bit about your company to get started</h1>
          <p className={`text-lg`}>
            Let&apos;s set the stage for your HR setup. Just a few quick details about your company and you&apos;ll be
            ready to manage your team with ease.
          </p>
        </PageSection>
        <PageSection index={2} className="flex gap-4">
          <MainButton href={`/onboarding/welcome`} variant="primaryOutline">
            Back
          </MainButton>
        </PageSection>
      </section>
      <section className={`flex-1 md:scale-85`}>
        <CompanyProfile />
      </section>
    </PageWrapper>
  );
};
