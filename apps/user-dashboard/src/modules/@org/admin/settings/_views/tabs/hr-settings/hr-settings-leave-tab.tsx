"use client";

import { CreateLeaveTypeForm } from "@/modules/@org/admin/leave/_components/forms/create-leave-type-form";
import { EditLeaveTypeForm } from "@/modules/@org/admin/leave/_components/forms/edit-leave-type-form";
import { useLeaveService } from "@/modules/@org/admin/leave/services/use-service";
import type { LeaveType } from "@/modules/@org/admin/leave/types";
import { SearchInput } from "@/modules/@org/shared/search-input";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { ReusableDialog } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { AdvancedDataTable, TableSkeleton, type IColumnDefinition, type IRowAction } from "@workspace/ui/lib/table";
import { Add } from "iconsax-reactjs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

function EligibilityPill({ count }: { count: number }) {
  // Simple visual placeholder for the avatar+badge pill in the design.
  // Swap with real avatars when Leave eligibility is wired to employees.
  return (
    <div className="flex items-center">
      <div className="flex -space-x-4">
        <Avatar className="border-background bg-muted size-8 border">
          <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">U</AvatarFallback>
        </Avatar>
        <Avatar className="border-background bg-muted size-8 border">
          <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">U</AvatarFallback>
        </Avatar>
        <Avatar className="border-background bg-muted size-8 border">
          <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">U</AvatarFallback>
        </Avatar>
      </div>
      <span className="border-background bg-muted text-primary bg-primary/10 flex size-9 items-center justify-center rounded-full border text-[12px] font-medium">
        +{count}
      </span>
    </div>
  );
}

