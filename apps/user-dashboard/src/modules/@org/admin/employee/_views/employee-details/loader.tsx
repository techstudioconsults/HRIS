"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";

export const EmployeeDetailsSkeleton = () => {
  return (
    <div className="grid min-h-[70dvh] grid-cols-1 gap-5 py-5 lg:grid-cols-3">
      <div className="space-y-4">
        <Skeleton className="min-h-[70dvh] w-full" />
      </div>

      <div className="col-span-2 flex flex-col justify-between space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-full w-full" />
        ))}
      </div>
    </div>
  );
};
