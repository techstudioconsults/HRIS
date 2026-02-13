/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRolesManagementSearchParameters } from "@/lib/nuqs/use-roles-management-search-parameters";
import { queryKeys } from "@/lib/react-query/query-keys";
import { FilterForm } from "@/modules/@org/admin/teams/_components/forms/filter-form";
import { useTeamService } from "@/modules/@org/admin/teams/services/use-service";
import { RolesAndPermission } from "@/modules/@org/onboarding/_components/forms/roles&permission";
import { useOnboardingService } from "@/modules/@org/onboarding/services/use-onboarding-service";
import { SearchInput } from "@/modules/@org/shared/search-input";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { ComboBox, GenericDropdown, ReusableDialog } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { AlertModal } from "@workspace/ui/lib/dialog";
import { AdvancedDataTable, TableSkeleton, type IColumnDefinition, type IRowAction } from "@workspace/ui/lib/table";
import { Filter, More } from "iconsax-reactjs";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useDebounce } from "use-debounce";

type RoleRow = {
  id: string;
  name: string;
  teamId: string;
  teamName: string;
  permissions: string[];
  usersAssigned: string;
  lastModified: string;
};

type RoleEditorState =
  | { open: false }
  | {
      open: true;
      mode: "create" | "edit";
      teamId: string;
      role?: { id: string; name: string; permissions: string[] };
    };

type RoleToggleState =
  | { open: false }
  | {
      open: true;
      roleId: string;
      roleName: string;
      action: "deactivate" | "activate";
    };

const DEFAULT_PAGE_SIZE = 10;

