"use client";

import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
// import empty1 from './empty-state.svg'

import { MainButton } from "../button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { cn } from "../utils";

interface ImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

type EmptyStateVariant = "default" | "icon" | "image";

interface EmptyStateProperties {
  // Visual
  variant?: EmptyStateVariant;
  icon?: ReactNode;
  image?: ImageConfig;
  images?: ImageConfig[]; // Legacy support

  // Content
  title?: string;
  description: string | ReactNode;

  // Actions
  primaryAction?: {
    text: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: "primary" | "outline" | "ghost" | "destructive";
    disabled?: boolean;
    loading?: boolean;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
    icon?: ReactNode;
    variant?: "primary" | "outline" | "ghost" | "destructive";
    disabled?: boolean;
  };
  customActions?: ReactNode;

  // Styling
  className?: string;
  headerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;

  // Legacy support
  button?: {
    text: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  actionButton?: ReactNode;
}

export const EmptyState = ({
  variant = "image",
  icon,
  image,
  images, // Legacy
  title,
  description,
  primaryAction,
  secondaryAction,
  customActions,
  className,
  headerClassName,
  titleClassName,
  descriptionClassName,
  contentClassName,
  button, // Legacy
  actionButton, // Legacy
}: EmptyStateProperties) => {
  // Handle legacy props
  const finalPrimaryAction =
    primaryAction ||
    (button ? { ...button, variant: "primary" as const } : undefined);
  const finalCustomActions = customActions || actionButton;

  const overlayclass =
    primaryAction?.variant === "destructive" ? "bg-danger-50" : undefined;

  return (
    <Empty className={cn("border-none", className)}>
      <EmptyHeader className={headerClassName}>
        {/* Media rendering based on variant or fallback */}
        {variant === "icon" && icon && (
          <EmptyMedia className={cn(overlayclass)} variant="icon">
            {icon}
          </EmptyMedia>
        )}

        {variant === "image" && (image || images) ? (
          <EmptyMedia variant="default">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {image ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width || 200}
                  height={image.height || 200}
                  className="object-contain"
                  priority
                />
              ) : (
                images?.map((img, index) => (
                  <Image
                    key={index}
                    src={img.src}
                    alt={img.alt}
                    width={img.width || 200}
                    height={img.height || 200}
                    className="object-contain"
                    priority
                  />
                ))
              )}
            </div>
          </EmptyMedia>
        ) : variant === "image" && icon ? (
          <EmptyMedia
            className={cn(`bg-${primaryAction?.variant}-50`)}
            variant="icon"
          >
            {icon}
          </EmptyMedia>
        ) : null}

        {/* Title and Description */}
        {title && <EmptyTitle className={titleClassName}>{title}</EmptyTitle>}
        <EmptyDescription className={descriptionClassName}>
          {description}
        </EmptyDescription>
      </EmptyHeader>

      {/* Actions */}
      {(finalPrimaryAction || secondaryAction || finalCustomActions) && (
        <EmptyContent className={contentClassName}>
          {finalCustomActions || (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {finalPrimaryAction && (
                <MainButton
                  onClick={finalPrimaryAction.onClick}
                  variant={finalPrimaryAction.variant || "primary"}
                  isDisabled={finalPrimaryAction.disabled}
                  isLoading={finalPrimaryAction.loading}
                  isLeftIconVisible={!!finalPrimaryAction.icon}
                  className="min-w-[140px]"
                >
                  {finalPrimaryAction.icon && (
                    <span className="mr-2">{finalPrimaryAction.icon}</span>
                  )}
                  {finalPrimaryAction.text}
                </MainButton>
              )}
              {secondaryAction && (
                <MainButton
                  onClick={secondaryAction.onClick}
                  variant={secondaryAction.variant || "outline"}
                  isDisabled={secondaryAction.disabled}
                  isLeftIconVisible={!!secondaryAction.icon}
                  className="min-w-[140px]"
                >
                  {secondaryAction.icon && (
                    <span className="mr-2">{secondaryAction.icon}</span>
                  )}
                  {secondaryAction.text}
                </MainButton>
              )}
            </div>
          )}
        </EmptyContent>
      )}
    </Empty>
  );
};

// Preset variants for common use cases
export const FilteredEmptyState = ({ onReset }: { onReset: () => void }) => (
  <EmptyState
    variant="image"
    image={{
      src: "/empty-state.svg",
      alt: "No filtered results",
      width: 180,
      height: 180,
    }}
    title="No matching results found"
    description="Try adjusting your filters to find what you're looking for."
    primaryAction={{
      text: "Reset Filters",
      onClick: onReset,
      variant: "primary",
    }}
  />
);

export const NoDataEmptyState = ({
  title = "No data available",
  description,
  onAction,
  actionText = "Add New",
  actionIcon,
}: {
  title?: string;
  description: string;
  onAction?: () => void;
  actionText?: string;
  actionIcon?: ReactNode;
}) => (
  <EmptyState
    variant="image"
    image={{ src: "/empty-state.svg", alt: "No data", width: 180, height: 180 }}
    title={title}
    description={description}
    primaryAction={
      onAction
        ? {
            text: actionText,
            onClick: onAction,
            icon: actionIcon,
            variant: "primary",
          }
        : undefined
    }
  />
);

export const ErrorEmptyState = ({
  title = "Something went wrong",
  description = "We encountered an error while loading your data. Please try again.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry: () => void;
}) => (
  <EmptyState
    className="bg-background mx-auto max-w-xl"
    variant="icon"
    icon={<AlertCircle className="text-destructive" />}
    title={title}
    titleClassName="text"
    description={description}
    descriptionClassName="text-muted-foreground"
    primaryAction={{
      text: "Try Again",
      onClick: onRetry,
      variant: "destructive",
    }}
  />
);

export const SearchEmptyState = ({
  searchTerm,
  onClear,
}: {
  searchTerm?: string;
  onClear: () => void;
}) => (
  <EmptyState
    variant="image"
    image={{
      src: "/empty-state.svg",
      alt: "No search results",
      width: 180,
      height: 180,
    }}
    title="No results found"
    description={
      searchTerm ? (
        <>
          No results found for <strong>&ldquo;{searchTerm}&rdquo;</strong>. Try
          searching with different keywords.
        </>
      ) : (
        "Try searching with different keywords."
      )
    }
    primaryAction={{
      text: "Clear Search",
      onClick: onClear,
      variant: "outline",
    }}
  />
);
