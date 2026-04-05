'use client';

import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';

interface DashboardBannerProperties {
  img: string;
  title: string;
  desc: string;
}

export const DashboardBanner = ({
  img,
  title,
  desc,
}: DashboardBannerProperties) => {
  return (
    <div
      className={cn(
        'bg-primary flex flex-col items-center gap-2 rounded-lg ' +
          'shadow md:items-center md:justify-between lg:flex-row',
        'bg-cover bg-right bg-no-repeat',
        'px-8 pt-8 lg:pt-0',
        `bg-[url(/images/lines.svg)]`
      )}
    >
      <div className="w-full flex-1 text-center md:w-auto lg:text-left">
        <h3 className="text-2xl leading-10 text-balance text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-50 sm:mt-3 md:mt-4 md:max-w-140">
          {desc}
        </p>
      </div>
      <div className="relative flex-1">
        <Image
          src={img}
          alt="Banner image"
          width={250}
          height={250}
          className="object-contain ml-auto"
        />
      </div>
    </div>
  );
};
