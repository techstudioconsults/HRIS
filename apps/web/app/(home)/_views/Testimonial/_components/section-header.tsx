import { Emphasis } from '../../../_components/Emphasis';
import Tag from '../../../_components/tag';

export const TestimonialSectionHeader = () => {
  return (
    <header className="mx-auto max-w-3xl gap-5 text-center">
      <div className="inline-flex">
        <Tag content="Customer success stories" />
      </div>
      <header className={'mt-[29px] mb-8'}>
        <h2
          data-header-text
          className=" text-3xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl lg:text-[54px] lg:leading-[1.2]"
        >
          <span data-h1 className="inline-block">
            Built for Teams That
          </span>
        </h2>
        <h2
          data-header-text
          className=" text-3xl font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl lg:text-[54px] lg:leading-[1.2]"
        >
          <span data-h1 className="inline-block">
            <Emphasis>Expect More</Emphasis> from HR
          </span>
        </h2>
      </header>
      <p className="text-base leading-normal text-zinc-500 lg:text-lg">
        From fast-growing startups to established organizations, teams rely on
        Techstudio HR to run smarter operations every day.
      </p>
    </header>
  );
};
