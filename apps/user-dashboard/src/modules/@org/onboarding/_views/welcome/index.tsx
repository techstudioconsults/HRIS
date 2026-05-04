'use client';

import { useTour } from '@/modules/@org/onboarding';
import { TourModalButton } from '@workspace/ui/lib/video-player/tour-modal';
import { BlurImage } from '@workspace/ui/components/core/miscellaneous/blur-image';
import { MainButton } from '@workspace/ui/lib/button';
import { useEffect } from 'react';

import { welcomeTourSteps } from '../../config/tour-steps';
import { routes } from '@/lib/routes/routes';
import {
  tourSegments,
  transcriptLines,
} from '@workspace/ui/lib/video-player/tour-modal/constant';

export const Welcome = () => {
  const { startTour, stopTour } = useTour();

  useEffect(() => {
    startTour(welcomeTourSteps);
  }, [startTour]);

  return (
    <section>
      <section
        className={`flex flex-col-reverse items-center justify-between gap-8 lg:flex-row`}
      >
        <section className={`max-w-161.5`}>
          <div className={`space-y-6`} data-tour="welcome-heading">
            <h1 className={`text-4xl font-semibold`}>
              Welcome to TechstudioHR,
            </h1>
            <p className={`text-lg`}>
              Let&apos;s help you get started. You can take a quick tour to
              understand how Techstudio HR works or you can jump straight in and
              begin set up.
            </p>
          </div>
          <div className={`mt-9 flex flex-col gap-7 lg:flex-row`}>
            <TourModalButton
              buttonLabel="Take a Quick Tour"
              buttonClassName="w-full lg:w-fit"
              buttonVariant="primary"
              dataTour="take-tour-button"
              src="/video/trees.mp4"
              poster="/images/onboarding/video-poster.png"
              segments={tourSegments}
              transcript={transcriptLines}
              modalClassName="py-2"
              onOpen={stopTour}
              onClose={stopTour}
            />
            <div data-tour="skip-tour-button">
              <MainButton
                href={routes.onboarding.step1()}
                className={`w-full lg:w-fit`}
                variant={`primaryOutline`}
              >
                Skip Tour & Continue
              </MainButton>
            </div>
          </div>
        </section>

        <BlurImage
          width={500}
          height={561}
          src={'/images/onboarding/deal.svg'}
          alt={'onboarding'}
          className={`max-h-140.25 w-125 rounded-2xl bg-gray-50 object-cover shadow`}
        />
      </section>
    </section>
  );
};
