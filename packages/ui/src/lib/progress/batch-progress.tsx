import * as React from "react";
import { cn } from "../utils";
import { Progress } from "@workspace/ui/components/progress";

export interface BatchProgressProperties {
  /** Current progress percentage 0 - 100 */
  progress: number;
  /** Status or descriptive text (will be truncated) */
  status?: string;
  /** Whether to render the component */
  show?: boolean;
  /** Optional wrapper class name */
  className?: string;
  /** Optional progress bar class name */
  barClassName?: string;
  /** If true, hides numeric percentage visually but keeps it for screen readers */
  hidePercentage?: boolean;
  /** ARIA live mode for status updates */
  ariaLive?: "polite" | "assertive" | "off";
  /** Size variant */
  size?: "sm" | "md";
}

/**
 * Reusable batch submission progress indicator.
 * Displays percentage, status text, and progress bar. Supports accessibility via ARIA live regions.
 * Intended for long-running multi-item operations (e.g., creating multiple roles, importing records, bulk updates).
 *
 * Props:
 * - progress: number (0-100) current completion percent.
 * - status: string describing current step or summary.
 * - show: boolean controls visibility without unmounting parent logic.
 * - hidePercentage: visually hides percentage while keeping it for screen readers.
 * - ariaLive: politeness level for announcing status changes.
 * - size: visual sizing of text/bar ('sm' | 'md').
 */
export const BatchProgress: React.FC<BatchProgressProperties> = ({
  progress,
  status = "",
  show = true,
  className,
  barClassName,
  hidePercentage = false,
  ariaLive = "polite",
  size = "sm",
}) => {
  if (!show) return null;

  const clamped = Number.isFinite(progress)
    ? Math.min(100, Math.max(0, progress))
    : 0;
  const percentageLabel = `${Math.round(clamped)}%`;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        size === "md" && "text-sm",
        className,
      )}
      role="group"
      aria-label="Batch operation progress"
    >
      <div
        className={cn(
          "text-muted-foreground flex items-center justify-between",
          size === "md" ? "text-sm" : "text-xs",
        )}
        aria-live={ariaLive}
        aria-atomic="true"
      >
        <span
          className={cn("font-medium", hidePercentage && "sr-only")}
          aria-label={percentageLabel}
        >
          {percentageLabel}
        </span>
        <span
          className="max-w-[60%] truncate text-right font-medium"
          title={status}
        >
          {status}
        </span>
      </div>
      <Progress
        value={clamped}
        className={cn("h-1 flex-1", size === "md" && "h-2", barClassName)}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={"Progress " + percentageLabel}
      />
    </div>
  );
};

export default BatchProgress;
