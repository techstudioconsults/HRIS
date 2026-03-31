import Tag from '../../../_components/tag';
import { Emphasis } from '../../../_components/Emphasis';

export const BuiltForAllTeamsSectionHeader = () => {
  return (
    <header className="flex flex-col gap-5 lg:max-w-[620px]">
      <div>
        <Tag content={'Built for all teams'} />
      </div>
      <header>
        <h2
          data-header-text
          className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-900 sm:text-4xl lg:text-[54px] lg:leading-[1.2]"
        >
          <span data-h1 className="inline-block">
            Designed for Teams
          </span>
        </h2>
        <h2
          data-header-text
          className="text-balance text-3xl font-semibold tracking-[-0.02em] text-zinc-900 sm:text-4xl lg:text-[54px] lg:leading-[1.2]"
        >
          <span data-h1 className="inline-block">
            That Are <Emphasis>Growing Fast</Emphasis>
          </span>
        </h2>
      </header>
    </header>
  );
};
