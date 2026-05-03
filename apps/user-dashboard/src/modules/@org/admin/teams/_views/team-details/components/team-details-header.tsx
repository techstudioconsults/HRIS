'use client';

import { Button } from '@workspace/ui/components/button';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { Separator } from '@workspace/ui/components/separator';
import { BreadCrumb } from '@workspace/ui/lib/breadcrumb';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { MainButton } from '@workspace/ui/lib/button';

import { useTeamService } from '../../../services/use-service';

interface TeamDetailsHeaderProps {
  teamId: string;
  onAddSubTeam: () => void;
  onEditTeam: (team: Team) => void;
  onDeleteTeam: () => void;
}

const TeamDetailsHeader = ({
  teamId,
  onAddSubTeam,
  onEditTeam,
  onDeleteTeam,
}: TeamDetailsHeaderProps) => {
  const { useGetTeamsById } = useTeamService();
  const { data: teamData } = useGetTeamsById(teamId, { enabled: !!teamId });

  return (
    <DashboardHeader
      title="Team Details"
      subtitle={
        <BreadCrumb
          items={[
            { label: 'Teams', href: '/admin/teams' },
            { label: teamData?.name || '', href: `/admin/teams/${teamId}` },
          ]}
        />
      }
      actionComponent={
        <div className="flex items-center gap-5">
          <MainButton
            variant="primary"
            isLeftIconVisible
            icon={<Icon name="Add" variant="Bold" />}
            onClick={onAddSubTeam}
            className="w-full"
          >
            Add Sub-team
          </MainButton>
          <GenericDropdown
            align="end"
            trigger={
              <Button size="icon" variant={`primaryOutline`}>
                <Icon
                  name="More"
                  size={22}
                  variant="Outline"
                  className="text-primary rotate-90"
                />
              </Button>
            }
          >
            <DropdownMenuItem
              onClick={() => {
                if (teamData) onEditTeam(teamData as Team);
              }}
            >
              <span>
                <Icon
                  name="Edit"
                  size={16}
                  className="mr-2"
                  variant="Outline"
                />
              </span>
              Edit Team&apos;s Name
            </DropdownMenuItem>
            <Separator className="bg-border/40" />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDeleteTeam}
            >
              <span>
                <Icon
                  name="Trash"
                  size={16}
                  className="text-destructive mr-2"
                  variant="Outline"
                />
              </span>
              Delete Team
            </DropdownMenuItem>
          </GenericDropdown>
        </div>
      }
    />
  );
};

export { TeamDetailsHeader };
