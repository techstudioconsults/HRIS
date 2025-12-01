import { Skeleton } from "@workspace/ui/components/skeleton";

export function TableSkeleton() {
  // Calculate total columns including optional ones
  //   const totalColumns = columns + (showDragColumn ? 1 : 0) + (showSelectColumn ? 1 : 0) + (showActionsColumn ? 1 : 0);

  return (
    <section className="flex min-h-[76dvh] w-full flex-col justify-between gap-4">
      <div>
        <Skeleton className="mb-4 h-[70dvh] w-full" />
      </div>
      <div className="text-muted-foreground flex flex-col-reverse gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between md:w-[50%]">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-full rounded-sm sm:w-[137px]" />
          <Skeleton className="h-10 w-full rounded-sm sm:w-[137px]" />
        </div>
      </div>
    </section>
  );
}
