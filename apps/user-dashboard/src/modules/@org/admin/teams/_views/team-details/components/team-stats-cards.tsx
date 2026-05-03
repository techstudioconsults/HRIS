'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';

import { formatDate } from '@/lib/formatters';
import { CardGroup } from '../../../../../_components/card-group';
import { DashboardCard } from '../../../../../_components/dashboard-card';

interface TeamStatsCardsProps {
  teamData: Team | undefined;
  variant?: 'team' | 'sub-team';
}

const TeamStatsCards = ({
  teamData,
  variant = 'team',
}: TeamStatsCardsProps) => {
  const parentTeam = teamData?.parent as { name?: string } | null | undefined;

  return (
    <CardGroup>
      <DashboardCard
        title="Team Name"
        value={<span className="text-base">{teamData?.name}</span>}
        className="flex flex-col items-center justify-center text-center"
      />
      <DashboardCard
        title="Team Manager"
        value={
          <div className="flex items-center gap-4">
            <Avatar className="size-5 lg:size-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="text-sm lg:text-base text-balance">
              {teamData?.manager?.name || 'No manager assigned'}
            </span>
          </div>
        }
        className="flex flex-col items-center justify-center gap-4 text-center"
      />
      {variant === 'sub-team' ? (
        <DashboardCard
          title="Parent Team"
          value={<span className="text-base">{parentTeam?.name || 'N/A'}</span>}
          className="flex flex-col items-center justify-center text-center"
        />
      ) : (
        <DashboardCard
          title="Sub teams"
          value={
            <span className="text-base">{teamData?.subteams?.length ?? 0}</span>
          }
          className="flex flex-col items-center justify-center text-center"
        />
      )}
      <DashboardCard
        title="Created On"
        value={
          <span className="text-base">{formatDate(teamData?.createdAt)}</span>
        }
        className="flex flex-col items-center justify-center text-center"
      />
    </CardGroup>
  );
};

export { TeamStatsCards };
