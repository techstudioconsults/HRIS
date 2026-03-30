import { HeroBackground } from './_components/hero-background';
import { AnnouncementChip } from './_components/announcement-chip';
import { HeroCopy } from './_components/hero-copy';
import { HeroPreview } from './_components/hero-preview';
import { HeroActions } from './_components/hero-actions';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

export const Hero = () => {
  return (
    <main
      data-home-hero
      className="relative flex min-h-svh flex-col items-center overflow-hidden bg-primary/5 sm:min-h-[108svh]
       lg:min-h-[120vh]"
    >
      <HeroBackground />
      <Wrapper
        className="z-1 mx-auto w-full max-w-6xl pt-30 my-0! text-center sm:pt-28 md:pt-32 lg:pt-[20vh]
        mask-[linear-gradient(to_bottom,black_0%,black_58%,transparent_100%)]
        [-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)]
        "
      >
        <AnnouncementChip />
        <HeroCopy />
        <HeroActions />
        <HeroPreview />
      </Wrapper>
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24
        bg-linear-to-t from-background via-background/70 to-transparent sm:h-32 lg:h-44"
      />
    </main>
  );
};
