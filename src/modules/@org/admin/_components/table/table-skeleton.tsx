"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableSkeletonProperties {
  // Table structure
  columns?: number;
  rows?: number;

  // Features to show skeleton for
  enableDragAndDrop?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  showAddButton?: boolean;
  showPagination?: boolean;
  showTabs?: boolean;

  // Layout options
  mobileCardView?: boolean;
  className?: string;
}

export function TableSkeleton({
  columns = 6,
  rows = 8,
  enableDragAndDrop = false,
  enableRowSelection = false,
  enableColumnVisibility = false,
  showAddButton = false,
  showPagination = false,
  showTabs = false,
  mobileCardView = true,
  className,
}: TableSkeletonProperties) {
  const totalColumns = columns + (enableDragAndDrop ? 1 : 0) + (enableRowSelection ? 1 : 0) + 1; // +1 for actions column

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Header Skeleton */}
      <div className="flex items-center justify-between px-4 lg:px-6">
        {showTabs ? (
          <>
            {/* Mobile tab selector */}
            <Skeleton className="h-9 w-32 @4xl/main:hidden" />
            {/* Desktop tabs */}
            <div className="hidden gap-2 @4xl/main:flex">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-24" />
              ))}
            </div>
          </>
        ) : (
          <div /> // Empty div to maintain layout
        )}

        <div className="flex items-center gap-2">
          {enableColumnVisibility && <Skeleton className="h-9 w-32" />}
          {showAddButton && <Skeleton className="h-9 w-24" />}
        </div>
      </div>

      {/* Desktop Table Skeleton */}
      <div className="bg-background hidden h-full overflow-auto rounded-lg shadow md:block">
        <Table>
          <TableHeader className="!bg-muted sticky top-0 z-10">
            <TableRow className="border-border/50">
              {Array.from({ length: totalColumns }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-4 w-20" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex} className="border-border/30 border-b">
                {Array.from({ length: totalColumns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="flex items-center gap-2 py-1.5">
                      {/* Different skeleton widths for variety */}
                      <Skeleton
                        className={cn(
                          "h-3",
                          colIndex === 0
                            ? "w-full" // First column - names/titles
                            : colIndex === 1
                              ? "w-full" // Second column - shorter content
                              : colIndex === 2
                                ? "w-full" // Third column - medium content
                                : colIndex === totalColumns - 1
                                  ? "w-8" // Actions column - icon
                                  : "w-20", // Default width
                        )}
                      />
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card Skeleton */}
      {mobileCardView && (
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {Array.from({ length: rows }).map((_, index) => (
            <div
              key={index}
              className="group border-default bg-card relative overflow-hidden rounded-lg p-5 transition-all"
            >
              {/* Card Header */}
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>

              {/* Card Content */}
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: Math.min(columns - 1, 4) }).map((_, colIndex) => (
                  <div key={colIndex} className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ))}
                <div className="col-span-2">
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="text-muted-foreground flex flex-col-reverse gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between md:w-[50%]">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-32 rounded-sm" />
            <Skeleton className="h-10 w-32 rounded-sm" />
          </div>
        </div>
      )}
    </div>
  );
}

// Specialized skeleton components for different table types
export function EmployeeTableSkeleton() {
  return (
    <TableSkeleton
      columns={5}
      rows={10}
      enableRowSelection={true}
      enableColumnVisibility={true}
      showAddButton={true}
      showPagination={true}
      mobileCardView={true}
    />
  );
}

export function PayrollTableSkeleton() {
  return (
    <TableSkeleton
      columns={6}
      rows={8}
      enableRowSelection={true}
      enableColumnVisibility={true}
      showAddButton={true}
      showPagination={true}
      mobileCardView={true}
    />
  );
}

export function TeamsTableSkeleton() {
  return (
    <TableSkeleton
      columns={4}
      rows={6}
      enableRowSelection={false}
      enableColumnVisibility={true}
      showAddButton={true}
      showPagination={true}
      showTabs={true}
      mobileCardView={true}
    />
  );
}

// Dashboard table skeleton with drag and drop
export function DashboardTableSkeleton() {
  return (
    <TableSkeleton
      columns={6}
      rows={5}
      enableDragAndDrop={true}
      enableRowSelection={true}
      enableColumnVisibility={true}
      showAddButton={true}
      showTabs={true}
      mobileCardView={false}
    />
  );
}