export const RolesManagementTab = () => {
  const queryClient = useQueryClient();
  const { useGetTeamsWithRoles } = useOnboardingService();
  const { useCreateRole, useUpdateRole } = useTeamService();

  const {
    page,
    search,
    teamId,
    sortBy,
    limit,
    setPage,
    setSearch,
    setTeamId,
    setSortBy,
    setLimit,
    resetToFirstPage,
  } = useRolesManagementSearchParameters();

  const teamsWithRolesQueryKey = queryKeys.onboarding.teamsWithRoles();

  const { data: teamsWithRoles = [], isLoading: isLoadingTeams } = useGetTeamsWithRoles();
  const { mutateAsync: createRoleMutation, isPending: isCreating } = useCreateRole();
  const { mutateAsync: updateRoleMutation, isPending: isUpdating } = useUpdateRole();

  // Local input state (debounced) to throttle URL updates via nuqs
  const [searchInput, setSearchInput] = useState(search || "");
  const [debouncedSearch] = useDebounce(searchInput, 300);

  const [roleEditor, setRoleEditor] = useState<RoleEditorState>({ open: false });

  // UI-only role activation state (until backend endpoints are wired)
  const [roleActiveOverrides, setRoleActiveOverrides] = useState<Record<string, boolean>>({});
  const [toggleModal, setToggleModal] = useState<RoleToggleState>({ open: false });
  const [toggleSuccessModal, setToggleSuccessModal] = useState<RoleToggleState>({ open: false });
  const [isTogglingRole, setIsTogglingRole] = useState(false);

  const teamOptions = useMemo(
    () =>
      (Array.isArray(teamsWithRoles) ? teamsWithRoles : []).map((team: any) => ({
        value: String(team.id),
        label: String(team.name),
      })),
    [teamsWithRoles],
  );

  // Apply debounced search to URL (nuqs) and reset page to 1
  useEffect(() => {
    setSearch(debouncedSearch && debouncedSearch.trim() ? debouncedSearch.trim() : null);
    resetToFirstPage();
  }, [debouncedSearch, setSearch, resetToFirstPage]);

  // If the URL comes in with rolesTeamId=all, treat it as "no department filter" and clean the URL.
  useEffect(() => {
    if (teamId === "all") {
      setTeamId(null);
      resetToFirstPage();
    }
  }, [teamId, setTeamId, resetToFirstPage]);

  const effectiveTeamId = teamId === "all" ? null : teamId;

  const allRoles = useMemo<RoleRow[]>(() => {
    const teams = Array.isArray(teamsWithRoles) ? (teamsWithRoles as any[]) : [];
    const flattened: RoleRow[] = [];
    for (const team of teams) {
      const roles: any[] = Array.isArray(team.roles) ? team.roles : [];
      for (const role of roles) {
        flattened.push({
          id: String(role.id),
          name: String(role.name),
          teamId: String(team.id),
          teamName: String(team.name),
          permissions: Array.isArray(role.permissions) ? role.permissions : [],
          usersAssigned: "—",
          lastModified: "—",
        });
      }
    }
    return flattened;
  }, [teamsWithRoles]);

  const columns = useMemo<IColumnDefinition<RoleRow>[]>(
    () => [
      {
        header: "Role Name",
        accessorKey: "name",
        render: (value) => <span className="font-medium">{String(value ?? "—")}</span>,
      },
      {
        header: "Department",
        accessorKey: "teamName",
        render: (value) => <span>{String(value ?? "—")}</span>,
      },
      {
        header: "Users Assigned",
        accessorKey: "usersAssigned",
      },
      {
        header: "Last Modified",
        accessorKey: "lastModified",
      },
    ],
    [],
  );

  const filteredRoles = useMemo(() => {
    const q = (search ?? "").trim().toLowerCase();
    const filtered = allRoles.filter((role) => {
      const matchSearch = !q || role.name.toLowerCase().includes(q);
      const matchTeam = !effectiveTeamId || role.teamId === effectiveTeamId;
      return matchSearch && matchTeam;
    });

    if (sortBy === "name_asc") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "name_desc") {
      return [...filtered].sort((a, b) => b.name.localeCompare(a.name));
    }
    return filtered;
  }, [allRoles, search, effectiveTeamId, sortBy]);

  const pageSize = limit ?? DEFAULT_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(filteredRoles.length / pageSize));
  const pageSafe = Math.min(Math.max(page ?? 1, 1), totalPages);
  const startIndex = (pageSafe - 1) * pageSize;
  const pageItems = filteredRoles.slice(startIndex, startIndex + pageSize);

  const isBusy = isCreating || isUpdating;

  const openCreateDialog = () => {
    setRoleEditor({ open: true, mode: "create", teamId: effectiveTeamId || "" });
  };

  const openEditDialog = (role: RoleRow) => {
    setRoleEditor({
      open: true,
      mode: "edit",
      teamId: role.teamId,
      role: { id: role.id, name: role.name, permissions: role.permissions },
    });
  };

  const closeRoleEditor = () => setRoleEditor({ open: false });

  const handleFilterChange = useCallback(
    (newFilters: any) => {
      // Re-use the Teams FilterForm by mapping fields:
      // status => teamId (Department)
      // sortBy => sortBy
      // limit => pageSize
      setTeamId(newFilters.status ?? null);
      setSortBy(newFilters.sortBy ?? null);
      if (newFilters.limit != null) setLimit(Number(newFilters.limit));
      resetToFirstPage();
    },
    [setTeamId, setSortBy, setLimit, resetToFirstPage],
  );

  const isRoleActive = (roleId: string) => roleActiveOverrides[roleId] ?? true;

  const openToggleRoleModal = (payload: { roleId: string; roleName: string; action: "deactivate" | "activate" }) => {
    setToggleModal({ open: true, ...payload });
  };

  const closeToggleRoleModal = () => setToggleModal({ open: false });
  const closeToggleSuccessModal = () => setToggleSuccessModal({ open: false });

  const handleConfirmToggleRole = async () => {
    if (!toggleModal.open) return;
    setIsTogglingRole(true);
    try {
      // NOTE: Backend wiring not available yet. This updates UI state only.
      setRoleActiveOverrides((previous) => ({
        ...previous,
        [toggleModal.roleId]: toggleModal.action === "activate",
      }));

      setToggleSuccessModal(toggleModal);
      closeToggleRoleModal();
    } finally {
      setIsTogglingRole(false);
    }
  };

  const patchTeamsWithRolesCache = (patch: {
    teamId: string;
    roleId: string;
    name?: string;
    permissions?: string[];
  }) => {
    queryClient.setQueryData(teamsWithRolesQueryKey, (previous: any) => {
      const teams = Array.isArray(previous) ? previous : [];
      return teams.map((team: any) => {
        if (String(team?.id) !== patch.teamId) return team;
        const roles = Array.isArray(team?.roles) ? team.roles : [];
        return {
          ...team,
          roles: roles.map((role: any) => {
            if (String(role?.id) !== patch.roleId) return role;
            const nextRole: any = { ...role };
            if (patch.name !== undefined) nextRole.name = patch.name;
            if (patch.permissions !== undefined) nextRole.permissions = patch.permissions;
            return nextRole;
          }),
        };
      });
    });
  };

  const handleSubmitRole = async (data: { id?: string; name: string; permissions?: string[] }) => {
    const selectedTeamId = roleEditor.open ? roleEditor.teamId : "";
    if (!selectedTeamId) {
      toast.error("Select a department", {
        description: "Please select a department/team before saving the role.",
      });
      return;
    }

    const permissions = Array.isArray(data.permissions) ? data.permissions : [];

    if (roleEditor.open && roleEditor.mode === "edit" && roleEditor.role?.id) {
      // Optimistically update the table immediately on submit (no refresh needed).
      const optimisticPatch = {
        teamId: selectedTeamId,
        roleId: roleEditor.role.id,
        name: data.name,
        permissions,
      };
      const previousTeamsWithRoles = queryClient.getQueryData(teamsWithRolesQueryKey);
      patchTeamsWithRolesCache(optimisticPatch);
      closeRoleEditor();

      await updateRoleMutation(
        { roleId: roleEditor.role.id, name: data.name, permissions },
        {
          onSuccess: async () => {
            toast.success("Role updated");
            await queryClient.invalidateQueries({ queryKey: queryKeys.onboarding.roles(selectedTeamId) });
            await queryClient.invalidateQueries({ queryKey: teamsWithRolesQueryKey });
          },
          onError: () => {
            // Rollback optimistic update
            queryClient.setQueryData(teamsWithRolesQueryKey, previousTeamsWithRoles);
            toast.error("Failed to update role");
          },
        },
      );
      return;
    }

    await createRoleMutation(
      { name: data.name, teamId: selectedTeamId, permissions },
      {
        onSuccess: async () => {
          toast.success("Role created");
          await queryClient.invalidateQueries({ queryKey: queryKeys.onboarding.roles(selectedTeamId) });
          await queryClient.invalidateQueries({ queryKey: teamsWithRolesQueryKey });
          closeRoleEditor();
        },
        onError: () => {
          toast.error("Failed to create role");
        },
      },
    );
  };

  return (
    <section className="space-y-6">
      {/* Title + Actions */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h2 className="text-base font-semibold">Roles Management</h2>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <SearchInput
            className="border-border h-10 w-full rounded-md border sm:w-[220px]"
            placeholder="Search role name..."
            delay={0}
            onSearch={(query) => setSearchInput(query)}
          />

          <GenericDropdown
            contentClassName="bg-background"
            trigger={
              <Button
                variant={"primaryOutline"}
                className="data-[state=open]:border-border data-[state=open]:text-gray h-10 w-full justify-center rounded-md border px-3 shadow-none sm:w-auto"
              >
                <Filter className="size-4" />
                Filter
              </Button>
            }
          >
            <section className="min-w-sm">
              <FilterForm
                title="Filter Roles"
                statusLabel="Department"
                statusPlaceholder="All Departments"
                statusOptions={[{ value: "all", label: "All Departments" }, ...teamOptions]}
                sortOptions={[
                  { value: "all", label: "Default" },
                  { value: "name_asc", label: "Role Name (A-Z)" },
                  { value: "name_desc", label: "Role Name (Z-A)" },
                ]}
                initialFilters={{
                  search: search || undefined,
                  status: effectiveTeamId || undefined,
                  sortBy: sortBy || undefined,
                  limit: limit ? String(limit) : undefined,
                  page: pageSafe ? String(pageSafe) : undefined,
                }}
                onFilterChange={handleFilterChange}
                // Roles tab doesn't need the teams status filter values; we map it to Department.
                showStatus
                showSortBy
                showLimit
              />
            </section>
          </GenericDropdown>

          <MainButton
            variant="primary"
            isLeftIconVisible
            icon={<Plus className="size-4" />}
            className="w-full sm:w-auto"
            onClick={openCreateDialog}
          >
            Create New Role
          </MainButton>
        </div>
      </div>

      {/* Table */}
      <div className="">
        {isLoadingTeams ? (
          <div className="p-4">
            <TableSkeleton />
          </div>
        ) : (
          <AdvancedDataTable
            className="min-h-0"
            data={pageItems}
            columns={columns}
            rowActions={(row): IRowAction<RoleRow>[] => [
              {
                label: "Edit Role",
                onClick: () => openEditDialog(row),
                icon: <More className="size-4" />,
                ariaLabel: `Edit role ${row.name}`,
              },
              { type: "separator" },
              {
                label: isRoleActive(row.id) ? "Deactivate role" : "Activate role",
                variant: isRoleActive(row.id) ? "destructive" : "default",
                onClick: () =>
                  openToggleRoleModal({
                    roleId: row.id,
                    roleName: row.name,
                    action: isRoleActive(row.id) ? "deactivate" : "activate",
                  }),
                ariaLabel: `${isRoleActive(row.id) ? "Deactivate" : "Activate"} role ${row.name}`,
              },
            ]}
            emptyState={<p className="text-muted-foreground text-sm">No roles found.</p>}
            showPagination
            currentPage={pageSafe}
            totalPages={totalPages}
            itemsPerPage={pageSize}
            hasNextPage={pageSafe < totalPages}
            hasPreviousPage={pageSafe > 1}
            onPageChange={(nextPage) => setPage(Math.min(Math.max(nextPage, 1), totalPages))}
            showColumnCustomization={false}
            enableSorting={false}
            enableFiltering={false}
          />
        )}
      </div>

      {/* Activate/Deactivate Role Modals */}
      <AlertModal
        isOpen={toggleModal.open}
        onClose={closeToggleRoleModal}
        onConfirm={handleConfirmToggleRole}
        loading={isTogglingRole}
        type={toggleModal.open && toggleModal.action === "activate" ? "info" : "warning"}
        title={toggleModal.open && toggleModal.action === "activate" ? "Activate Role" : "Deactivate Role"}
        description={
          toggleModal.open && toggleModal.action === "activate"
            ? "Are you sure you want to activate the role? Users assigned to this role will regain access based on the permissions assigned."
            : "Are you sure you want to deactivate the role? Users assigned to this role will lose all associated permissions immediately. You can reactivate this role at any time."
        }
        confirmText={toggleModal.open && toggleModal.action === "activate" ? "Activate Role" : "Deactivate Role"}
        cancelText="Cancel"
        showCancelButton
        confirmVariant={toggleModal.open && toggleModal.action === "activate" ? "primary" : "destructive"}
      />

      <AlertModal
        isOpen={toggleSuccessModal.open}
        onClose={closeToggleSuccessModal}
        onConfirm={closeToggleSuccessModal}
        type="success"
        title={
          toggleSuccessModal.open && toggleSuccessModal.action === "activate" ? "Role Activated" : "Role Deactivated"
        }
        description={
          toggleSuccessModal.open && toggleSuccessModal.action === "activate"
            ? "This role has been updated. Changes will take effect immediately for all assigned users."
            : "This role has been updated. Changes will take effect immediately for all assigned users."
        }
        confirmText="Continue"
        showCancelButton={false}
      />

      {/* Role Create/Edit Dialog */}
      <ReusableDialog
        open={roleEditor.open}
        onOpenChange={(open) => {
          if (!open) closeRoleEditor();
        }}
        title={roleEditor.open && roleEditor.mode === "edit" ? "Edit Role" : "Create New Role"}
        description="Create roles and assign permissions"
        className="min-w-2xl"
        trigger={null}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Department<span className="text-destructive -ml-0.5">*</span>
            </label>
            <ComboBox
              options={teamOptions}
              value={roleEditor.open ? roleEditor.teamId : ""}
              onValueChange={(value) => {
                if (!roleEditor.open) return;
                setRoleEditor({ ...roleEditor, teamId: value });
              }}
              placeholder={isLoadingTeams ? "Loading departments..." : "Select department"}
              className="h-12"
              disabled={isLoadingTeams || isBusy}
            />
          </div>

          <RolesAndPermission
            isEdit={roleEditor.open && roleEditor.mode === "edit"}
            initialData={roleEditor.open && roleEditor.mode === "edit" ? roleEditor.role : undefined}
            isSubmitting={isBusy}
            onSubmit={handleSubmitRole as any}
            onCancel={(event) => {
              event?.preventDefault?.();
              closeRoleEditor();
            }}
          />
        </div>
      </ReusableDialog>
    </section>
  );
};
