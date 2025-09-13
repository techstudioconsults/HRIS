// "use client";

// import { Skeleton } from "@/components/ui/skeleton";
// import { MoreHorizontal } from "lucide-react";

// export const DashboardTableSkeleton = ({
//   columns = 5,
//   rows = 5,
//   showPagination = false,
//   rowActions = false,
// }: {
//   columns?: number;
//   rows?: number;
//   showPagination?: boolean;
//   rowActions?: boolean;
// }) => {
//   return (
//     <div className="w-full space-y-4">
//       {/* Desktop Table Skeleton */}
//       <div className="hidden h-full overflow-auto bg-white md:block">
//         <div className="rounded-lg border">
//           <div className="grid grid-cols-12 gap-4 border-b p-4">
//             {Array.from({ length: columns }).map((_, index) => (
//               <Skeleton key={`header-${index}`} className="h-6" />
//             ))}
//             {rowActions && <Skeleton className="h-6 w-10" />}
//           </div>

//           <div className="divide-y">
//             {Array.from({ length: rows }).map((_, rowIndex) => (
//               <div key={`row-${rowIndex}`} className="grid grid-cols-12 gap-4 p-4">
//                 {Array.from({ length: columns }).map((_, colIndex) => (
//                   <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-5" />
//                 ))}
//                 {rowActions && (
//                   <div className="flex justify-end">
//                     <MoreHorizontal className="h-4 w-4 text-gray-300" />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Mobile Card Skeleton */}
//       <div className="grid grid-cols-1 gap-4 md:hidden">
//         {Array.from({ length: rows }).map((_, index) => (
//           <div key={`mobile-card-${index}`} className="rounded-lg border p-4">
//             <div className="mb-4 flex items-center justify-between">
//               <Skeleton className="h-5 w-1/3" />
//               {rowActions && <MoreHorizontal className="h-4 w-4 text-gray-300" />}
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               {Array.from({ length: columns - 1 }).map((_, colIndex) => (
//                 <div key={`mobile-cell-${index}-${colIndex}`} className="space-y-2">
//                   <Skeleton className="h-3 w-20" />
//                   <Skeleton className="h-4 w-full" />
//                 </div>
//               ))}
//               <Skeleton className="h-4 w-full" />
//             </div>
//           </div>
//         ))}
//       </div>

//       {showPagination && (
//         <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center justify-between md:w-[50%]">
//             <Skeleton className="h-5 w-24" />
//             <Skeleton className="h-5 w-24" />
//           </div>
//           <div className="flex items-center gap-2">
//             <Skeleton className="h-10 w-[137px]" />
//             <Skeleton className="h-10 w-[137px]" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export const DashboardTableSkeleton = ({
  columns = 5,
  rows = 5,
  showPagination = false,
  rowActions = false,
}: {
  columns?: number;
  rows?: number;
  showPagination?: boolean;
  rowActions?: boolean;
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Desktop Table Skeleton */}
      <div className="hidden h-full overflow-auto bg-white md:block">
        <div className="rounded-lg border">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-4 border-b p-4">
            {Array.from({ length: columns }).map((_, index) => (
              <Skeleton key={`header-${index}`} className="h-6 w-1/2" />
            ))}
            {rowActions && <Skeleton className="h-6 w-10" />}
          </div>

          {/* Table Body */}
          <div className="divide-y">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="grid grid-cols-5 gap-4 p-4">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <div key={`cell-${rowIndex}-${colIndex}`} className="flex flex-col gap-1">
                    {colIndex === 0 ? (
                      <div className={`flex items-center gap-3`}>
                        <div>
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                        <Skeleton className="h-3 w-1/2 rounded-full" />
                      </div>
                    ) : (
                      <div className={`flex h-full items-center`}>
                        <Skeleton className="h-3 w-1/2" />
                        {/* <Skeleton className="h-5 w-full" /> */}
                      </div>
                    )}
                  </div>
                ))}
                {rowActions && (
                  <div className="flex justify-end">
                    <MoreHorizontal className="h-4 w-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Card Skeleton */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={`mobile-card-${index}`} className="rounded-lg border p-4">
            {/* Card Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-24" />
              </div>
              {rowActions && <MoreHorizontal className="h-4 w-4 text-gray-300" />}
            </div>

            {/* Card Content */}
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: columns - 1 }).map((_, colIndex) => (
                <div key={`mobile-cell-${index}-${colIndex}`} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
              <Skeleton className="h-4 w-full" />
            </div>

            {/* Hover Effect Indicator */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 opacity-0" />
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      {showPagination && (
        <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between md:w-[50%]">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-[137px] items-center justify-center gap-2 rounded-sm border px-4 py-2">
              <ChevronLeft className="h-4 w-4 text-gray-300" />
              <Skeleton className="h-4 w-12" />
            </div>
            <div className="flex h-10 w-[137px] items-center justify-center gap-2 rounded-sm border px-4 py-2">
              <Skeleton className="h-4 w-12" />
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
