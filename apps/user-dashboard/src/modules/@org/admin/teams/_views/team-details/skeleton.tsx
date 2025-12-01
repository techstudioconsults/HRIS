import { Skeleton } from "@workspace/ui/components/skeleton";
import { TableSkeleton } from "@workspace/ui/lib";

export const TeamDetailsSkeleton = () => {
  return (
    <>
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="min-h-[156px] w-full" />
          ))}
        </div>

        {/* Table Skeleton */}
        <TableSkeleton />
      </div>
    </>
  );
};
