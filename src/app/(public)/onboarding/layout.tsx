import { Wrapper } from "@/components/core/layout/wrapper";
import { Logo } from "@/components/shared/logo";

function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={``}>
      <Wrapper className={`sticky top-0 flex min-h-[143px] max-w-[1272px] items-center`}>
        <Logo width={214} />
      </Wrapper>
      <section className="grid grid-cols-[1rem_minmax(0,1240px)_1rem] justify-center md:-mx-4 lg:mx-0">
        <span />
        <section className="my-[28px]">{children}</section>
        <span />
      </section>
    </main>
  );
}

export default OnboardingLayout;
