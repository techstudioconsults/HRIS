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
}: DashboardCardProperties) {
  return (
    <div className={cn("bg-background rounded-xl p-6 transition-all hover:shadow-md", className)}>
      <h3 className="text-muted-foreground pb-3 text-sm font-medium">{title}</h3>
      <div className="flex items-center justify-between">
        <p className="text-3xl font-bold">{value}</p>
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
                  <p className={cn("text-sm", percentage.startsWith("+") ? "text-success" : "text-success")}>
                    {percentage}
                  </p>
                )}
              </div>
              {actionText && (
                <MainButton
                  variant="link"
                  size="sm"
                  onClick={onAction}
                  className="text-primary p-0 text-sm font-medium hover:underline"
                >
                  {actionText}
                </MainButton>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
