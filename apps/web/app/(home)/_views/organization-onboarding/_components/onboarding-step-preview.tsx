'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface OnboardingStepPreviewProperties {
  src: string;
  alt: string;
}

interface ImageLayer {
  src: string;
  id: number;
  isOutgoing: boolean;
}

let layerCounter = 0;

export const OnboardingStepPreview = ({
  src,
  alt,
}: OnboardingStepPreviewProperties) => {
  const [layers, setLayers] = useState<ImageLayer[]>([
    { src, id: ++layerCounter, isOutgoing: false },
  ]);
  const prevSrcRef = useRef(src);

  useEffect(() => {
    if (src === prevSrcRef.current) return;
    prevSrcRef.current = src;

    setLayers((previous) => {
      const current = previous[previous.length - 1];
      return [
        { ...current, isOutgoing: true },
        { src, id: ++layerCounter, isOutgoing: false },
      ];
    });
  }, [src]);

  const removeLayer = (id: number) => {
    setLayers((previous) => previous.filter((layer) => layer.id !== id));
  };

  return (
    <div className="relative mx-auto aspect-[580/580] w-full overflow-hidden">
      {layers.map((layer) => (
        <div
          key={layer.id}
          className="absolute inset-0"
          style={{
            animation: layer.isOutgoing
              ? 'step-fade-out 400ms ease-out forwards'
              : layers.length > 1
                ? 'step-fade-in 400ms ease-out forwards'
                : undefined,
          }}
          onAnimationEnd={
            layer.isOutgoing ? () => removeLayer(layer.id) : undefined
          }
        >
          <Image
            fill
            priority={!layer.isOutgoing}
            src={layer.src}
            alt={alt}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-contain w-full object-center"
          />
        </div>
      ))}
    </div>
  );
};
