import { Emphasis } from '../../../_components/Emphasis';

export const HeroCopy = () => {
  return (
    <div className="mx-auto my-6 max-w-5xl space-y-4 px-2 sm:my-8 sm:space-y-6">
      <h1 className="mx-auto max-w-4xl text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl md:text-5xl lg:text-[62px] lg:leading-[1.2]">
        HR &amp; Payroll software built for <Emphasis>modern African</Emphasis>{' '}
        teams
      </h1>
      <p className="mx-auto max-w-[507px] text-balance text-sm tracking-[-0.02em] text-zinc-500 sm:text-base md:text-lg lg:text-[20px] lg:leading-[1.4]">
        Manage employees, run payroll, and automate HR operations all in one
        powerful platform.
      </p>
    </div>
  );
};
