import { cn } from "@workspace/ui/lib/utils";
import { Diagram } from "iconsax-reactjs";
import Link from "next/link";

// Type definitions
type IconVariant = "success" | "primary" | "warning" | "purple-500";
type TrendDirection = "up" | "down";

interface DashboardCardProperties {
  title: string;
  value: string | number | React.ReactNode;
  percentage?: string;
  icon?: React.ReactNode;
  iconVariant?: IconVariant;
  className?: string;
  actionText?: string;
  actionHref?: string;
  showTrendIcon?: boolean;
  trend?: TrendDirection;
  onAction?: () => void;
  // Text color customization props
  titleColor?: string;
  valueColor?: string;
  percentageColor?: string;
  actionTextColor?: string;
}

// Icon variant styles mapping for better maintainability
const ICON_VARIANT_STYLES: Record<IconVariant, string> = {
  success: "bg-success/10 text-success",
  primary: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  "purple-500": "bg-purple-500/10 text-purple-500",
} as const;

// Trend styles mapping
const TREND_STYLES: Record<TrendDirection, string> = {
  up: "text-success",
  down: "text-danger",
} as const;

/**
 * DashboardCard Component
 *
 * A reusable card component for displaying dashboard metrics with optional icons,
 * percentage changes, trend indicators, and action links.
 *
 * @example
 * ```tsx
 * <DashboardCard
 *   title="Total Users"
 *   value={1234}
 *   percentage="+12%"
 *   icon={<User />}
 *   iconVariant="success"
 *   showTrendIcon
 *   trend="up"
 *   actionText="View details"
 *   onAction={() => console.log('clicked')}
 * />
 * ```
 */
export function DashboardCard({
  title,
  value,
  percentage,
  icon,
  iconVariant = "primary",
  className,
  actionText,
  actionHref,
  onAction,
  showTrendIcon = false,
  trend = "up",
  titleColor,
  valueColor,
  percentageColor,
  actionTextColor,
}: DashboardCardProperties) {
  // Determine if percentage indicates positive change
  const isPositiveChange = percentage?.startsWith("+");

  // Check if footer section should be rendered
  const hasFooterContent = showTrendIcon || percentage || actionText;

  /**
   * Renders the percentage change with optional trend indicator
   */
  const renderPercentage = () => {
    if (!showTrendIcon && !percentage) return null;

    return (
      <div className="flex items-center gap-2">
        {showTrendIcon && (
          <Diagram
            size={16}
            variant={trend === "up" ? "Bold" : "Broken"}
            className={TREND_STYLES[trend]}
            aria-label={`Trend ${trend}`}
          />
        )}
        {percentage && (
          <p
            className={cn(
              "text-sm font-medium",
              percentageColor ? "" : isPositiveChange ? "text-success" : "text-danger",
            )}
            style={percentageColor ? { color: percentageColor } : undefined}
          >
            {percentage}
          </p>
        )}
      </div>
    );
  };

  /**
   * Renders the action link or button
   */
  const renderAction = () => {
    if (!actionText) return null;

    const actionClasses = cn(
      "text-sm font-medium transition-colors hover:underline",
      actionTextColor ? "" : "text-primary hover:text-primary/80",
    );

    const actionStyle = actionTextColor ? { color: actionTextColor } : undefined;

    // If href is provided, use Link component
    if (actionHref) {
      return (
        <Link href={actionHref} className={actionClasses} style={actionStyle}>
          {actionText}
        </Link>
      );
    }

    // Otherwise, use button with onClick
    if (onAction) {
      return (
        <button onClick={onAction} className={actionClasses} style={actionStyle} type="button">
          {actionText}
        </button>
      );
    }

    // Fallback to span if neither href nor onAction is provided
    return (
      <span className={actionClasses} style={actionStyle}>
        {actionText}
      </span>
    );
  };

  return (
    <div className={cn("bg-background min-h-[156px] rounded-xl p-6 shadow", className)}>
      {/* Card Header */}
      <h3 className={cn("text-muted-foreground mb-2 text-sm font-medium", titleColor)}>{title}</h3>

      {/* Card Body */}
      <div className="flex items-center justify-between">
        <div className={cn("text-foreground text-3xl font-semibold", valueColor)}>{value}</div>
        {icon && (
          <div
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
              ICON_VARIANT_STYLES[iconVariant],
            )}
            aria-label={`${title} icon`}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Card Footer */}
      {hasFooterContent && (
        <div className="mt-4 flex items-center justify-between gap-2">
          {renderPercentage()}
          {renderAction()}
        </div>
      )}
    </div>
  );
}
