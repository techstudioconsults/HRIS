'use client';

import { useEffect, useMemo, useState } from 'react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@workspace/ui/components/carousel';
import { cn } from '@workspace/ui/lib/utils';

export const UniversalSwiper = ({
  items,
  renderItem,
  swiperOptions,
  plugins,
  showNavigation = false,
  showPagination = false,
  className,
  swiperClassName,
  slideClassName,
  onSwiperInit,
}: UniversalSwiperProperties) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const totalSlides = items?.length ?? 0;
  const shouldShowControls = totalSlides > 1;

  useEffect(() => {
    if (!api) return;

    const updateActiveSlide = () => {
      setActiveIndex(api.selectedScrollSnap());
    };

    updateActiveSlide();
    api.on('select', updateActiveSlide);
    api.on('reInit', updateActiveSlide);

    return () => {
      api.off('select', updateActiveSlide);
      api.off('reInit', updateActiveSlide);
    };
  }, [api]);

  const carouselOptions = useMemo(
    () => ({
      loop: shouldShowControls,
      ...(swiperOptions ?? {}),
    }),
    [shouldShowControls, swiperOptions]
  );

  if (!totalSlides) return null;

  return (
    <section className={cn('relative', className)}>
      <Carousel
        className={cn('w-full z-12', swiperClassName)}
        opts={carouselOptions}
        plugins={plugins}
        setApi={(nextApi) => {
          setApi(nextApi);
          onSwiperInit?.(nextApi);
        }}
      >
        <CarouselContent>
          {items.map((item, index) => (
            <CarouselItem key={`slide-${index}`} className={cn(slideClassName)}>
              {renderItem(item, index)}
            </CarouselItem>
          ))}
        </CarouselContent>
        {showNavigation && shouldShowControls ? (
          <div className={`absolute right-10 bottom-10 space-x-5`}>
            <CarouselPrevious className="border-background text-background rounded-full" />
            <CarouselNext className="border-background text-background rounded-full" />
          </div>
        ) : null}
      </Carousel>

      {showPagination && shouldShowControls ? (
        <div className="pointer-events-none py-2  right-0 bottom-6 left-0 z-10 flex items-center justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={`dot-${index}`}
              type="button"
              className={cn(
                'pointer-events-auto h-2 w-2 rounded-full bg-white/45 transition-all',
                activeIndex === index && 'w-6 bg-primary'
              )}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index}
              onClick={() => api?.scrollTo(index)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};
