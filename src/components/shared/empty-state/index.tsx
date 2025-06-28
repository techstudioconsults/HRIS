"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

import empty1 from "~/images/empty-state.svg";
import MainButton from "../button";

interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface EmptyStateProperties {
  images?: ImageConfig[];
  title?: string;
  description: string;
  button?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
  actionButton?: React.ReactNode;
}

export const EmptyState = ({
  images,
  title,
  description,
  button,
  actionButton,
  className = "",
}: EmptyStateProperties) => {
  return (
    <div className={cn("flex min-h-[400px] w-full flex-col items-center justify-center px-4 text-center", className)}>
      {/* Images container */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {images?.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width || 240}
              height={image.height || 160}
              className="object-contain"
              priority
            />
          </div>
        ))}
      </div>

      {/* Content container */}
      <div className="flex flex-col items-center">
        {title && <p className="text-xl font-semibold">{title}</p>}
        <p className="my-2 max-w-[400px] text-gray-500">{description}</p>
        {button ? (
          <MainButton
            onClick={button.onClick}
            variant="primary"
            size="xl"
            className=""
            isLeftIconVisible
            icon={button.icon}
          >
            {button.text}
          </MainButton>
        ) : (
          actionButton
        )}
      </div>
    </div>
  );
};

export const FilteredEmptyState = ({ onReset }: { onReset: () => void }) => (
  <EmptyState
    images={[{ src: empty1.src, alt: "No filtered results", width: 100, height: 100 }]}
    title="No matching results found"
    description="Try adjusting your date range or status filter to find what you're looking for."
    button={{
      text: "Reset Filters",
      onClick: onReset,
    }}
  />
);
