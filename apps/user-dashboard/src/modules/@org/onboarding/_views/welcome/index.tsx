"use client";

import { PageSection, PageWrapper } from "@/lib/animation";
import TourVideo, { TourSegment } from "@/modules/@org/onboarding/_components/TourVideo";
import { BlurImage } from "@workspace/ui/components/core/miscellaneous/blur-image";
import { updateQueryParamameters } from "@workspace/ui/hooks";
import { ReusableDialog } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { welcomeTourSteps } from "../../config/tour-steps";
import { useTour } from "../../context/tour-context";

export const Welcome = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { startTour, stopTour } = useTour();

  // Define tour segments (timestamps must match actual video length)
  const tourSegments: TourSegment[] = [
    { id: "intro", title: "Introduction", time: 0, description: "Welcome and high-level platform overview." },
    { id: "dashboard", title: "Dashboard", time: 2, description: "Navigating the main dashboard widgets." },
    { id: "employees", title: "Employees", time: 4, description: "Managing employee records and profiles." },
    { id: "payroll", title: "Payroll", time: 6, description: "Running payroll and reviewing summaries." },
    { id: "reports", title: "Reports", time: 8, description: "Generating and exporting reports." },
    { id: "wrap", title: "Wrap Up", time: 10, description: "Next steps and further resources." },
  ];

  const transcriptLines = [
    "Welcome to TechstudioHR, your streamlined HR management suite.",
    "In this tour we'll highlight the main dashboard and quick actions.",
    "Learn how to add and manage employees effortlessly.",
    "Process payroll with confidence and real-time validation.",
    "Generate insightful reports to drive decision making.",
    "Thank you for watching. You're ready to begin onboarding steps!",
  ];

  // Initialize dialog state from URL
  useEffect(() => {
    const modalState = searchParameters.get("modal");
    setDialogOpen(modalState === "tour");
  }, [searchParameters]);

  const handleOpenTeamDialog = () => {
    stopTour();
    updateQueryParamameters(router, pathname, searchParameters, { modal: "tour" });
  };

  const handleCloseDialog = () => {
    stopTour();
    updateQueryParamameters(router, pathname, searchParameters, { modal: null });
  };

  const handleStartTour = useCallback(() => {
    startTour(welcomeTourSteps);
  }, [startTour]);

  useEffect(() => {
    handleStartTour();
  }, [handleStartTour]);

  return (
    <PageWrapper>
      <section className={`flex flex-col-reverse items-center justify-between gap-8 lg:flex-row`}>
        <section className={`max-w-[646px]`}>
          <PageSection index={1} className={`space-y-[24px]`} data-tour="welcome-heading">
            <h1 className={`text-4xl font-semibold`}>Welcome to TechstudioHR,</h1>
            <p className={`text-lg`}>
              Let&apos;s help you get started. You can take a quick tour to understand how Techstudio HR works or you
              can jump straight in and begin set up.
            </p>
          </PageSection>
          <PageSection index={1} className={`mt-[36px] flex flex-col gap-[28px] lg:flex-row`}>
            <div data-tour="take-tour-button">
              <MainButton onClick={handleOpenTeamDialog} className={`w-full lg:w-fit`} variant={`primary`}>
                Take a Quick Tour
              </MainButton>
            </div>
            <div data-tour="skip-tour-button">
              <MainButton href={`/onboarding/step-1`} className={`w-full lg:w-fit`} variant={`primaryOutline`}>
                Skip Tour & Continue
              </MainButton>
            </div>
          </PageSection>
        </section>

        <BlurImage
          width={500}
          height={561}
          src={"/images/onboarding/deal.svg"}
          alt={"onboarding"}
          className={`max-h-[561px] w-[500px] rounded-2xl bg-gray-50 object-cover shadow`}
        />
      </section>
      <ReusableDialog
        trigger={null}
        open={dialogOpen}
        className={`!max-w-5xl`}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) handleCloseDialog();
        }}
      >
        <TourVideo
          src="/video/trees.mp4"
          poster="/images/onboarding/video-poster.png"
          segments={tourSegments}
          transcript={transcriptLines}
          className="py-2"
        />
      </ReusableDialog>
    </PageWrapper>
  );
};
