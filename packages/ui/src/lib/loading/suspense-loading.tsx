"use client";

import { LucideLoader } from "lucide-react";
import { cn } from "../utils";
import { Logo } from "../logo";

interface SuspenseLoadingProperties {
  text?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SuspenseLoading({
  text,
  className,
  size = "md",
}: SuspenseLoadingProperties) {
  const sizeClasses = {
    sm: "!h-[30dvh]",
    md: "!h-[50dvh]",
    lg: "!h-[70dvh]",
  };

  return (
    <div
      className={cn(
        "bg-background flex flex-col items-center justify-center rounded-md shadow dark:bg-[#000000]",
        sizeClasses[size],
        className,
      )}
    >
      <div className="flex flex-col items-center gap-2">
        <LucideLoader className="text-primary animate-spin" />
        <Logo width={100} height={47} />
        <div className="flex items-center gap-1">
          <p className="text-sm font-medium">{text || "Loading..."}</p>
        </div>
      </div>
    </div>
  );
}
