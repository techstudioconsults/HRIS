"use client";

import Loading from "@/app/Loading";
import MainButton from "@/components/shared/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { PageSection, PageWrapper } from "@/lib/animation";
import { formatDate } from "@/lib/tools/format";
import { AdvancedDataTable, type IColumnDefinition } from "@/modules/@org/admin/_components/table/table";
// Removed inline dropdown; using table rowActions instead
import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import empty1 from "~/images/empty-state.svg";
import { CardGroup } from "../../../dashboard/_components/card-group";
import { DashboardCard } from "../../../dashboard/_components/dashboard-card";
import { useEmployeeRowActions } from "../../../employee/_views/table-data";
import { useEmployeeService } from "../../../employee/services/use-service";
import { useTeamService } from "../../services/use-service";

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

const SubTeamDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  // Employee row actions manage routing internally; no local router required

  const { useGetTeamsById } = useTeamService();
  const { data: teamData, isLoading: isTeamLoading } = useGetTeamsById(id, { enabled: !!id });

  const { useGetAllEmployees } = useEmployeeService();
  const { data: employeesResp, isLoading: isEmployeesLoading } = useGetAllEmployees({}, { enabled: true });

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
    () => allEmployees.filter((employee) => employee?.employmentDetails?.team?.id === id),
    [allEmployees, id],
  );

  const isLoading = isTeamLoading || isEmployeesLoading;

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

  return (
    <PageWrapper className="space-y-8">
      <PageSection index={0}>
        <div className="flex items-center justify-between pb-4">
          <div className="flex flex-col items-start gap-2 text-center md:text-left">
            <h1 className="text-2xl font-bold">Sub-Team Details</h1>
            <div className="flex items-center gap-1 text-sm">
              <Link href="/admin/teams" className="text-primary">
                All Teams
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <MainButton variant="primary" size="lg" isLeftIconVisible icon={<Plus />}>
              Add Member
            </MainButton>
          </div>
        </div>
      </PageSection>

      <PageSection index={1}>
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
      </PageSection>

      <PageSection index={2} className="space-y-4">
        {isLoading ? (
          <Loading text={`Loading team members...`} className={`w-fill h-fit p-20`} />
        ) : members.length > 0 ? (
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
              onClick: () => {
                return;
              },
            }}
          />
        )}
      </PageSection>
    </PageWrapper>
  );
};

export { SubTeamDetails };
