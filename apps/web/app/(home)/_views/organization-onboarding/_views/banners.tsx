'use client';

import React from 'react';
import { Emphasis } from '../../../_components/Emphasis';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { MainButton } from '@workspace/ui/lib/button';
import { SuspenseLoading } from '@workspace/ui/lib/loading';
import dynamic from 'next/dynamic';
import {
  tourSegments,
  transcriptLines,
} from '@workspace/ui/lib/video-player/tour-modal/constant';
import { TourModalButton } from '@workspace/ui/lib/video-player/tour-modal';
const BlurImage = dynamic(
  () =>
    import('@workspace/ui/components/core/miscellaneous/blur-image').then(
      (module) => module.BlurImage
    ),
  {
    ssr: false,
    loading: () => <SuspenseLoading />,
  }
);

export const TourBanner = () => {
  return (
    <Wrapper className="bg-primary/10 sticky top-0 lg:max-h-[601.72px] py-4 lg:py-[66px] lg:px-[58px]! my-0! rounded-[18px]">
      <div className="flex justify-center flex-col-reverse md:flex-row items-center gap-5 lg:gap-10">
        <div className="flex-1 space-y-10">
          <header>
            <h2
              data-header-text
              className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 md:text-4xl xl:text-[54px]
       lg:leading-[1.2]"
            >
              <span data-h1 className="inline-block">
                Run <Emphasis>Payroll</Emphasis>
              </span>
            </h2>
            <h2
              data-header-text
              className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 md:text-4xl xl:text-[54px]
       lg:leading-[1.2]"
            >
              <span data-h1 className="inline-block">
                Without the Chaos
              </span>
            </h2>
          </header>
          <p className="text-sm md:text-[15px] leading-normal text-zinc-500 lg:text-lg">
            Automate salary processing, deductions, and payslips with a payroll
            system built for modern African businesses.
          </p>
          <div
            className="mx-auto flex w-full max-w-md flex-col items-center
          gap-3 sm:max-w-none sm:flex-row sm:gap-4 lg:gap-5"
          >
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
            />
            <MainButton
              variant={'primaryOutline'}
              className="w-full bg-background sm:w-auto"
              href={`/login`}
            >
              Login
            </MainButton>
          </div>
        </div>
        <div className="flex-1">
          <BlurImage
            src={
              'https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto,w_1000/v1774717337/techstudio/hris-repo/fmimfi3rihq8clzj9gn2.webp'
            }
            alt={'tour-img'}
            width={514}
            height={469}
            className={'border-4 rounded-xl border-background mx-auto'}
          />
        </div>
      </div>
    </Wrapper>
  );
};

export const EmployeeBanner = () => {
  return (
    <Wrapper className="bg-[#F7F9FC] z-2 lg:max-h-[601.72px] py-4 lg:py-[66px] lg:px-[58px]! my-0! rounded-[18px]">
      <div className="flex justify-center flex-col-reverse md:flex-row-reverse items-center gap-5 lg:gap-10">
        <div className="flex-1 space-y-10">
          <header>
            <h2
              data-header-text
              className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 md:text-4xl xl:text-[54px]
       lg:leading-[1.2]"
            >
              <span data-h1 className="inline-block">
                A Better Experience
              </span>
            </h2>
            <h2
              data-header-text
              className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 md:text-4xl xl:text-[54px]
       lg:leading-[1.2]"
            >
              <span data-h1 className="inline-block">
                for <Emphasis>Every Employee</Emphasis>
              </span>
            </h2>
          </header>
          <p className="text-sm md:text-[15px] text-balance leading-normal text-zinc-500 lg:text-lg">
            Give your team easy access to payslips, attendance, and essential HR
            tools, all in one seamless experience, wherever they work.
          </p>
          <div
            className="mx-auto flex w-full max-w-md flex-col items-center
          gap-3 sm:max-w-none sm:flex-row sm:gap-4 lg:gap-5"
          >
            <MainButton
              isExternal
              href={'/register'}
              variant={'primary'}
              className="w-full sm:w-auto"
            >
              Start free Trial
            </MainButton>
            <MainButton
              isExternal
              variant={'primaryOutline'}
              className="w-full bg-background sm:w-auto"
              href={'/login'}
            >
              Login
            </MainButton>
          </div>
        </div>
        <div className="flex-1">
          {/*<Phones />*/}
          <BlurImage
            src={
              'https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto,w_1000/' +
              'v1774766845/techstudio/hris-repo/y6xgs9npgb9xvscim2fq.webp'
            }
            alt={'phones-img'}
            width={514}
            height={469}
            className={'rounded-xl border-background mx-auto'}
          />
        </div>
      </div>
    </Wrapper>
  );
};
