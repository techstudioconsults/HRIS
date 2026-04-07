'use client';

import { OnboardingRouteGuard } from '@/modules/@org/onboarding';
import { TourProvider } from '@workspace/ui/context/tour-context';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { Logo } from '@workspace/ui/lib';

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <OnboardingRouteGuard>
      <TourProvider>
        <main>
          <section
            className={`bg-background sticky overflow-hidden top-0 z-10 flex items-center border-b`}
          >
            <Wrapper className={`my-5! lg:my-20!`}>
              <Logo logo={`/images/logo.svg`} width={214} />
            </Wrapper>
          </section>
          <Wrapper className={`my-10!`}>
            <section className="my-7">{children}</section>
          </Wrapper>
        </main>
      </TourProvider>
    </OnboardingRouteGuard>
  );
}

export default OnboardingLayout;
