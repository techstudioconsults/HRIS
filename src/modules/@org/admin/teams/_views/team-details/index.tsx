"use client";

import Loading from "@/app/Loading";
import { BreadCrumb } from "@/components/shared/breadcrumb";
import MainButton from "@/components/shared/button";
import { DashboardHeader } from "@/components/shared/dashboard/dashboard-header";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/tools/format";
import { AdvancedDataTable } from "@/modules/@org/admin/_components/table/table";
import { More } from "iconsax-reactjs";
import { Plus } from "lucide-react";

import empty1 from "~/images/empty-state.svg";
import { CardGroup } from "../../../dashboard/_components/card-group";
import { DashboardCard } from "../../../dashboard/_components/dashboard-card";
import { useTeamService } from "../../services/use-service";
import { subTeamColumn, useSubTeamRowActions } from "../table-data";

const TeamDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const { useGetTeamsById } = useTeamService();
  const { data: teamData, isLoading } = useGetTeamsById(id, { enabled: !!id });

  const { getRowActions } = useSubTeamRowActions();

  type TeamWithSubteams = Team & { subteams?: Team[] };
  const subTeams: Team[] = (teamData as TeamWithSubteams)?.subteams ?? [];

  return (
    <section className="space-y-8">
      <DashboardHeader
        title="Team Details"
        subtitle={
          <BreadCrumb
            items={[
              { label: "Teams", href: "/admin/teams" },
              { label: teamData?.name || "", href: `/admin/teams/${id}` },
            ]}
          />
        }
        actionComponent={
          <div className="flex items-center gap-5">
            <MainButton variant="primary" isLeftIconVisible icon={<Plus />}>
              Add Sub-team
            </MainButton>
            <GenericDropdown
              align={`end`}
              trigger={
                <div
                  className={`bg-background border-border flex size-10 items-center justify-center rounded-md shadow`}
                >
                  <More className="size-5" />
                </div>
              }
            >
              <DropdownMenuItem>Edit Team&apos;s Name</DropdownMenuItem>
              <DropdownMenuItem>Delete Team</DropdownMenuItem>
            </GenericDropdown>
          </div>
        }
      />
      <CardGroup>
        <DashboardCard
          title="Team Name"
          value={<p className="text-base">{teamData?.name}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Team Manager"
          value={
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <p className="text-base">{teamData?.manager || `Ifijeh Kingsley`}</p>
            </div>
          }
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Sub teams"
          value={<p className="text-base">{teamData?.subteams?.length}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
        <DashboardCard
          title="Created On"
          value={<p className="text-base">{formatDate(teamData?.createdAt)}</p>}
          className="flex flex-col items-center justify-center gap-4 text-center"
        />
      </CardGroup>

      <section className="space-y-4">
        {isLoading ? (
          <Loading text={`Loading sub-teams...`} className={`w-fill h-fit p-20`} />
        ) : subTeams.length > 0 ? (
          <AdvancedDataTable
            data={subTeams}
            columns={subTeamColumn}
            rowActions={getRowActions}
            showPagination={false}
            enableRowSelection={true}
            enableColumnVisibility={true}
            enableSorting={true}
            enableFiltering={true}
            mobileCardView={true}
            showColumnCustomization={false}
          />
        ) : (
          <EmptyState
            className="bg-background"
            images={[{ src: empty1.src, alt: "No sub-team", width: 100, height: 100 }]}
            title="No sub-team yet."
            description="Create sub-teams to better organize your team, assign leads, and manage roles."
            button={{
              text: "Add Sub-team",
              onClick: () => {
                return;
              },
            }}
          />
        )}
      </section>
    </section>
  );
};

export { TeamDetails };
