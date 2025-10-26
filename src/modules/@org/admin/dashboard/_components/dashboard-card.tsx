import MainButton from "@/components/shared/button";
import { cn } from "@/lib/utils";
import { Diagram } from "iconsax-reactjs";

interface DashboardCardProperties {
  title: string;
  value: string | number | React.ReactNode;
  percentage?: string;
  icon?: React.ReactNode;
  iconVariant?: "success" | "primary" | "warning" | "purple-500";
  className?: string;
  actionText?: string;
  showTrendIcon?: boolean; // New prop to control trend icon visibility
  trend?: "up" | "down"; // New prop to control trend direction
  onAction?: () => void;
  // Text color customization props
  titleColor?: string;
  valueColor?: string;
  percentageColor?: string;
  actionTextColor?: string;
}

export function DashboardCard({
  title,
  value,
  percentage,
  icon,
  iconVariant = "primary",
  className,
  actionText,
  onAction,
  showTrendIcon = false, // Default to false
  trend = "up",
  titleColor,
  valueColor,
  percentageColor,
  actionTextColor,
}: DashboardCardProperties) {
  return (
    <div className={cn("bg-background rounded-xl p-6 shadow transition-all", className)}>
      <h3 className={cn("pb-3 text-sm font-medium", titleColor)}>{title}</h3>
      <div className="flex items-center justify-between">
        <div className={cn("text-3xl font-bold", valueColor)}>{value}</div>
        {icon && (
          <div
            className={cn("flex h-10 w-10 items-center justify-center rounded-full", {
              "bg-success/10 text-success": iconVariant === "success",
              "bg-primary/10 text-primary": iconVariant === "primary",
              "bg-warning/10 text-warning": iconVariant === "warning",
              "bg-purple-500/10 text-purple-500": iconVariant === "purple-500",
            })}
          >
            {icon}
          </div>
        )}
      </div>

      {showTrendIcon ||
        percentage ||
        (actionText && (
          <div className="mt-3 flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                {showTrendIcon && (
                  <Diagram
                    size={16}
                    variant={trend === "up" ? "Bold" : "Broken"}
                    className={trend === "up" ? "text-success" : "text-danger"}
                  />
                )}
                {percentage && (
                  <p
                    className={cn(
                      "text-sm",
                      !percentageColor && (percentage.startsWith("+") ? "text-success" : "text-success"),
                    )}
                    style={percentageColor ? { color: percentageColor } : undefined}
                  >
                    {percentage}
                  </p>
                )}
              </div>
              {actionText && (
                <div style={actionTextColor ? { color: actionTextColor } : undefined}>
                  <MainButton
                    variant="link"
                    size="sm"
                    onClick={onAction}
                    className={cn("p-0 text-sm font-medium hover:underline", !actionTextColor && "text-primary")}
                  >
                    {actionText}
                  </MainButton>
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
