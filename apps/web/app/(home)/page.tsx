import { Hero } from './_views';

export default function Page() {
  return (
    <>
      <Hero />
      <p>
        Why this works for masking: In CSS masks, opaque areas show content, transparent areas hide it. So at the very
        bottom: dots are gone Quick tuning: Earlier fade (more subtle): black 30%, transparent 100% Later fade (more
        visible dots): black 65%, transparent 100% Harder cutoff: black 70%, transparent 75% So your current value gives
        a smooth lower-half fade while preserving a strong dot pattern in the upper part.
      </p>
    </>
  );
}
