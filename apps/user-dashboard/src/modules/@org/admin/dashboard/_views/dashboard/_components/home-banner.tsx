"use client";

import { cn } from "@workspace/ui/lib/utils";
import Image from "next/image";

interface DashboardBannerProperties {
  img: string;
  title: string;
  desc: string;
}

export const DashboardBanner = ({ img, title, desc }: DashboardBannerProperties) => {
  return (
    <div
      className={cn(
        "bg-primary flex flex-col items-center gap-2 rounded-[9px] shadow md:items-center md:justify-between xl:flex-row",
        "bg-cover bg-right bg-no-repeat",
        "sm:p-8",
        `bg-[url(/images/lines.svg)]`,
      )}
    >
      <div className="w-full text-center md:w-auto xl:text-left">
        <h3 className="text-2xl leading-10 text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-50 sm:mt-3 md:mt-4 md:max-w-[35rem]">{desc}</p>
      </div>
      <div className="relative h-[200px] w-[180px] shrink-0 sm:w-[220px] md:w-[200px]">
        <Image src={img} alt="Banner image" fill className="object-contain" />
      </div>
    </div>
  );
};
