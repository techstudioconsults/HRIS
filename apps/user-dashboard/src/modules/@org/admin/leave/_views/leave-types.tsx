"use client";

import {getApiErrorMessage} from "@/lib/tools/api-error-message";
import {
  AdvancedDataTable,
  AlertModal,
  DashboardHeader,
  EmptyState,
  ErrorEmptyState,
  FilteredEmptyState,
  ReusableDialog,
  TableSkeleton,
} from "@workspace/ui/lib";
import {MainButton} from "@workspace/ui/lib/button";
import {useEffect, useMemo, useRef, useState} from "react";
import {toast} from "sonner";

import empty1 from "~/images/empty-state.svg";
import {CreateLeaveTypeForm} from "../_components/forms/create-leave-type-form";
import {EditLeaveTypeForm} from "../_components/forms/edit-leave-type-form";
import {useLeaveService} from "../services/use-service";
import type {LeaveType} from "../types";

const DEFAULT_TABLE_LEAVE_TYPES: LeaveType[] = [
  {
    id: "default-annual",
    name: "Annual Leave",
    days: 20,
    cycle: "Yearly",
    carryOver: false,
  },
  {
    id: "default-sick",
    name: "Sick Leave",
    days: 10,
    cycle: "Yearly",
    carryOver: false,
  },
  {
    id: "default-maternity",
    name: "Maternity Leave",
    days: 90,
    cycle: "Yearly",
    carryOver: false,
  },
];

const leaveTypeColumns: IColumnDefinition<LeaveType>[] = [
  {
    accessorKey: "name",
    header: "Leave Type",
    render: (_value: unknown, row: LeaveType) => <span className="text-sm text-gray-900">{row.name}</span>,
  },
  {
    accessorKey: "days",
    header: "Days",
    render: (_value: unknown, row: LeaveType) => <span className="text-sm text-gray-600">{row.days}</span>,
  },
  {
    accessorKey: "cycle",
    header: "Cycle",
    render: (_value: unknown, row: LeaveType) => <span className="text-sm text-gray-600">{row.cycle}</span>,
  },
  {
    accessorKey: "carryOver",
    header: "Eligibility",
    render: (_value: unknown, row: LeaveType) => (
        <span className="text-sm text-gray-600">{row.carryOver ? "Yes" : "No"}</span>
    ),
  },
];

