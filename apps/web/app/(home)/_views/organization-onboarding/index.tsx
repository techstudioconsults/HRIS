import { OrganizationOnboardingSectionHeader } from './_components/section-header';

import { EmployeeBanner, TourBanner } from './_views/banners';
import { OnboardingStepper } from './_views/onboarding-stepper';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

export const OrganizationOnboarding = () => {
  return (
    <Wrapper data-home-organization-onboarding>
      <OrganizationOnboardingSectionHeader />
      <OnboardingStepper />
      <TourBanner />
      <EmployeeBanner />
    </Wrapper>
  );
};
