import { HeroBackground } from './_components/hero-background';
import { AnnouncementChip } from './_components/announcement-chip';
import { HeroCopy } from './_components/hero-copy';
import { HeroPreview } from './_components/hero-preview';
import { HeroActions } from './_components/hero-actions';

export const Hero = () => {
  return (
    <main className="h-[120vh] bg-primary/5 flex flex-col items-center overflow-hidden">
      <HeroBackground />
      <div className="bg-background min-w-[1068px] mt-10 mx-auto fixed top-0 z-999 h-16 rounded-xl shadow-md" />
      <section className="text-center z-1 translate-y-[20vh]">
        <AnnouncementChip />
        <HeroCopy />
        <HeroActions />
        <HeroPreview />
      </section>
    </main>
  );
};
