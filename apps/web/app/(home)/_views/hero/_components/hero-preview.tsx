import { BlurImage } from '@workspace/ui/components/core/miscellaneous/blur-image';

export const HeroPreview = () => {
  return (
    <div
      data-speed={1.1}
      className="relative z-10 mx-auto max-w-[963px] mt-10 w-full overflow-hidden rounded-md
       border-2 border-white shadow-sm sm:mt-12 sm:rounded-lg sm:border-4 sm:shadow-md md:mt-0"
    >
      <BlurImage
        fetchPriority="high"
        src="https://res.cloudinary.com/kingsleysolomon/image/upload/q_auto/f_auto/c_scale,w_auto/v1774717335/techstudio/hris-repo/iiv3ky7p8aarak435vke"
        // src="https://res.cloudinary.com/prod/image/upload/q_auto/f_auto/c_scale,w_800/me/bridge"
        className={`w-[963px] object-contain bg-gray-50`}
        alt="Techstudio HR dashboard preview"
        width={963}
        height={300}
      />
    </div>
  );
};
