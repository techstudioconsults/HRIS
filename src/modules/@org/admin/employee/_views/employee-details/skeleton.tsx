"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { More } from "iconsax-reactjs";

export const EmployeeDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header with back button skeleton */}
      {/* <div className="flex items-center justify-between pb-4">
        <div className="flex flex-col items-start gap-2">
          <Skeleton className="h-8 w-48" />
          <div className="flex items-center gap-1 text-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div> */}

      <div className="grid grid-cols-1 gap-5 py-5 lg:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
        {/* Employee summary skeleton */}
        <div className="bg-white p-6 lg:p-8 dark:bg-black">
          <div className="flex flex-col items-center justify-between text-center">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="mt-4 h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
            <Skeleton className="mt-2 h-6 w-20 rounded-full" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 gap-5 border-t border-b py-5">
              <div className="flex gap-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-40" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-5 w-48" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-5 w-36" />
            </div>
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-5 w-36" />
            </div>
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-5 w-36" />
            </div>
            <div className="w-full">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Personal Information Section skeleton */}
          <div className="bg-white p-8 dark:bg-black">
            <Skeleton className="mb-4 h-6 w-48" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={`personal-info-${index}`}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-5 w-36" />
                </div>
              ))}
            </div>
          </div>

          {/* Employment Details Section skeleton */}
          <div className="bg-white p-6 dark:bg-black">
            <Skeleton className="mb-4 h-6 w-48" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`employment-${index}`}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-5 w-36" />
                </div>
              ))}
            </div>
          </div>

          {/* Salary & Payroll Details skeleton */}
          <div className="bg-white p-6 dark:bg-black">
            <Skeleton className="mb-4 h-6 w-48" />
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`salary-${index}`} className={index === 3 ? "md:col-span-3" : ""}>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-5 w-36" />
                </div>
              ))}
            </div>
          </div>

          {/* Employee Documents skeleton */}
          <div className="bg-white p-6 dark:bg-black">
            <Skeleton className="mb-4 h-6 w-48" />
            <div className="border-gray-75 flex w-1/2 items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-11 w-8" />
                <div>
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="mt-1 h-4 w-48" />
                </div>
              </div>
              <More className="rotate-90 text-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
