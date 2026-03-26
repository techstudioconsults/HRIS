import Image from 'next/image';

export const HeroPreview = () => {
  return (
    <div
      className="relative z-10 mx-auto mt-14 max-w-[963px] overflow-hidden 
    rounded-lg border-4 border-white 
    shadow-[0_-6px_13px_0px_rgba(148,193,255,0.1),0_-24px_24px_0px_rgba(148,193,255,0.09),0_-54px_32px_0px_rgba(148,193,255,0.05)]"
    >
      <Image
        src="/images/home/hero-dashboard.png"
        alt="Techstudio HR dashboard preview"
        width={963}
        height={565}
        className="h-auto w-full"
        priority
      />
    </div>
  );
};
