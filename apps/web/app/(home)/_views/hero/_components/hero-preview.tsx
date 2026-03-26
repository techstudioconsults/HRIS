import Image from 'next/image';

export const HeroPreview = () => {
  return (
    <div className="relative z-10 mx-auto mt-10 w-full max-w-[963px] overflow-hidden rounded-md border-2 border-white shadow-sm sm:mt-12 sm:rounded-lg sm:border-4 sm:shadow-md md:mt-14">
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
