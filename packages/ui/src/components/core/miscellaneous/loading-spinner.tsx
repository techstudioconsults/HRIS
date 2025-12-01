import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface LoadingSpinnerProperties {
  size?: string | number; // e.g., 'text-sm', 'text-lg'
  color?: string; // e.g., 'text-primary', 'text-secondary'
  speed?: string; // e.g., 'animate-spin', 'animate-spin-slow'
}

export const LoadingSpinner = ({
  size = 18,
  color = "text-primary",
  speed = "animate-spin",
}: LoadingSpinnerProperties) => {
  return (
    <span className={`flex h-8 w-8 items-center justify-center`}>
      <Loader size={size} className={cn(speed, color)} />
    </span>
  );
};
