
import { cn } from "@workspace/ui/lib/utils";
import { ReactNode } from "react";

interface CardGroupProperties {
  children: ReactNode;
  className?: string;
  cols?: 2 | 3 | 4;
}

export function CardGroup({ children, className, cols = 4 }: CardGroupProperties) {
  return (
    <div
      className={cn(
        "grid gap-4",
        {
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4": cols === 4,
          "grid-cols-1 sm:grid-cols-3": cols === 3,
          "grid-cols-1 sm:grid-cols-2": cols === 2,
        },
        className,
      )}
    >
      {children}
    </div>
  );
}
