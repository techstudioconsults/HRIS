"use client";

import MainButton from "@/components/shared/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { More } from "iconsax-reactjs";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontal } from "lucide-react";

export const DashboardTable = <T extends DataItem>({
  data,
  columns,
  currentPage = 1,
  onPageChange,
  totalPages = 1,
  itemsPerPage = 10,
  hasNextPage,
  hasPreviousPage,
  rowActions,
  onRowClick,
  showPagination = false,
}: IDashboardTableProperties<T>) => {
  const renderColumn = (column: IColumnDefinition<T>, item: T) => {
    if (!column) return "N/A"; // Handle undefined column
    return column.render
      ? column.render(item[column.accessorKey ?? ""], item)
      : (item[column.accessorKey ?? ""] ?? "N/A");
  };

  return (
    <div className="w-full space-y-4">
      {/* Desktop Table View */}
      <div className="hidden h-full overflow-auto bg-white md:block">
        <Table>
          <TableHeader className={``}>
            <TableRow className={`border-border/50`}>
              {columns.map((column, index) => (
                <TableHead key={index}>{column.header}</TableHead>
              ))}
              {rowActions && <TableHead className="w-[50px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, rowIndex) => (
              <TableRow
                key={rowIndex}
                onClick={() => {
                  if (onRowClick) onRowClick(item);
                }}
                className={cn(
                  "border-border/30 border-b",
                  onRowClick ? "hover:bg-primary/50 dark:hover:bg-low-purple cursor-pointer" : "",
                  "hover:bg-primary/10 text-[16px]",
                )}
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={`${rowIndex}-${colIndex}`}>
                    {column.render ? column.render(item[column.accessorKey], item) : item[column.accessorKey]}
                  </TableCell>
                ))}
                {rowActions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger className={`p-2`}>
                        <More className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className={`bg-white`} align="end">
                        {rowActions(item).map((action: IRowAction<T>, actionIndex: number) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={(event) => {
                              event.stopPropagation();
                              action.onClick(item);
                            }}
                          >
                            {action.icon && <span className="mr-2">{action.icon}</span>}
                            {action.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {data.map((item, index) => (
          <div
            key={index}
            className={cn(
              "group border-default bg-card relative overflow-hidden rounded-lg p-5 transition-all",
              "hover:border-primary/50 hover:shadow-md",
              onRowClick && "cursor-pointer",
            )}
            onClick={() => {
              if (onRowClick) onRowClick(item);
            }}
            aria-label={`View details for item ${item.id || index}`}
          >
            {/* Card Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground text-sm font-medium">{renderColumn(columns[0], item)}</div>
              </div>
              {rowActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 p-0" aria-label="Open menu">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {rowActions(item).map((action: IRowAction<T>, actionIndex: number) => (
                      <DropdownMenuItem
                        key={actionIndex}
                        onClick={(event) => {
                          event.stopPropagation();
                          action.onClick(item);
                        }}
                      >
                        {action.icon && <span className="mr-2">{action.icon}</span>}
                        {action.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Card Content - Other columns */}
            <div className="grid grid-cols-2 gap-4">
              {columns.slice(1, -1).map((column, colIndex) => (
                <div key={colIndex} className="space-y-1">
                  <p className="text-muted-foreground/60 text-xs font-medium uppercase">{column.header}</p>
                  <div className="text-xs font-medium">{renderColumn(column, item)}</div>
                </div>
              ))}
              <span className={`text-xs`}>{columns.at(-1) ? renderColumn(columns.at(-1)!, item) : "N/A"}</span>
            </div>

            {/* Hover Effect Indicator */}
            {onRowClick && (
              <div className="bg-primary/50 absolute inset-x-0 bottom-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </div>
        ))}
      </div>

      {showPagination && (
        <div className="text-muted-foreground flex flex-col-reverse gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className={`flex items-center justify-between md:w-[50%]`}>
            <div>{itemsPerPage} Entries per page</div>
            <div>
              Page {currentPage} of {totalPages}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MainButton
              variant="outline"
              isLeftIconVisible
              size={`lg`}
              icon={<ChevronLeftIcon />}
              className={cn(currentPage === 1 ? "opacity-50" : "", "w-full rounded-sm sm:w-[137px]")}
              onClick={() => onPageChange?.(Number.parseInt(currentPage as unknown as string) - 1)}
              isDisabled={!hasPreviousPage}
            >
              Previous
            </MainButton>
            <MainButton
              variant="outline"
              isRightIconVisible
              size={`lg`}
              icon={<ChevronRightIcon />}
              className={cn(currentPage === totalPages ? "opacity-50" : "", "w-full rounded-sm sm:w-[137px]")}
              onClick={() => {
                onPageChange?.(Number.parseInt(currentPage as unknown as string) + 1);
              }}
              isDisabled={!hasNextPage}
            >
              Next
            </MainButton>
          </div>
        </div>
      )}
    </div>
  );
};
