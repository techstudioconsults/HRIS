"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconArrowDown,
  IconArrowsSort,
  IconArrowUp,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconGripVertical,
  IconLayoutColumns,
  IconPlus,
} from "@tabler/icons-react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import * as React from "react";
import { z } from "zod";
import { cn } from "../utils";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { MainButton } from "../button";
import { Label } from "@workspace/ui/components/label";
import { Badge } from "@workspace/ui/components/badge";

// Base type for data items - must have an id
export type DataItem = Record<string, unknown> & { id: string | number };

// Column definition interface
export interface IColumnDefinition<T extends DataItem> {
  header: string;
  accessorKey: keyof T;
  render?: (value: unknown, row: T) => React.ReactNode;
}

// Row action interface
export interface IRowAction<T extends DataItem> {
  label?: string;
  onClick?: (row: T) => void;
  icon?: React.ReactNode;
  kbd?: string; // keyboard shortcut hint (display only)
  type?: "action" | "separator"; // separator renders a visual divider
  variant?: "destructive" | "default"; // styling hint
  ariaLabel?: string; // accessible label for assistive tech
}

// Generic types for the refactored table
interface IAdvancedTableProperties<T extends DataItem> {
  data: T[];
  columns: IColumnDefinition<T>[];
  // Optional features
  enableDragAndDrop?: boolean;
  enableRowSelection?: boolean;
  enableColumnVisibility?: boolean;
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  // Pagination
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalPages?: number;
  itemsPerPage?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  // Row actions
  rowActions?: (row: T) => IRowAction<T>[];
  onRowClick?: (row: T) => void;
  // Custom features
  showPagination?: boolean;
  showColumnCustomization?: boolean;
  showAddButton?: boolean;
  addButtonText?: string;
  onAddClick?: () => void;
  // Tabs for different views
  tabs?: Array<{
    value: string;
    label: string;
    badge?: string | number;
  }>;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
  // Mobile responsive
  mobileCardView?: boolean;
  // Custom renderers
  customRowRenderer?: (row: Row<T>) => React.ReactNode;
  customHeaderRenderer?: () => React.ReactNode;
  customFooterRenderer?: () => React.ReactNode;
  emptyState?: React.ReactNode;
}

export const schema = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
});

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  });

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  );
}