const LeaveTypesView = () => {
  const {useGetLeaveTypes, useGetLeaveTypeById, useDeleteLeaveType} = useLeaveService();

  const [searchQuery, setSearchQuery] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<LeaveType | null>(null);

  const {data: leaveTypesResponse, isLoading, isError, error, refetch} = useGetLeaveTypes();
  const {mutateAsync: deleteLeaveType, isPending: isDeleting} = useDeleteLeaveType();

  const selectedLeaveTypeId = selectedLeaveType?.id ?? "";
  const {
    data: selectedLeaveTypeDetails,
    isLoading: isLoadingSelectedLeaveType,
    isError: isSelectedLeaveTypeError,
    refetch: refetchSelectedLeaveType,
  } = useGetLeaveTypeById(selectedLeaveTypeId, {
    enabled: editDialogOpen && !!selectedLeaveTypeId,
  });

  const hasToastedLoadErrorReference = useRef(false);
  useEffect(() => {
    if (!isError) {
      hasToastedLoadErrorReference.current = false;
      return;
    }

    if (hasToastedLoadErrorReference.current) return;
    hasToastedLoadErrorReference.current = true;

    toast.error("Failed to load leave types", {
      description: getApiErrorMessage(error, "Could not fetch leave types from the server."),
    });
  }, [isError, error]);

  const safeLeaveTypes: LeaveType[] = (() => {
    // Backend returns: { items: LeaveType[], metadata: {...} }
    // Support legacy shapes too.
    if (Array.isArray(leaveTypesResponse)) return leaveTypesResponse;
    const maybeItems = leaveTypesResponse;
    if (Array.isArray(maybeItems)) return maybeItems;
    const nestedItems = (leaveTypesResponse as { data?: { items?: LeaveType[] } } | undefined)?.data?.items;
    if (Array.isArray(nestedItems)) return nestedItems;
    return [];
  })();
  const effectiveLeaveTypes = safeLeaveTypes.length > 0 ? safeLeaveTypes : DEFAULT_TABLE_LEAVE_TYPES;

  const filteredLeaveTypes = useMemo(() => {
    if (!searchQuery.trim()) return effectiveLeaveTypes;
    const lower = searchQuery.toLowerCase();
    return effectiveLeaveTypes.filter((lt) => {
      return (
          String(lt.name ?? "")
          .toLowerCase()
          .includes(lower) ||
          String(lt.cycle ?? "")
          .toLowerCase()
          .includes(lower)
      );
    });
  }, [effectiveLeaveTypes, searchQuery]);

  const hasFilters = !!searchQuery.trim();

  const getRowActions = (row: LeaveType) => {
    const actions: IRowAction<LeaveType>[] = [
      {
        label: "Edit",
        onClick: () => {
          setSelectedLeaveType(row);
          setEditDialogOpen(true);
        },
      },
      {
        label: "Delete",
        onClick: () => {
          setSelectedLeaveType(row);
          setDeleteDialogOpen(true);
        },
      },
    ];
    return actions;
  };

  const handleConfirmDelete = async () => {
    if (!selectedLeaveType?.id) return;
    await deleteLeaveType(selectedLeaveType.id, {
      onSuccess: () => {
        toast.success(`Leave type "${selectedLeaveType.name}" deleted.`);
        setDeleteDialogOpen(false);
        setSelectedLeaveType(null);
      },
      onError: (error_) => {
        toast.error("Failed to delete leave type", {
          description: getApiErrorMessage(error_, "Unable to delete leave type. Please try again."),
        });
      },
    });
  };

  if (isLoading) {
    return <TableSkeleton/>;
  }

  if (isError) {
    return <ErrorEmptyState description={(error as Error | undefined)?.message} onRetry={refetch}/>;
  }

  if (filteredLeaveTypes.length === 0) {
    if (hasFilters) {
      return <FilteredEmptyState onReset={() => setSearchQuery("")}/>;
    }

    return (
        <div className="space-y-6">
          <DashboardHeader
              title="Leave Types"
              subtitle="Create and manage all leave types"
              actionComponent={
                <MainButton variant="primary" onClick={() => setCreateDialogOpen(true)}>
                  Add Leave Type
                </MainButton>
              }
          />
          <EmptyState
              className="bg-background"
              images={[{src: empty1.src, alt: "No leave types", width: 100, height: 100}]}
              title="No leave types yet."
              description="Create your first leave type (e.g., Annual Leave) to get started."
              button={{
                text: "Create Leave Type",
                onClick: () => setCreateDialogOpen(true),
              }}
          />

          <ReusableDialog
              open={createDialogOpen}
              onOpenChange={setCreateDialogOpen}
              title="Create Leave Type"
              description="Add a new leave type to your organization"
              className="min-w-3xl"
              trigger={null}
          >
            <CreateLeaveTypeForm onClose={() => setCreateDialogOpen(false)}/>
          </ReusableDialog>
        </div>
    );
  }

  return (
      <div className="space-y-6">
        <DashboardHeader
            title="Leave Types"
            subtitle="Create and manage all leave types"
            actionComponent={
              <div className="flex items-center gap-3">
                <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search leave types..."
                    className="border-border bg-background h-10 w-[260px] rounded-md border px-3 text-sm"
                />
                <MainButton variant="primary" onClick={() => setCreateDialogOpen(true)}>
                  Add Leave Type
                </MainButton>
              </div>
            }
        />
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">All Leave Types</h2>
          <div className="!h-fit overflow-hidden rounded-lg">
            <AdvancedDataTable
                columns={leaveTypeColumns}
                data={filteredLeaveTypes}
                currentPage={1}
                totalPages={1}
                itemsPerPage={filteredLeaveTypes.length}
                hasPreviousPage={false}
                hasNextPage={false}
                onPageChange={() => {
                }}
                rowActions={getRowActions}
                showPagination={true}
                enableRowSelection={true}
                enableColumnVisibility={false}
                enableSorting={false}
                enableFiltering={false}
                mobileCardView={true}
                showColumnCustomization={false}
                className={`min-h-fit`}
            />
          </div>
        </section>

        <ReusableDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            title="Create Leave Type"
            description="Add a new leave type to your organization"
            className="min-w-3xl"
            trigger={null}
        >
          <CreateLeaveTypeForm onClose={() => setCreateDialogOpen(false)}/>
        </ReusableDialog>

        <ReusableDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            title="Edit Leave Type"
            description="Update leave type details"
            className="min-w-2xl"
            trigger={null}
        >
          {selectedLeaveType && (
              <>
                {isLoadingSelectedLeaveType && <TableSkeleton/>}
                {!isLoadingSelectedLeaveType && isSelectedLeaveTypeError && (
                    <ErrorEmptyState
                        description="Could not load leave type details."
                        onRetry={() => {
                          void refetchSelectedLeaveType();
                        }}
                    />
                )}
                {!isLoadingSelectedLeaveType && !isSelectedLeaveTypeError && (
                    <EditLeaveTypeForm
                        leaveType={(selectedLeaveTypeDetails ?? selectedLeaveType) as LeaveType}
                        onClose={() => setEditDialogOpen(false)}
                    />
                )}
              </>
          )}
        </ReusableDialog>

        {/* Delete confirmation */}
        <AlertModal
            type="warning"
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
            loading={isDeleting}
            title="Delete Leave Type"
            description={`You're about to delete "${selectedLeaveType?.name}". This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
        />
      </div>
  );
};

export {LeaveTypesView};
