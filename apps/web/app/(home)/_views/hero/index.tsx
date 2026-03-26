import { HeroBackground } from './_components/hero-background';
import { AnnouncementChip } from './_components/announcement-chip';

export const Hero = () => {
  return (
    <main className="h-dvh bg-primary/5 flex items-center justify-center">
      <HeroBackground />
      <AnnouncementChip />
    </main>
  );
};
