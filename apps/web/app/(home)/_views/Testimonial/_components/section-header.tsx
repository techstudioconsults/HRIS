import { Emphasis } from '../../../_components/Emphasis';
import Tag from '../../../_components/tag';

export const TestimonialSectionHeader = () => {
  return (
    <header className="mx-auto max-w-3xl gap-5 text-center">
      <div className="inline-flex">
        <Tag content="Customer success stories" />
      </div>
      <h2
        className=" text-3xl mt-[29px] mb-8 font-semibold tracking-[-0.02em] text-zinc-800 sm:text-4xl lg:text-[54px]
       lg:leading-[1.2]"
      >
        Built for Teams That <Emphasis>Expect More</Emphasis> from HR
      </h2>
      <p className="text-base leading-normal text-zinc-500 lg:text-lg">
        From fast-growing startups to established organizations, teams rely on
        Techstudio HR to run smarter operations every day.
      </p>
    </header>
  );
};
