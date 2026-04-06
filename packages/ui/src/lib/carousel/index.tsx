'use client';

import * as React from 'react';
import Autoplay from 'embla-carousel-autoplay';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@workspace/ui/components/carousel';
import { cn } from '@workspace/ui/lib/utils';
import { GradientMask } from '@workspace/ui/lib/gradient-mask';

export type TestimonialCarouselItem = {
  quote: string;
  name: string;
  role: string;
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
};

type TestimonialCarouselProps = Pick<
  React.ComponentProps<typeof Carousel>,
  'opts' | 'plugins' | 'setApi'
> & {
  items: TestimonialCarouselItem[];
  className?: string;
  cardClassName?: string;
  showControls?: boolean;
  autoScroll?: boolean;
  autoScrollDelayMs?: number;
};

const getFallback = (item: TestimonialCarouselItem) => {
  if (item.avatarFallback) return item.avatarFallback;

  return item.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

export const TestimonialCarousel = ({
  items,
  opts,
  plugins,
  setApi,
  className,
  cardClassName,
  showControls = true,
  autoScroll = true,
  autoScrollDelayMs = 5000,
}: TestimonialCarouselProps) => {
  const mergedPlugins = plugins ? [...plugins] : [];

  if (autoScroll && items.length > 1) {
    mergedPlugins.push(
      Autoplay({
        delay: autoScrollDelayMs,
        stopOnFocusIn: true,
      })
    );
  }

  if (!items.length) return null;

  return (
    <div className={cn('w-full px-0 py-8 sm:px-8 lg:px-12', className)}>
      <Carousel
        opts={{
          align: 'start',
          loop: items.length > 1,
          ...opts,
        }}
        plugins={mergedPlugins}
        setApi={setApi}
        className="mx-auto w-full max-w-[980px] overflow-visible! md:pb-0"
      >
        <CarouselContent className={`pb-32`}>
          {items.map((item, index) => {
            const fallback = getFallback(item);

            return (
              <CarouselItem className={``} key={`${item.name}-${index}`}>
                <article
                  className={cn(
                    'px-6 py-7 sm:px-10 sm:py-9',
                    'relative cc-shadow mx-auto w-full max-w-[780px] overflow-hidden ' +
                      'rounded-xl lg:border border-[#CDE2FF] border-t-6! ' +
                      'border-t-primary bg-background' +
                      cardClassName
                  )}
                >
                  <svg
                    aria-hidden
                    width="40"
                    height="32"
                    viewBox="0 0 40 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mb-4 text-[#C6DCFF]"
                  >
                    <path
                      d="M0 32V19.556C0 14.963 1.037 11.022 3.111
                      7.733 5.185 4.444 8.444 1.926 12.889 0.178L15.111
                      3.911C12.741 4.889 10.963 6.222 9.778 7.911 8.593
                      9.6 7.926 11.763 7.778 14.4H15.111V32H0ZM24.889
                      32V19.556C24.889 14.963 25.926 11.022 28 7.733 30.074
                      4.444 33.333 1.926 37.778 0.178L40 3.911C37.63 4.889 35.852
                       6.222 34.667 7.911 33.481 9.6 32.815 11.763 32.667
                       14.4H40V32H24.889Z"
                      fill="currentColor"
                    />
                  </svg>
                  <blockquote className="my-7 max-w-3xl text-left text-base leading-[1.35] text-zinc-700 sm:text-[26px]">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <footer className="flex items-center gap-3 text-left">
                    <Avatar className="size-10 border border-zinc-200">
                      {item.avatarSrc ? (
                        <AvatarImage
                          src={item.avatarSrc}
                          alt={item.avatarAlt ?? `${item.name} avatar`}
                        />
                      ) : null}
                      <AvatarFallback className="bg-zinc-100 text-xs font-semibold text-zinc-700">
                        {fallback}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold leading-none text-zinc-900">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">{item.role}</p>
                    </div>
                  </footer>
                </article>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {showControls ? (
          <>
            <CarouselPrevious
              className="absolute bg-background size-12 bottom-1/6
            lg:top-1/3 left-1/3 lg:left-0 rounded-full border text-primary z-20"
            />
            <CarouselNext
              className="absolute bg-background size-12 bottom-1/6
            lg:top-1/3 right-1/3 lg:right-0 rounded-full border text-primary z-20"
            />
          </>
        ) : null}
        <GradientMask
          direction={`left`}
          className={`w-10 h-[70%] hidden lg:block absolute left-0 lg:h-full lg:translate-y-0 translate-y-1/4 lg:w-[144px]`}
        />
        <GradientMask
          direction={`right`}
          className={`w-10 h-[70%] lg:h-full hidden lg:block lg:translate-y-0 translate-y-1/4 lg-[144px] absolute right-0`}
        />
      </Carousel>
    </div>
  );
};
