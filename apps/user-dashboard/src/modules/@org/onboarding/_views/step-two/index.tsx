import { PageSection, PageWrapper } from "@/lib/animation";
import { MainButton } from "@workspace/ui/lib/button";
import { useCallback, useEffect } from "react";

import { TeamSetupForm } from "../../_components/forms/team-setup";
import { stepTwoTourSteps } from "../../config/tour-steps";
import { useTour } from "../../context/tour-context";

export const TeamSetupPage = () => {
  const { startTour } = useTour();

  const handleStartTour = useCallback(() => {
    startTour(stepTwoTourSteps);
  }, [startTour]);

  useEffect(() => {
    handleStartTour();
  }, [handleStartTour]);

  return (
    <PageWrapper className="flex flex-col items-center justify-between gap-8 lg:flex-row">
      <section className="max-w-[646px] flex-1 space-y-[41px]">
        <PageSection index={0} className="space-y-4">
          <p>Step 2 of 3</p>
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-primary h-2 w-16 rounded-full" />
              <div className="bg-primary h-2 w-16 rounded-full" />
              <div className="h-2 w-16 rounded-full bg-gray-300" />
            </div>
          </div>
        </PageSection>
        <PageSection index={1} className="space-y-[24px]">
          <h1 className="text-3xl font-semibold">Structure your team with the right access</h1>
          <p className="text-lg">
            Start with suggested departments and tailor them to fit your organization. Add custom roles under each
            department and control what they can access.
          </p>
        </PageSection>
        <PageSection index={2} className="flex gap-4">
          <MainButton href="/onboarding/step-1" variant="primaryOutline">
            Back
          </MainButton>
        </PageSection>
      </section>
      <section className="flex-1 md:scale-85">
        <TeamSetupForm />
      </section>
    </PageWrapper>
  );
};
