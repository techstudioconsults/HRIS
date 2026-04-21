'use client';

import { Button } from '@workspace/ui/components/button';
import { DashboardHeader, GenericDropdown } from '@workspace/ui/lib';
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
              <Button className="h-10 rounded-md px-3">
                <Icon name="Filter" size={16} variant="Outline" />
                Filter
              </Button>
            }
          >
            <section className="text-muted-foreground min-w-55 p-3 text-sm">
              Filter options will be available soon.
            </section>
          </GenericDropdown>
          {onCreateRequest && (
            <MainButton
              icon={<Icon name="Plus" size={16} />}
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
