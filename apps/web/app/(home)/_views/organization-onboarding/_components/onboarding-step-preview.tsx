import { BlurImage } from '@workspace/ui/components/core/miscellaneous/blur-image';

interface OnboardingStepPreviewProperties {
  src: string;
  alt: string;
}

export const OnboardingStepPreview = ({
  src,
  alt,
}: OnboardingStepPreviewProperties) => {
  return (
    <div className="relative mx-auto aspect-580/580 w-full overflow-hidden">
      <BlurImage
        fill
        priority
        src={src}
        alt={alt}
        className="object-contain w-full object-center"
      />
    </div>
  );
};
