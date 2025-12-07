import { Skeleton } from "@/components/ui/skeleton";

export const EmployeeFormSkeleton = () => {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />

      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full" />
        </div>
      ))}

      <Skeleton className="h-10 w-32" />
    </div>
  );
};
