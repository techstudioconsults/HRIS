"use client";

import Loading from "@/app/Loading";
import MainButton from "@/components/shared/button";
import { GenericDropdown } from "@/components/shared/drop-down";
import { EmptyState } from "@/components/shared/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/tools/format";
import { More } from "iconsax-reactjs";
import { Plus } from "lucide-react";
import Link from "next/link";

import empty1 from "~/images/empty-state.svg";
import { DashboardTable } from "../../../_components/dashboard-table";
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
      <div className="flex items-center justify-between pb-4">
        <div className="flex flex-col items-start gap-2 text-center md:text-left">
          <h1 className="text-2xl font-bold">Team Details</h1>
          <div className="flex items-center gap-1 text-sm">
            <Link href="/admin/teams" className="text-primary">
              All Teams
            </Link>
            {/* <p className="text-muted-foreground"> > {teamData?.name}</p> */}
          </div>
        </div>
        <div className="flex items-center gap-5">
          <MainButton variant="primary" size="lg" isLeftIconVisible icon={<Plus />}>
            Add Sub-team
          </MainButton>
          <GenericDropdown
            align={`end`}
            trigger={
              <div className={`bg-background border-border flex size-10 items-center justify-center rounded-md border`}>
                <More className="size-5" />
              </div>
            }
          >
            <DropdownMenuItem>Edit Team&apos;s Name</DropdownMenuItem>
            <DropdownMenuItem>Delete Team</DropdownMenuItem>
          </GenericDropdown>
        </div>
      </div>

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
          <DashboardTable<Team>
            data={subTeams}
            columns={subTeamColumn}
            rowActions={getRowActions}
            showPagination={false}
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
