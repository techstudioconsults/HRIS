'use client';

import * as React from 'react';

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
}: TestimonialCarouselProps) => {
  if (!items.length) return null;

  return (
    <div
      className={cn(
        'relative w-full bg-zinc-100 px-4 py-8 sm:px-8 lg:px-12',
        className
      )}
    >
      <Carousel
        opts={{
          align: 'start',
          loop: items.length > 1,
          ...opts,
        }}
        plugins={plugins}
        setApi={setApi}
        className="mx-auto w-full max-w-[980px]"
      >
        <CarouselContent>
          {items.map((item, index) => {
            const fallback = getFallback(item);

            return (
              <CarouselItem key={`${item.name}-${index}`}>
                <article
                  className={cn(
                    'relative mx-auto w-full max-w-[820px] overflow-hidden rounded-md border border-[#B6D1FF] bg-white px-6 py-7 sm:px-10 sm:py-9',
                    cardClassName
                  )}
                >
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 bg-[#3B82F6]"
                    aria-hidden
                  />
                  <span
                    className="mb-4 block text-6xl leading-none text-[#C6DCFF]"
                    aria-hidden
                  >
                    &ldquo;
                  </span>
                  <blockquote className="mb-7 max-w-3xl text-left text-xl leading-[1.35] text-zinc-700 sm:text-[30px]">
                    "{item.quote}"
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
            <CarouselPrevious className="left-0 size-12 border-zinc-200 bg-white text-zinc-700 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white" />
            <CarouselNext className="right-0 size-12 border-zinc-200 bg-white text-zinc-700 shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:bg-white" />
          </>
        ) : null}
      </Carousel>
    </div>
  );
};
