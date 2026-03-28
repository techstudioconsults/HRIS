import Tag from '../../../_components/tag';
import { Emphasis } from '../../../_components/Emphasis';

export const OurProductsSectionHeader = () => {
  return (
    <header className="mx-auto flex max-w-[1000px] flex-col items-center gap-4 text-center md:gap-5">
      <Tag content={'Our Products'} />
      <h2
        className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl lg:text-[54px]
       lg:leading-[1.2]"
      >
        Everything You Need to <Emphasis>Run HR</Emphasis> Smoothly
      </h2>
      <p
        className="max-w-[507px] text-balance text-base tracking-[-0.02em] text-zinc-500 sm:text-lg lg:text-[20px]
       lg:leading-[1.4]"
      >
        From onboarding to payroll to compliance, manage your entire workforce
        from one intelligent dashboard.
      </p>
    </header>
  );
};
