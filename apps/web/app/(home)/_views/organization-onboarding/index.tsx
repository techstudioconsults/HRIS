import { OrganizationOnboardingSectionHeader } from './_components/section-header';

import { EmployeeBanner, TourBanner } from './_views/banners';
import { OnboardingStepper } from './_views/onboarding-stepper';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

export const OrganizationOnboarding = () => {
  return (
    <section data-home-organization-onboarding className={'relative'}>
      <Wrapper>
        <OrganizationOnboardingSectionHeader />
        <OnboardingStepper />
      </Wrapper>
      <Wrapper className="my-0! max-w-full relative lg:max-h-[601.72px] overflow-y-scroll hide-scrollbar">
        <TourBanner />
        <EmployeeBanner />
      </Wrapper>
    </section>
  );
};
