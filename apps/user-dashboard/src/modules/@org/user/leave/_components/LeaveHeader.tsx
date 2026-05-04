'use client';

import { Button } from '@workspace/ui/components/button';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import type { UserLeaveHeaderProps } from '../types';
export const UserLeaveHeader = ({ onCreateRequest }: UserLeaveHeaderProps) => {
  return (
    <DashboardHeader
      title="Leave Management"
      subtitle="View your leave balance, requests, and apply for new leave"
      actionComponent={
        <div className="flex items-center gap-4">
          <GenericDropdown
            contentClassName="bg-background"
            trigger={
              <Button disabled className="h-10">
                <Icon name="Filter" size={16} variant="Outline" />
                Filter
              </Button>
            }
          >
            <MainButton variant={`primaryOutline`} className="">
              Filter options will be available soon.
            </MainButton>
          </GenericDropdown>
          {onCreateRequest && (
            <MainButton
              icon={<Icon name="Add" size={16} variant={`Bold`} />}
              isLeftIconVisible
              variant="primary"
              onClick={onCreateRequest}
              className="flex items-center gap-2"
            >
              Request for Leave
            </MainButton>
          )}
        </div>
      }
    />
  );
};
