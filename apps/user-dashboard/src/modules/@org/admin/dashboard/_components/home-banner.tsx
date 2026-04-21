'use client';

import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { DashboardBannerProperties } from '@/modules/@org/admin/dashboard/types';

export const DashboardBanner = ({
  img,
  title,
  desc,
}: DashboardBannerProperties) => {
  const pathname = usePathname();
  const isAdmin = pathname.includes(`admin`);

  return (
    <div
      className={cn(
        'bg-primary flex flex-col items-center gap-2 rounded-lg ' +
          'shadow md:items-center md:justify-between lg:flex-row',
        'bg-cover bg-right bg-no-repeat',
        'p-6 lg:px-10',
        `bg-[url(/images/dashboard/Lines.svg)]`
      )}
    >
      <div className="w-full flex-2 text-center md:w-auto lg:text-left">
        <h3 className="text-2xl leading-10 text-balance text-white">{title}</h3>
        <p className="mt-2 text-sm text-white sm:mt-3 md:mt-4 md:max-w-140">
          {desc}
        </p>
      </div>
      <div className="relative flex-1 translate-y-6">
        <Image
          src={img}
          alt="Banner image"
          width={isAdmin ? 250 : 175}
          height={250}
          className="object-contain ml-auto"
        />
      </div>
    </div>
  );
};
