'use client';
import { Button } from '@workspace/ui/components/button';
import { DashboardHeader, GenericDropdown } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { Plus } from 'lucide-react';
import { Filter } from 'iconsax-reactjs';

interface UserLeaveHeaderProps {
  onCreateRequest?: () => void;
}

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
              <Button
                className="data-[state=open]:border-border data-[state=open]:text-gray h-10 rounded-md border px-3"
                variant="primaryOutline"
              >
                <Filter className="size-4" />
                Filter
              </Button>
            }
          >
            <section className="text-muted-foreground min-w-[220px] p-3 text-sm">
              Filter options will be available soon.
            </section>
          </GenericDropdown>
          {onCreateRequest && (
            <MainButton
              icon={<Plus className="size-4" />}
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
