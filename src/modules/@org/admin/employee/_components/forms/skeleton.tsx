import { Skeleton } from "@/components/ui/skeleton";

export const EmployeeFormSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Breadcrumb and Title Skeleton */}
      <div className="flex flex-col items-start gap-2">
        <Skeleton className="h-8 w-[200px]" />
        <div className="flex items-center gap-1 text-sm">
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[120px]" />
        </div>
      </div>

      <div className="space-y-10">
        {/* Personal Information Section Skeleton */}
        <section>
          <Skeleton className="mb-4 h-6 w-[200px]" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Employment Details Section Skeleton */}
        <section>
          <Skeleton className="mb-4 h-6 w-[200px]" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Salary Details Section Skeleton */}
        <section>
          <Skeleton className="mb-4 h-6 w-[200px]" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-14 w-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Documents Section Skeleton */}
        <section>
          <Skeleton className="mb-4 h-6 w-[200px]" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </section>
      </div>

      {/* Form Actions Skeleton */}
      <div className="mt-6 flex justify-start gap-4">
        <Skeleton className="h-10 w-[100px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>
    </div>
  );
};
