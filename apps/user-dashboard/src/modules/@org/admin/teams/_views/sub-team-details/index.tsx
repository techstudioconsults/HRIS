"use client";

import { Badge } from "@workspace/ui/components/badge";
import { AdvancedDataTable, BreadCrumb, DashboardHeader, EmptyState, ErrorEmptyState, ReusableDialog } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import empty1 from "~/images/empty-state.svg";
import AddNewMembers from "../../_components/forms/add-new-members";
import { CardGroup } from "../../../dashboard/_components/card-group";
import { DashboardCard } from "../../../dashboard/_components/dashboard-card";
import { useEmployeeRowActions } from "../../../employee/_views/table-data";
import { useEmployeeService } from "../../../employee/services/use-service";
import { useTeamService } from "../../services/use-service";
import { SubTeamDetailsSkeleton } from "./skeleton";
import { formatDate } from "@/lib/formatters";

// Type guards to safely normalize different response shapes without using `any`
function isEmployeeArray(value: unknown): value is Employee[] {
  return Array.isArray(value);
}
function hasItems(value: unknown): value is { items: unknown[] } {
  return typeof value === "object" && value !== null && Array.isArray((value as { items?: unknown[] }).items);
}
function hasDataItems(value: unknown): value is { data: { items: unknown[] } } {
  if (typeof value !== "object" || value === null) return false;
  const data = (value as { data?: unknown }).data;
  if (typeof data !== "object" || data === null) return false;
  return Array.isArray((data as { items?: unknown[] }).items);
}

// Sub Team Details Header Component
const SubTeamDetailsHeader = ({ teamId, onAddMemberClick }: { teamId: string; onAddMemberClick: () => void }) => {
  const { useGetTeamsById } = useTeamService();
  const { data: teamData } = useGetTeamsById(teamId, { enabled: !!teamId });

  const parentName =
    typeof teamData?.parent === "object" && teamData?.parent !== null
      ? (teamData.parent as { name?: string }).name
      : undefined;
  const parentId =
    typeof teamData?.parent === "object" && teamData?.parent !== null
      ? (teamData.parent as { id?: string }).id
      : teamData?.parent;

  return (
    <DashboardHeader
      title="Sub Team Details"
      subtitle={
        <BreadCrumb
          items={[
            { label: "Teams", href: "/admin/teams" },
            { label: parentName || "Parent Team", href: `/admin/teams/${parentId}` },
            { label: teamData?.name || "", href: `/admin/teams/${teamId}` },
          ]}
        />
      }
      actionComponent={
        <MainButton variant="primary" size="lg" isLeftIconVisible icon={<Plus />} onClick={onAddMemberClick}>
          Add Member
        </MainButton>
      }
    />
  );
};

