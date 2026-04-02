'use client';

import { TourProvider } from '@workspace/ui/context/tour-context';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';
import { Logo } from '@workspace/ui/lib';

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider>
      <main>
        <section
          className={`bg-background sticky top-0 z-10 flex items-center border-b shadow-2xl`}
        >
          <Wrapper className={`my-5! lg:my-20!`}>
            <Logo width={214} />
          </Wrapper>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24
        bg-linear-to-t from-background via-background/70 to-transparent sm:h-32 lg:h-44"
          />
        </section>
        <Wrapper className={`my-0!`}>
          <section className="my-7">{children}</section>
        </Wrapper>
      </main>
    </TourProvider>
  );
}

export default OnboardingLayout;
