"use client";

import { TourProvider } from "@/modules/@org/onboarding/context/tour-context";
import { Wrapper } from "@workspace/ui/components/core/layout/wrapper";
import { Logo } from "@workspace/ui/lib";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <TourProvider>
      <main className={``}>
        <section className={`bg-background sticky top-0 z-10 flex items-center border-b py-8`}>
          <Wrapper className={`max-w-[1272px]`}>
            <Logo width={214} />
          </Wrapper>
        </section>
        <Wrapper className="flex h-[calc(100vh-111.80px)] max-w-[1272px] items-center justify-center">
          <section className="my-[28px]">{children}</section>
        </Wrapper>
      </main>
    </TourProvider>
  );
}

export default OnboardingLayout;
