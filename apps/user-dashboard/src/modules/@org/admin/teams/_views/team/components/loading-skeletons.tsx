import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { Skeleton } from "@/components/ui/skeleton";

export const HeaderSkeleton = () => {
  return (
    <DashboardHeader
      title="Teams"
      subtitle="All Teams"
      actionComponent={
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[80px]" />
          <Skeleton className="h-10 w-[120px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      }
    />
  );
};
