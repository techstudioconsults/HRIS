"use client";

import { AlertCircle } from "lucide-react";
import { Logo } from "../logo";
import { cn } from "../utils";
import { Button } from "@workspace/ui/components/button";

interface SuspenseErrorProperties {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  showLogo?: boolean;
}

export function SuspenseError({
  title = "Something went wrong!",
  message = "Unable to load content. Please try again.",
  onRetry,
  className,
  showLogo = true,
}: SuspenseErrorProperties) {
  return (
    <div
      className={cn(
        "bg-background flex !h-[50dvh] flex-col items-center justify-center rounded-md shadow dark:bg-[#000000]",
        className,
      )}
    >
      <div className="flex max-w-md flex-col items-center gap-4 px-4 text-center">
        <AlertCircle className="text-destructive h-10 w-10" />
        {showLogo && <Logo width={100} height={47} />}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{message}</p>
        </div>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="default"
            size="sm"
            className="mt-2"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
