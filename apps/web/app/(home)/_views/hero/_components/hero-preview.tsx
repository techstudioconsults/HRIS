import Image from 'next/image';

export const HeroPreview = () => {
  return (
    <div className="relative z-10 mx-auto mt-14 max-w-[963px] overflow-hidden rounded-lg border-4 border-white shadow-md">
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
