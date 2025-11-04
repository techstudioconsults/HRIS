"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

import empty1 from "~/images/empty-state.svg";
import SkiButton from "../button";

interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

interface EmptyStateProperties {
  images: ImageConfig[];
  title?: string;
  description: string;
  button?: {
    text: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
  descriptionClassName?: string;
  titleClassName?: string;
  actionButton?: React.ReactNode;
}

export const EmptyState = ({
  images,
  title,
  description,
  button,
  actionButton,
  className = "",
  descriptionClassName = "",
  titleClassName = "",
}: EmptyStateProperties) => {
  return (
    <div
      className={cn("mb-4 flex min-h-[400px] w-full flex-col items-center justify-center px-4 text-center", className)}
    >
      {/* Images container */}
      <div className="flex flex-wrap items-center justify-center">
        {images.map((image, index) => (
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
        {title && <h3 className={cn(`text-h5 text-primary font-semibold`, titleClassName)}>{title}</h3>}
        <p className={cn("text-muted-foreground font-medium", descriptionClassName)}>{description}</p>
        {button ? (
          <SkiButton onClick={button.onClick} variant="primary" size="xl" className="mt-6">
            {button.icon && <span className="mr-2">{button.icon}</span>}
            {button.text}
          </SkiButton>
        ) : (
          actionButton
        )}
      </div>
    </div>
  );
};

export const FilteredEmptyState = ({ onReset }: { onReset: () => void }) => (
  <EmptyState
    images={[{ src: empty1.src, alt: "No filtered results", width: 50, height: 50 }]}
    title="No matching results found"
    description="Try adjusting your date range or status filter to find what you're looking for."
    className={`space-y-0`}
    titleClassName={`!text-2xl text-primary font-semibold`}
    descriptionClassName={`text-muted-foreground max-w-[500px] font-medium`}
    button={{
      text: "Reset Filters",
      onClick: onReset,
    }}
  />
);
