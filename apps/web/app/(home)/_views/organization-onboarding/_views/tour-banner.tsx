import React from 'react';
import { BlurImage } from '@workspace/ui/components/core/miscellaneous/blur-image';
import { Emphasis } from '../../../_components/Emphasis';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

export const TourBanner = () => {
  return (
    <Wrapper className="bg-primary/10 py-4 lg:py-[66px] lg:px-[58px]! my-0! rounded-[18px]">
      <div className="flex justify-center flex-col-reverse md:flex-row items-center gap-5 lg:gap-10">
        <div className="flex-1">
          <header>
            <h2
              className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 md:text-4xl xl:text-[54px]
       lg:leading-[1.2]"
            >
              Run <Emphasis>Payroll</Emphasis> Without the Chaos
            </h2>
            <p className="text-sm md:text-[15px] leading-normal text-zinc-500 lg:text-lg">
              Automate salary processing, deductions, and payslips with a
              payroll system built for modern African businesses.
            </p>
          </header>
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