export function HRSettingsLeaveTab() {
  const { useGetLeaveTypes, useGetLeaveTypeById, useDeleteLeaveType } = useLeaveService();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);

  const { data: leaveTypesResponse, isLoading, isError, error } = useGetLeaveTypes();
  const { mutateAsync: deleteLeaveType, isPending: isDeleting } = useDeleteLeaveType();

  const selectedLeaveTypeId = selectedLeaveType?.id ?? "";
  const {
    data: selectedLeaveTypeDetails,
    isLoading: isLoadingSelectedLeaveType,
    isError: isSelectedLeaveTypeError,
  } = useGetLeaveTypeById(selectedLeaveTypeId, {
    enabled: editDialogOpen && !!selectedLeaveTypeId,
  });

  useEffect(() => {
    if (!isError) return;
    toast.error("Failed to load leave types", {
      description: error instanceof Error ? error.message : "Could not fetch leave types from the server.",
    });
  }, [isError, error]);

  const leaveTypes = useMemo<LeaveType[]>(() => {
    // Backend returns: { items: LeaveType[], metadata: {...} }
    // Support legacy shapes too.
    if (Array.isArray(leaveTypesResponse)) return leaveTypesResponse as LeaveType[];

    if (!leaveTypesResponse || typeof leaveTypesResponse !== "object") return [];
    const responseObject = leaveTypesResponse as Record<string, unknown>;

    const items = responseObject.items;
    if (Array.isArray(items)) return items as LeaveType[];

    const data = responseObject.data;
    if (Array.isArray(data)) return data as LeaveType[];
    if (data && typeof data === "object") {
      const dataObject = data as Record<string, unknown>;
      const nestedItems = dataObject.items;
      if (Array.isArray(nestedItems)) return nestedItems as LeaveType[];
    }

    return [];
  }, [leaveTypesResponse]);

  const filteredLeaveTypes = useMemo<LeaveType[]>(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leaveTypes;
    return leaveTypes.filter((row) =>
      String(row?.name ?? "")
        .toLowerCase()
        .includes(q),
    );
  }, [leaveTypes, search]);

  const totalPages = Math.max(1, Math.ceil(filteredLeaveTypes.length / PAGE_SIZE));
  const pageSafe = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (pageSafe - 1) * PAGE_SIZE;
  const pageItems = filteredLeaveTypes.slice(startIndex, startIndex + PAGE_SIZE);

  const columns = useMemo<IColumnDefinition<LeaveType>[]>(
    () => [
      {
        header: "Leave Name",
        accessorKey: "name",
        render: (value) => <span className="text-sm font-medium">{String(value ?? "—")}</span>,
      },
      { header: "Days", accessorKey: "days" },
      { header: "Cycle", accessorKey: "cycle" },
      {
        header: "Eligibility",
        accessorKey: "eligibility",
        render: (value) => {
          // Until backend provides an explicit eligible count, show a placeholder.
          const count = Number(value);
          return <EligibilityPill count={Number.isFinite(count) ? count : 0} />;
        },
      },
    ],
    [],
  );

  return (
    <div className="rounded-lg p-4 sm:p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h4 className="text-sm font-semibold">Leave Type</h4>
        </div>

        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <SearchInput
            className="border-border h-10 w-full rounded-md border sm:w-[240px]"
            placeholder="Search leave type..."
            onSearch={(query) => {
              setSearch(query);
              setPage(1);
            }}
          />
          <MainButton
            variant="primary"
            isLeftIconVisible
            icon={<Add />}
            className="w-full sm:w-auto"
            onClick={() => setCreateDialogOpen(true)}
          >
            Add Leave Type
          </MainButton>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : (
        <AdvancedDataTable
          className="min-h-0"
          data={pageItems}
          columns={columns}
          rowActions={(row): IRowAction<LeaveType>[] => [
            {
              label: "Edit",
              onClick: () => {
                setSelectedLeaveType(row);
                setEditDialogOpen(true);
              },
            },
            { type: "separator" },
            {
              label: "Delete",
              variant: "destructive",
              onClick: () => {
                setSelectedLeaveType(row);
                setDeleteDialogOpen(true);
              },
            },
          ]}
          emptyState={<p className="text-muted-foreground text-sm">No leave types found.</p>}
          showPagination
          currentPage={pageSafe}
          totalPages={totalPages}
          itemsPerPage={PAGE_SIZE}
          hasNextPage={pageSafe < totalPages}
          hasPreviousPage={pageSafe > 1}
          onPageChange={(nextPage) => setPage(Math.min(Math.max(nextPage, 1), totalPages))}
          showColumnCustomization={false}
          enableSorting={false}
          enableFiltering={false}
          mobileCardView={false}
        />
      )}

      {/* Create Leave Type */}
      <ReusableDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        title="Create Leave Type"
        description="Add a new leave type to your organization"
        className="min-w-3xl"
        trigger={null}
      >
        <CreateLeaveTypeForm onClose={() => setCreateDialogOpen(false)} />
      </ReusableDialog>

      {/* Edit Leave Type */}
      <ReusableDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setSelectedLeaveType(null);
        }}
        title="Edit Leave Type"
        description="Update leave type details"
        className="min-w-2xl"
        trigger={null}
      >
        {selectedLeaveType ? (
          isLoadingSelectedLeaveType ? (
            <TableSkeleton />
          ) : isSelectedLeaveTypeError ? (
            <div className="text-muted-foreground py-6 text-sm">Could not load leave type details.</div>
          ) : (
            <EditLeaveTypeForm
              leaveType={(selectedLeaveTypeDetails ?? selectedLeaveType) as LeaveType}
              onClose={() => setEditDialogOpen(false)}
            />
          )
        ) : null}
      </ReusableDialog>

      {/* Delete Leave Type */}
      <ReusableDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          if (!open) setSelectedLeaveType(null);
        }}
        title="Delete Leave Type"
        description={`You're about to delete "${selectedLeaveType?.name ?? "this leave type"}". This action cannot be undone.`}
        className="min-w-xl"
        trigger={null}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <MainButton
            variant="outline"
            type="button"
            onClick={() => setDeleteDialogOpen(false)}
            isDisabled={isDeleting}
          >
            Cancel
          </MainButton>
          <MainButton
            variant="primary"
            type="button"
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            isDisabled={isDeleting || !selectedLeaveType?.id}
            onClick={async () => {
              if (!selectedLeaveType?.id) return;
              await deleteLeaveType(selectedLeaveType.id, {
                onSuccess: () => {
                  toast.success(`Leave type "${selectedLeaveType.name}" deleted.`);
                  setDeleteDialogOpen(false);
                  setSelectedLeaveType(null);
                },
                onError: (error_) => {
                  toast.error("Failed to delete leave type", {
                    description:
                      error_ instanceof Error
                        ? error_.message
                        : "Unable to delete leave type. Please try again.",
                  });
                },
              });
            }}
          >
            Delete
          </MainButton>
        </div>
      </ReusableDialog>
    </div>
  );
}

