import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "../utils";

interface SkeletonLoaderProperties {
  variant?: "card" | "table" | "list" | "form" | "chart";
  count?: number;
  className?: string;
}

export function SkeletonLoader({
  variant = "card",
  count = 1,
  className,
}: SkeletonLoaderProperties) {
  const renderSkeleton = () => {
    switch (variant) {
      case "card": {
        return (
          <div className={cn("space-y-4", className)}>
            {Array.from({ length: count }).map((_, index) => (
              <div key={index} className="min-h-[156px] rounded-lg border p-2">
                <Skeleton className="h-[140px] w-full" />
              </div>
            ))}
          </div>
        );
      }

      case "table": {
        return (
          <div className={cn("space-y-2", className)}>
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: count }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        );
      }

      case "list": {
        return (
          <div className={cn("space-y-3", className)}>
            {Array.from({ length: count }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        );
      }

      case "form": {
        return (
          <div className={cn("space-y-4", className)}>
            {Array.from({ length: count }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        );
      }

      case "chart": {
        return (
          <div className={cn("w-full", className)}>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        );
      }

      default: {
        return null;
      }
    }
  };

  return renderSkeleton();
}
