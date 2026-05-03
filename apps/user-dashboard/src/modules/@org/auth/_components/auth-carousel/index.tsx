'use client';

import { testimonials } from '@/lib/tools/constants';
import { UniversalSwiper } from '@/components/shared/carousel';
import { Autoplay } from '@workspace/ui/lib/carousel-plugins';
import { GradientMask } from '@workspace/ui/lib/gradient-mask';

export const AuthCarousel = () => {
  return (
    <>
      <UniversalSwiper
        className="overflow-hidden"
        plugins={[Autoplay({ delay: 8000, stopOnFocusIn: true })]}
        items={testimonials}
        renderItem={(testimonial: AuthCarouselProperties) => (
          <section className="relative flex items-end justify-center p-9">
            <article className="relative z-10 space-y-12">
              <p
                className={`text-xl/[120%] font-medium tracking-tighter text-white`}
              >
                {testimonial.message}
              </p>
              <div className={`text-white`}>
                <p className={`text-white`}>{testimonial.name}</p>
                <p className={`text-white`}>{testimonial.position}</p>
              </div>
            </article>
          </section>
        )}
        showPagination
        // showNavigation
      />
      <GradientMask className={` h-[50%]! via-black/80 from-black`} />
    </>
  );
};
