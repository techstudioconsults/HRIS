'use client';

import { useTeamService } from '../../../services/use-service';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { BreadCrumb } from '@workspace/ui/lib/breadcrumb';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { Separator } from '@workspace/ui/components/separator';

interface SubTeamDetailsHeaderProps {
  teamId: string;
  onAddEmployee: () => void;
  onAddRole: () => void;
  onEditSubTeam: () => void;
  onDeleteSubTeam: () => void;
}

const SubTeamDetailsHeader = ({
  teamId,
  onAddEmployee,
  onAddRole,
  onEditSubTeam,
  onDeleteSubTeam,
}: SubTeamDetailsHeaderProps) => {
  const { useGetTeamsById } = useTeamService();
  const { data: teamData } = useGetTeamsById(teamId, { enabled: !!teamId });

  const parentName =
    typeof teamData?.parent === 'object' && teamData?.parent !== null
      ? (teamData.parent as { name?: string }).name
      : undefined;
  const parentId =
    typeof teamData?.parent === 'object' && teamData?.parent !== null
      ? (teamData.parent as { id?: string }).id
      : teamData?.parent;

  return (
    <DashboardHeader
      title="Sub Team Details"
      subtitle={
        <BreadCrumb
          items={[
            { label: 'Teams', href: '/admin/teams' },
            {
              label: parentName || 'Parent Team',
              href: `/admin/teams/${parentId}`,
            },
            {
              label: teamData?.name || '',
              href: `/admin/teams/sub-team/${teamId}`,
            },
          ]}
        />
      }
      actionComponent={
        <div className="flex items-center gap-5">
          <MainButton
            variant="primary"
            isLeftIconVisible
            icon={<Icon name="Plus" />}
            onClick={onAddEmployee}
          >
            Add Employee
          </MainButton>
          <MainButton
            variant="primaryOutline"
            isLeftIconVisible
            icon={<Icon name="Plus" />}
            onClick={onAddRole}
          >
            Add Role
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
            <DropdownMenuItem onClick={onEditSubTeam}>
              <span>
                <Icon
                  name="Edit"
                  size={16}
                  className="mr-2"
                  variant="Outline"
                />
              </span>
              Edit Sub-team&apos;s Name
            </DropdownMenuItem>
            <Separator className="bg-border/40" />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDeleteSubTeam}
            >
              <span>
                <Icon
                  name="Trash"
                  size={16}
                  className="text-destructive mr-2"
                  variant="Outline"
                />
              </span>
              Delete Sub-team
            </DropdownMenuItem>
          </GenericDropdown>
        </div>
      }
    />
  );
};

export { SubTeamDetailsHeader };
