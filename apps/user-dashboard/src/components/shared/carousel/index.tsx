"use client";

import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
// Import Swiper styles
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import "swiper/css/scrollbar";
// import "swiper/css/free-mode";
// import "swiper/css/thumbs";

// import { Icons } from "@/components/core/miscellaneous/icons";

import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { A11y, Autoplay, FreeMode, Navigation, Pagination, Scrollbar, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import type { Swiper as SwiperType } from "swiper/types";

export const UniversalSwiper = ({
  items,
  renderItem,
  swiperOptions = {},
  showNavigation = false,
  showPagination = false,
  showScrollbar = false,
  navigationSize = 24,
  navigationOffset = 0,
  className,
  swiperClassName,
  slideClassName,
  thumbsSwiper,
  breakpoints,
  freeMode = false,
  onSwiperInit,
}: UniversalSwiperProperties) => {
  const [isMounted, setIsMounted] = useState(false);
  const swiperReference = useRef<SwiperType | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      // Cleanup Swiper instance on unmount
      if (swiperReference.current) {
        swiperReference.current.destroy(true, true);
      }
    };
  }, []);

  if (!isMounted || !items?.length) return null;

  const modules = [
    ...(showNavigation ? [Navigation] : []),
    ...(showPagination ? [Pagination] : []),
    ...(showScrollbar ? [Scrollbar] : []),
    ...(freeMode ? [FreeMode] : []),
    ...(thumbsSwiper ? [Thumbs] : []),
    Autoplay,
    A11y,
  ];

  return (
    <div className={cn(className)}>
      <Swiper
        {...swiperOptions}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        modules={modules}
        thumbs={{ swiper: thumbsSwiper }}
        breakpoints={breakpoints}
        freeMode={freeMode}
        className={cn(swiperClassName)}
        onSwiper={(swiper) => {
          swiperReference.current = swiper;
          onSwiperInit?.(swiper);
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className={cn(slideClassName)}>
            {renderItem(item, index)}
          </SwiperSlide>
        ))}
        {showNavigation && <CustomNavigation iconSize={navigationSize} offset={navigationOffset} />}
      </Swiper>
    </div>
  );
};

type CustomNavigationProperties = {
  variant?: "default" | "minimal";
  iconSize?: number;
  offset?: number;
  className?: string;
};

export const CustomNavigation = ({ iconSize = 24, className }: CustomNavigationProperties) => {
  const swiper = useSwiper();
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const handleSlideChange = (swiper: SwiperType) => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
    };

    swiper.on("slideChange", handleSlideChange);

    return () => {
      swiper.off("slideChange", handleSlideChange);
    };
  }, [swiper]);

  return (
    <div className={cn("absolute inset-0 right-10 bottom-10 flex items-end justify-end gap-4", className)}>
      <MainButton
        onClick={(event) => {
          event.stopPropagation();
          swiper.slidePrev();
        }}
        isDisabled={isBeginning}
        isIconOnly
        icon={<ChevronLeftCircle size={iconSize} />}
        variant="outline"
        size="circle"
        aria-label="Previous slide"
        className={cn(
          "hover:bg-primary z-10 size-10 bg-black/50 text-white hover:text-white",
          // isBeginning ? "hidden" : "block",
        )}
      />
      <MainButton
        onClick={(event) => {
          event.stopPropagation();
          swiper.slideNext();
        }}
        isDisabled={isEnd}
        isIconOnly
        icon={<ChevronRightCircle size={iconSize} />}
        variant="outline"
        size="circle"
        aria-label="Next slide"
        className={cn(
          "hover:bg-primary z-10 bg-black/50 text-white hover:text-white",
          // isEnd ? "hidden" : "block"
        )}
      />
    </div>
  );
};
