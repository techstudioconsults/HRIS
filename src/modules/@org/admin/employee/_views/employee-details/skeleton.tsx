"use client";

import { Skeleton } from "@/components/ui/skeleton";

export const EmployeeDetailsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
      <div className="space-y-4">
        <Skeleton className="mx-auto h-32 w-32 rounded-full" />
        <Skeleton className="h-40 w-full" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
};