// Helper function to convert IColumnDefinition to TanStack ColumnDef
function convertColumnsToTanStackFormat<T extends DataItem>(
  columns: IColumnDefinition<T>[],
  enableDragAndDrop: boolean,
  enableRowSelection: boolean,
  enableSorting: boolean,
): ColumnDef<T>[] {
  const columnDefs: ColumnDef<T>[] = [];

  // Add drag column if enabled
  if (enableDragAndDrop) {
    columnDefs.push({
      id: "drag",
      header: () => null,
      cell: ({ row }) => (
        <DragHandle
          id={((row.original as Record<string, unknown>).id as number) || 0}
        />
      ),
      size: 40,
      enableSorting: false,
    });
  }

  // Add select column if enabled
  if (enableRowSelection) {
    columnDefs.push({
      id: "select",
      header: ({ table }) => (
        <div className="flex w-fit items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="border-primary border bg-white"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex w-fit items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="border-primary border bg-white"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    });
  }

  // Convert IColumnDefinition to ColumnDef
  for (const column of columns) {
    columnDefs.push({
      accessorKey: column.accessorKey as string,
      header: ({ column: tanstackColumn }) => {
        if (!enableSorting) {
          return <div>{column.header}</div>;
        }

        return (
          <p
            onClick={() =>
              tanstackColumn.toggleSorting(
                tanstackColumn.getIsSorted() === "asc",
              )
            }
            className="flex h-8 cursor-pointer items-center font-semibold hover:bg-transparent"
          >
            <span>{column.header}</span>
            {tanstackColumn.getIsSorted() === "asc" ? (
              <IconArrowUp className="ml-2 h-4 w-4" />
            ) : tanstackColumn.getIsSorted() === "desc" ? (
              <IconArrowDown className="ml-2 h-4 w-4" />
            ) : (
              <IconArrowsSort className="ml-2 h-4 w-4 opacity-50" />
            )}
          </p>
        );
      },
      cell: ({ row }) => {
        const value = row.original[column.accessorKey];
        return column.render
          ? column.render(value, row.original)
          : (value ?? "N/A");
      },
      enableSorting: enableSorting,
    });
  }

  return columnDefs;
}

function DraggableRow<T extends DataItem>({
  row,
  rowActions,
  onRowClick,
}: {
  row: Row<T>;
  rowActions?: (row: T) => IRowAction<T>[];
  onRowClick?: (row: T) => void;
}) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: (row.original as Record<string, unknown>).id as UniqueIdentifier,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn(
        "relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80",
        "border-border/30 border-b",
        onRowClick ? "hover:bg-primary/10 cursor-pointer" : "",
        "text-[16px]",
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      onClick={() => onRowClick?.(row.original)}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
      {rowActions && (
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger className="p-2">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white" align="end">
              {rowActions(row.original).map((action, actionIndex) => {
                if (action.type === "separator") {
                  return (
                    <DropdownMenuItem
                      key={actionIndex}
                      disabled
                      className="pointer-events-none"
                      data-type="separator"
                    >
                      <div className="bg-border mx-1 h-px w-full" />
                    </DropdownMenuItem>
                  );
                }
                return (
                  <DropdownMenuItem
                    key={actionIndex}
                    onClick={(event) => {
                      event.stopPropagation();
                      action.onClick?.(row.original);
                    }}
                    aria-label={action.ariaLabel || action.label}
                    className={cn(
                      action.variant === "destructive" &&
                        "text-destructive focus:text-destructive",
                    )}
                  >
                    {action.icon && <span className="mr-2">{action.icon}</span>}
                    {action.label}
                    {action.kbd && (
                      <span className="ml-auto font-mono text-[10px] opacity-60">
                        {action.kbd}
                      </span>
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      )}
    </TableRow>
  );
}

// Generic Advanced Data Table Component
export function AdvancedDataTable<T extends DataItem>({
  data: initialData,
  columns: inputColumns,
  enableDragAndDrop = false,
  enableRowSelection = false,
  enableColumnVisibility = true,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = false,
  currentPage = 1,
  onPageChange,
  totalPages = 1,
  itemsPerPage = 10,
  hasNextPage = false,
  hasPreviousPage = false,
  rowActions,
  onRowClick,
  showPagination = false,
  showColumnCustomization = true,
  showAddButton = false,
  addButtonText = "Add Item",
  onAddClick,
  tabs,
  defaultTab = "primaryOutline",
  onTabChange,
  mobileCardView = true,
  customRowRenderer: _customRowRenderer, // eslint-disable-line @typescript-eslint/no-unused-vars
  customHeaderRenderer,
  customFooterRenderer,
  emptyState,
}: IAdvancedTableProperties<T>) {
  const [data, setData] = React.useState(() => initialData);
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: itemsPerPage,
  });
  const [activeTab, setActiveTab] = React.useState(defaultTab);
  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // Keep table data in sync with incoming props to avoid stale rows across server pages
  React.useEffect(() => {
    setData(initialData);
    // Clear any previous selection when dataset changes (e.g., switching pages)
    setRowSelection({});
  }, [initialData]);

  // Keep internal pageSize aligned with server-provided itemsPerPage
  React.useEffect(() => {
    setPagination((previous) => ({ ...previous, pageSize: itemsPerPage }));
  }, [itemsPerPage]);
  // Convert IColumnDefinition to TanStack ColumnDef
  const columns = React.useMemo(
    () =>
      convertColumnsToTanStackFormat(
        inputColumns,
        enableDragAndDrop,
        enableRowSelection,
        enableSorting,
      ),
    [inputColumns, enableDragAndDrop, enableRowSelection, enableSorting],
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () =>
      data?.map(
        (item) => (item as Record<string, unknown>).id as UniqueIdentifier,
      ) || [],
    [data],
  );

  const table = useReactTable<T>({
    data,
    columns,
    state: {
      ...(enableSorting && { sorting }),
      ...(enableColumnVisibility && { columnVisibility }),
      ...(enableRowSelection && { rowSelection }),
      ...(enableFiltering && { columnFilters }),
      ...(enablePagination && { pagination }),
    },
    getRowId: (row) =>
      (row as Record<string, unknown>).id?.toString() ||
      Math.random().toString(),
    enableRowSelection: enableRowSelection,
    enableSorting: enableSorting,
    enableColumnFilters: enableFiltering,
    ...(enableRowSelection && { onRowSelectionChange: setRowSelection }),
    ...(enableSorting && { onSortingChange: setSorting }),
    ...(enableFiltering && { onColumnFiltersChange: setColumnFilters }),
    ...(enableColumnVisibility && {
      onColumnVisibilityChange: setColumnVisibility,
    }),
    ...(enablePagination && { onPaginationChange: setPagination }),
    getCoreRowModel: getCoreRowModel(),
    ...(enableFiltering && { getFilteredRowModel: getFilteredRowModel() }),
    ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
    ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
    ...(enableFiltering && { getFacetedRowModel: getFacetedRowModel() }),
    ...(enableFiltering && {
      getFacetedUniqueValues: getFacetedUniqueValues(),
    }),
  });

  function handleDragEnd(event: DragEndEvent) {
    if (!enableDragAndDrop) return;

    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  const renderColumn = (
    column: IColumnDefinition<T>,
    item: T,
  ): React.ReactNode => {
    if (!column) return "N/A";
    const value = item[column.accessorKey];
    if (column.render) {
      return column.render(value, item);
    }
    // Handle different value types safely
    if (value === null || value === undefined) {
      return "N/A";
    }
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      return String(value);
    }
    return "N/A";
  };

  const renderHeader = () => {
    if (customHeaderRenderer) {
      return customHeaderRenderer();
    }

    return (
      <div className="flex items-center justify-between px-4 lg:px-6">
        {tabs && tabs.length > 0 ? (
          <>
            <Label htmlFor="view-selector" className="sr-only">
              View
            </Label>
            <Select value={activeTab} onValueChange={handleTabChange}>
              <SelectTrigger
                className="flex w-fit @4xl/main:hidden"
                size="sm"
                id="view-selector"
              >
                <SelectValue placeholder="Select a view" />
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.value} value={tab.value}>
                    {tab.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                  {tab.badge && <Badge variant="secondary">{tab.badge}</Badge>}
                </TabsTrigger>
              ))}
            </TabsList>
          </>
        ) : null}

        <div className="flex items-center gap-2">
          {showColumnCustomization && enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="primaryOutline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Customize Columns</span>
                  <span className="lg:hidden">Columns</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      column.accessorFn !== undefined && column.getCanHide(),
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {showAddButton && onAddClick && (
            <Button variant="primaryOutline" size="sm" onClick={onAddClick}>
              <IconPlus />
              <span className="hidden lg:inline">{addButtonText}</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-[76dvh] w-full flex-col justify-between gap-4">
      <div>
        {renderHeader()}
        {/* Desktop Table View */}
        <div className="bg-background hidden h-full overflow-auto rounded-lg shadow md:block">
          {enableDragAndDrop ? (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="!bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id} className="border-border/50">
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                      {rowActions && (
                        <TableHead className="w-[50px]"></TableHead>
                      )}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow
                          key={row.id}
                          row={row}
                          rowActions={rowActions}
                          onRowClick={onRowClick}
                        />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length + (rowActions ? 1 : 0)}
                        className="h-24 text-center"
                      >
                        {emptyState || "No results."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          ) : (
            <Table>
              <TableHeader className="!bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-border/50">
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                    {rowActions && <TableHead className="w-[50px]"></TableHead>}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => onRowClick?.(row.original)}
                      className={cn(
                        "border-border/30 border-b",
                        onRowClick ? "hover:bg-primary/10 cursor-pointer" : "",
                        "text-[16px]",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                      {rowActions && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="cursor-pointer p-2">
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              className="bg-background min-w-[15rem] shadow-none"
                              align="end"
                            >
                              {rowActions(row.original).map(
                                (action, actionIndex) => {
                                  if (action.type === "separator") {
                                    return (
                                      <DropdownMenuItem
                                        key={actionIndex}
                                        disabled
                                        className="pointer-events-none"
                                        data-type="separator"
                                      >
                                        <div className="bg-border mx-1 h-px w-full" />
                                      </DropdownMenuItem>
                                    );
                                  }
                                  return (
                                    <DropdownMenuItem
                                      key={actionIndex}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        action.onClick?.(row.original);
                                      }}
                                      className={cn(
                                        action.variant === "destructive" &&
                                          "text-destructive focus:text-destructive",
                                      )}
                                    >
                                      {action.icon && (
                                        <span className="mr-2">
                                          {action.icon}
                                        </span>
                                      )}
                                      {action.label}
                                      {action.kbd && (
                                        <span className="ml-auto font-mono text-[10px] opacity-60">
                                          {action.kbd}
                                        </span>
                                      )}
                                    </DropdownMenuItem>
                                  );
                                },
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (rowActions ? 1 : 0)}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Mobile Card View */}
        {mobileCardView && (
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
                aria-label={`View details for item ${(item as Record<string, unknown>).id || index}`}
              >
                {/* Card Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-muted-foreground text-sm font-medium">
                      {renderColumn(inputColumns[0], item) as React.ReactNode}
                    </div>
                  </div>
                  {rowActions && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        className="h-8 w-8 p-0"
                        aria-label="Open menu"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="shadow-none" align="end">
                        {rowActions(item).map((action, actionIndex) => {
                          if (action.type === "separator") {
                            return (
                              <DropdownMenuItem
                                key={actionIndex}
                                disabled
                                className="pointer-events-none"
                                data-type="separator"
                              >
                                <div className="bg-border mx-1 h-px w-full" />
                              </DropdownMenuItem>
                            );
                          }
                          return (
                            <DropdownMenuItem
                              key={actionIndex}
                              onClick={(event) => {
                                event.stopPropagation();
                                action.onClick?.(item);
                              }}
                              className={cn(
                                action.variant === "destructive" &&
                                  "text-destructive focus:text-destructive",
                              )}
                            >
                              {action.icon && (
                                <span className="mr-2">{action.icon}</span>
                              )}
                              {action.label}
                              {action.kbd && (
                                <span className="ml-auto font-mono text-[10px] opacity-60">
                                  {action.kbd}
                                </span>
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {/* Card Content - Other columns */}
                <div className="grid grid-cols-2 gap-4">
                  {inputColumns.slice(1, -1).map((column, colIndex) => (
                    <div key={colIndex} className="space-y-1">
                      <p className="text-muted-foreground/60 text-xs font-medium uppercase">
                        {column.header}
                      </p>
                      <div className="text-xs font-medium">
                        {renderColumn(column, item) as React.ReactNode}
                      </div>
                    </div>
                  ))}
                  <span className="text-xs">
                    {inputColumns.at(-1)
                      ? (renderColumn(
                          inputColumns.at(-1)!,
                          item,
                        ) as React.ReactNode)
                      : "N/A"}
                  </span>
                </div>

                {/* Hover Effect Indicator */}
                {onRowClick && (
                  <div className="bg-primary/50 absolute inset-x-0 bottom-0 h-0.5 opacity-0 transition-opacity group-hover:opacity-100" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination - Dashboard Table Style */}
      {showPagination && (
        <div className="text-muted-foreground flex flex-col-reverse gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between md:w-[50%]">
            <div>{itemsPerPage} Entries per page</div>
            <div>
              Page {currentPage} of {totalPages}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MainButton
              variant="primaryOutline"
              isLeftIconVisible
              size="lg"
              icon={<ChevronLeftIcon />}
              className={cn(
                currentPage === 1 ? "opacity-50" : "",
                "w-full rounded-sm sm:w-[137px]",
              )}
              onClick={() =>
                onPageChange?.(
                  Number.parseInt(currentPage as unknown as string) - 1,
                )
              }
              isDisabled={!hasPreviousPage}
            >
              Previous
            </MainButton>
            <MainButton
              variant="primaryOutline"
              isRightIconVisible
              size="lg"
              icon={<ChevronRightIcon />}
              className={cn(
                currentPage === totalPages ? "opacity-50" : "",
                "w-full rounded-sm sm:w-[137px]",
              )}
              onClick={() => {
                onPageChange?.(
                  Number.parseInt(currentPage as unknown as string) + 1,
                );
              }}
              isDisabled={!hasNextPage}
            >
              Next
            </MainButton>
          </div>
        </div>
      )}

      {/* Advanced Pagination - TanStack Style (for internal pagination) */}
      {enablePagination && !showPagination && (
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {enableRowSelection &&
              table.getFilteredSelectedRowModel().rows.length > 0 && (
                <span>
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </span>
              )}
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="primaryOutline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="primaryOutline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="primaryOutline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="primaryOutline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      )}

      {customFooterRenderer && customFooterRenderer()}
    </div>
  );
}

// Backward compatibility wrapper for the original DataTable
export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof schema>[];
}) {
  // Convert to IColumnDefinition format
  const columnDefinitions: IColumnDefinition<z.infer<typeof schema>>[] = [
    { header: "Header", accessorKey: "header" },
    { header: "Type", accessorKey: "type" },
    { header: "Status", accessorKey: "status" },
    { header: "Target", accessorKey: "target" },
    { header: "Limit", accessorKey: "limit" },
    { header: "Reviewer", accessorKey: "reviewer" },
  ];

  return (
    <AdvancedDataTable
      data={initialData}
      columns={columnDefinitions}
      enableDragAndDrop={true}
      enableRowSelection={true}
      enableColumnVisibility={true}
      enableSorting={true}
      enableFiltering={true}
      enablePagination={true}
      showPagination={false}
      showColumnCustomization={true}
      showAddButton={true}
      addButtonText="Add Section"
      tabs={[
        { value: "primaryOutline", label: "primaryOutline" },
        { value: "past-performance", label: "Past Performance", badge: "3" },
        { value: "key-personnel", label: "Key Personnel", badge: "2" },
        { value: "focus-documents", label: "Focus Documents" },
      ]}
      defaultTab="primaryOutline"
      mobileCardView={true}
    />
  );
}
