"use client";

import { Checkbox } from "@workspace/ui/components/checkbox";
import { MainButton } from "@workspace/ui/lib/button";
import { cn } from "@workspace/ui/lib/utils";
// import Image from "next/image";
import { ButtonHTMLAttributes, useTransition } from "react";

interface ActionBannerProperties {
  title: string;
  description: string;
  button: {
    label: string;
    onClick?: () => Promise<void> | void;
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>;
  icon?: string;
  className?: string;
  isCompleted?: boolean;
}

export const ActionBanner = ({
  title,
  description,
  button,
  // icon,
  className,
  isCompleted = false,
}: ActionBannerProperties) => {
  const [isPending, startTransition] = useTransition();
  const { label, className: buttonClassName, onClick, ...buttonProperties } = button;

  const handleClick = () => {
    startTransition(async () => {
      if (!onClick) return;
      await onClick();
    });
  };

  return (
    <div
      className={cn(
        "bg-background flex items-center rounded-[9px] p-6 shadow",
        // "border-low-grey-III border",
        className,
      )}
    >
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Checkbox
            checked={isCompleted}
            className={cn("h-6 w-6 rounded-full border-2", isCompleted ? "bg-primary border-black" : "border-primary")}
          />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <p className="text-foreground !text-sm font-medium">{title}</p>
              {!isCompleted && <p className="text-sm">{description}</p>}
            </div>
          </div>
        </div>

        {!isCompleted && (
          <MainButton
            isLoading={isPending}
            variant="primary"
            className={cn("w-fit", buttonClassName)}
            onClick={handleClick}
            {...buttonProperties}
          >
            {label}
          </MainButton>
        )}
        {/* {icon && !isCompleted && (
          <Image src={icon} alt="" width={178} height={82} className="hidden object-contain sm:block" />
        )} */}
      </div>
    </div>
  );
};
