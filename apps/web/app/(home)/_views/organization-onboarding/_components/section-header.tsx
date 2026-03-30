import Tag from '../../../_components/tag';
import { Emphasis } from '../../../_components/Emphasis';
import { organizationOnboardingHeader } from '../constants';

export const OrganizationOnboardingSectionHeader = () => {
  return (
    <header className="mx-auto flex max-w-[640px] flex-col items-center gap-5 text-center">
      <div className="inline-flex">
        <Tag content={organizationOnboardingHeader.badge} />
      </div>
      <h2
        className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl lg:text-[54px]
       lg:leading-[1.2]"
      >
        {organizationOnboardingHeader.titlePrefix}
        <br />
        {organizationOnboardingHeader.titleMain}{' '}
        <Emphasis>{organizationOnboardingHeader.titleEmphasis}</Emphasis>.
      </h2>
      <p className="max-w-[540px] text-balance text-base leading-normal text-zinc-500 lg:text-lg">
        {organizationOnboardingHeader.subtitle}
      </p>
    </header>
  );
};
