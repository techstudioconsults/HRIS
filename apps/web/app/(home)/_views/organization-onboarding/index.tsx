import { OrganizationOnboardingSectionHeader } from './_components/section-header';

import { EmployeeBanner, TourBanner } from './_views/banners';
import { OnboardingBannersParallax } from './_views/onboarding-banners-parallax';
import { OnboardingStepper } from './_views/onboarding-stepper';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

export const OrganizationOnboarding = () => {
  return (
    <section data-home-organization-onboarding className={'relative'}>
      <Wrapper>
        <OrganizationOnboardingSectionHeader />
        <OnboardingStepper />
      </Wrapper>
      <Wrapper className="my-0! max-w-full relative overflow-visible">
        <div
          data-home-organization-onboarding-banners
          className="relative overflow-visible"
        >
          <Wrapper
            data-onboarding-banners-stage
            className="relative overflow-hidden my-0!"
          >
            <TourBanner />
            <EmployeeBanner />
          </Wrapper>
        </div>
        <OnboardingBannersParallax />
      </Wrapper>
    </section>
  );
};
