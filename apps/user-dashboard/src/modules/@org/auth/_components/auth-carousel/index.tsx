"use client";

import { UniversalSwiper } from "@/components/shared/carousel";
import { testimonials } from "@/lib/tools/constants";
import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

export const AuthCarousel = () => {
  return (
    <UniversalSwiper
      className="overflow-hidden"
      items={testimonials}
      renderItem={(testimonial: AuthCarouselProperties) => (
        <section className="relative flex h-[100dvh] items-end justify-center p-9">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className={cn("object-cover")}
            quality={500}
            priority={true}
          />
          <article className="relative z-10 space-y-12">
            <p className={`text-3xl/[120%] font-medium tracking-tighter text-white`}>{testimonial.message}</p>
            <div className={`text-white`}>
              <p className={`text-white`}>{testimonial.name}</p>
              <p className={`text-white`}>{testimonial.position}</p>
            </div>
          </article>
        </section>
      )}
      showPagination
      showNavigation
      breakpoints={{
        0: { slidesPerView: 1 },
        768: { slidesPerView: 1 },
        1024: { slidesPerView: 1 },
        1280: { slidesPerView: 1 },
      }}
    />
  );
};
