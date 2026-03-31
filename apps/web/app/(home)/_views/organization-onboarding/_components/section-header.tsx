import Tag from '../../../_components/tag';
import { Emphasis } from '../../../_components/Emphasis';
import { organizationOnboardingHeader } from '../constants';

export const OrganizationOnboardingSectionHeader = () => {
  return (
    <header className="mx-auto flex max-w-[640px] flex-col items-center gap-5 text-center">
      <div className="inline-flex">
        <Tag content={organizationOnboardingHeader.badge} />
      </div>
      <header>
        <h2
          data-header-text
          className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl lg:text-[54px] lg:leading-[1.2]"
        >
          <span data-h1 className="block">
            {organizationOnboardingHeader.titlePrefix}
          </span>
        </h2>
        <h2
          data-header-text
          className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl lg:text-[54px] lg:leading-[1.2]"
        >
          <span data-h1 className="block">
            {organizationOnboardingHeader.titleMain}{' '}
            <Emphasis>{organizationOnboardingHeader.titleEmphasis}</Emphasis>.
          </span>
        </h2>
      </header>
      <p className="max-w-[540px] text-balance text-base leading-normal text-zinc-500 lg:text-lg">
        {organizationOnboardingHeader.subtitle}
      </p>
    </header>
  );
};