// Sub Team Details Content Component
const SubTeamDetailsContent = ({ teamId }: { teamId: string }) => {
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);

  const { useGetTeamsById } = useTeamService();
  const {
    data: teamData,
    isLoading: isLoadingTeam,
    isError: isErrorTeam,
    refetch,
  } = useGetTeamsById(teamId, { enabled: !!teamId });

  const { useGetAllEmployees } = useEmployeeService();
  const { data: employeesResp } = useGetAllEmployees({}, { enabled: true });

  const allEmployees: Employee[] = useMemo(() => {
    const payload = employeesResp as unknown;
    if (hasDataItems(payload) && isEmployeeArray((payload as { data: { items: unknown[] } }).data.items)) {
      return (payload as { data: { items: Employee[] } }).data.items;
    }
    if (hasItems(payload) && isEmployeeArray((payload as { items: unknown[] }).items)) {
      return (payload as { items: Employee[] }).items;
    }
    if (isEmployeeArray(payload)) {
      return payload as Employee[];
    }
    return [];
  }, [employeesResp]);

  const members: Employee[] = useMemo(
    () => allEmployees.filter((employee) => employee?.employmentDetails?.team?.id === teamId),
    [allEmployees, teamId],
  );

  const { getRowActions, DeleteConfirmationModal, setActiveEmployee } = useEmployeeRowActions();
  const columns = useMemo<IColumnDefinition<Employee>[]>(
    () => [
      {
        header: "Team Member",
        accessorKey: "firstName",
        render: (_, employee: Employee) => (
          <div
            className={"flex w-fit items-center gap-2"}
            onMouseEnter={() => setActiveEmployee(employee)}
            onFocus={() => setActiveEmployee(employee)}
            tabIndex={0}
          >
            <Image
              src={
                typeof employee.avatar === "string" && employee.avatar.length > 0
                  ? employee.avatar
                  : "https://res.cloudinary.com/kingsleysolomon/image/upload/v1742989662/byte-alley/fisnolvvuvfiebxskgbs.svg"
              }
              alt={employee.firstName}
              width={100}
              height={100}
              className={`bg-low-grey-III h-8 w-8 rounded-full object-cover`}
            />
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-medium">{`${employee.firstName} ${employee.lastName}`}</span>
            </div>
          </div>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        render: (_, employee: Employee) => <span className="text-sm">{employee?.email || "N/A"}</span>,
      },
      {
        header: "Role",
        accessorKey: "email",
        render: (_, employee: Employee) => (
          <span className="text-sm">{employee?.employmentDetails?.role?.name || "N/A"}</span>
        ),
      },
      {
        header: "Work Mode",
        accessorKey: "email",
        render: (_, employee: Employee) => (
          <span className="text-sm capitalize">{employee?.employmentDetails?.workMode || "N/A"}</span>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        render: (_, employee: Employee) => (
          <Badge className="min-w-fit" variant={employee.status === `active` ? `success` : `warning`}>
            {employee.status === `active` ? "Active" : "On Leave"}
          </Badge>
        ),
      },
    ],
    [setActiveEmployee],
  );

  if (isLoadingTeam) {
    return <SubTeamDetailsSkeleton />;
  }

  if (isErrorTeam) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  return (
    <>
      <CardGroup>
        <DashboardCard
          title="Team Name"
          value={<p className="text-base">{teamData?.name}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Team Manager"
          value={<p className="text-base">{teamData?.manager || `Ifijeh Kingsley`}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Team Members"
          value={<p className="text-base">{members.length}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Created On"
          value={<p className="text-base">{formatDate(teamData?.createdAt)}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
      </CardGroup>

      <section className="space-y-4">
        {members.length > 0 ? (
          <>
            <AdvancedDataTable
              data={members}
              columns={columns}
              rowActions={getRowActions}
              showPagination={false}
              enableDragAndDrop={true}
              enableRowSelection={true}
              enableColumnVisibility={true}
              enableSorting={true}
              enableFiltering={true}
              mobileCardView={true}
              showColumnCustomization={false}
            />
            <DeleteConfirmationModal />
          </>
        ) : (
          <EmptyState
            className="bg-background"
            images={[{ src: empty1.src, alt: "No team member", width: 100, height: 100 }]}
            title="No team member yet."
            description="Add members to this team to collaborate and assign roles."
            button={{
              text: "Add Member",
              onClick: () => setIsAddMemberDialogOpen(true),
            }}
          />
        )}
        <ReusableDialog
          open={isAddMemberDialogOpen}
          onOpenChange={setIsAddMemberDialogOpen}
          title="Assign Members"
          description="Assign existing parent team members to this sub-team."
          trigger={<span />}
          className="min-w-2xl"
        >
          <AddNewMembers
            parentTeamId={(() => {
              const t = teamData as Team | undefined;
              const parent: unknown = (t as unknown as { parent?: unknown })?.parent;
              if (parent && typeof parent === "object" && (parent as { id?: string }).id) {
                return (parent as { id: string }).id;
              }
              if (typeof parent === "string") return parent;
              return t?.id || "";
            })()}
            availableRoles={[]}
            onSubmit={async () => {
              toast.success("Member assigned (simulate).");
            }}
            onCancel={() => setIsAddMemberDialogOpen(false)}
          />
        </ReusableDialog>
      </section>
    </>
  );
};

const SubTeamDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const { useGetTeamsById } = useTeamService();
  const { data: teamData } = useGetTeamsById(id, { enabled: !!id });

  return (
    <>
      <section className="space-y-8">
        <SubTeamDetailsHeader teamId={id} onAddMemberClick={() => setIsAddMemberDialogOpen(true)} />
        <SubTeamDetailsContent teamId={id} />
      </section>

      <ReusableDialog
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        title="Assign Members"
        description="Assign existing parent team members to this sub-team."
        trigger={<span />}
        className="min-w-2xl"
      >
        <AddNewMembers
          parentTeamId={(() => {
            const t = teamData as Team | undefined;
            const parent: unknown = (t as unknown as { parent?: unknown })?.parent;
            if (parent && typeof parent === "object" && (parent as { id?: string }).id) {
              return (parent as { id: string }).id;
            }
            if (typeof parent === "string") return parent;
            return t?.id || "";
          })()}
          availableRoles={[]}
          onSubmit={async () => {
            toast.success("Member assigned (simulate).");
          }}
          onCancel={() => setIsAddMemberDialogOpen(false)}
        />
      </ReusableDialog>
    </>
  );
};

export { SubTeamDetails };
