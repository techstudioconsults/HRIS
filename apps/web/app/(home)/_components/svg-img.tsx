import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';

interface SVGImgProps {
  src: string;
  alt: string;
  isWide?: boolean;
}

const SVGImg = ({ src, alt, isWide = false }: SVGImgProps) => {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn('object-top', isWide ? 'object-cover' : 'object-contain')}
    />
  );
};

export default SVGImg;
