import { BlurImage } from '@workspace/ui/components/core/miscellaneous/blur-image';

export const HeroPreview = () => {
  return (
    <div
      data-speed={1.1}
      className="relative z-10 mx-auto mt-10 w-full max-w-[963px] overflow-hidden rounded-md
       border-2 border-white shadow-sm sm:mt-12 sm:rounded-lg sm:border-4 sm:shadow-md md:mt-0"
    >
      <BlurImage
        priority
        fetchPriority="high"
        src="https://res.cloudinary.com/kingsleysolomon/image/upload/f_auto,q_auto/v1774717335/techstudio/hris-repo/iiv3ky7p8aarak435vke.webp"
        className={`size-full object-cover bg-gray-50`}
        alt="Techstudio HR dashboard preview"
        width={963}
        height={0}
      />
    </div>
  );
};
