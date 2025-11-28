"use client";

import { Skeleton } from "@/components/ui/skeleton";
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
  rows = 8,

  showPagination = false,
  showTabs = false,

  className,
}: TableSkeletonProperties) {
  return (
    <div className={cn("w-full space-y-4", className)}>
      {showTabs && <Skeleton className="h-10 w-full" />}

      <div className="bg-background rounded-lg">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2 p-2">
          {Array.from({ length: rows }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </div>

      {showPagination && <Skeleton className="h-10 w-full" />}
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
