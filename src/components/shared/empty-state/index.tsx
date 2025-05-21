"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";

import empty1 from "~/images/alert.png";
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
    <div
      className={cn(
        "flex min-h-[400px] w-full flex-col items-center justify-center space-y-8 px-4 text-center",
        className,
      )}
    >
      {/* Images container */}
      <div className="flex flex-wrap items-center justify-center gap-4">
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
      <div className="flex flex-col items-center space-y-4">
        {title && <h3 className="text-h5 text-primary font-semibold">{title}</h3>}

        <p className="text-muted-foreground max-w-[500px] text-base font-medium">{description}</p>

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
    images={[{ src: empty1.src, alt: "No filtered results", width: 100, height: 100 }]}
    title="No matching results found"
    description="Try adjusting your date range or status filter to find what you're looking for."
    button={{
      text: "Reset Filters",
      onClick: onReset,
    }}
  />
);
