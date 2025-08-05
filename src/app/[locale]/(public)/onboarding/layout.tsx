"use client";

import { Wrapper } from "@/components/core/layout/wrapper";
import { Logo } from "@/components/shared/logo";
import { useSession } from "next-auth/react";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  // eslint-disable-next-line no-console
  console.log(session);
  return (
    <main className={``}>
      <section className={`bg-background sticky top-0 z-10 flex items-center border-b py-8`}>
        <Wrapper className={`max-w-[1272px]`}>
          <Logo width={214} />
        </Wrapper>
      </section>
      <section className="grid grid-cols-[1rem_minmax(0,1240px)_1rem] justify-center md:-mx-4 lg:mx-0">
        <span />
        <section className="my-[28px]">{children}</section>
        <span />
      </section>
    </main>
  );
}

export default OnboardingLayout;
