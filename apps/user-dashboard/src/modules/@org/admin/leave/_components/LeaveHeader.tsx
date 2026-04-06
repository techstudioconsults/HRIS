'use client';

import { SearchInput } from '@/modules/@org/shared/search-input';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { DashboardHeader, GenericDropdown } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useRouter } from 'next/navigation';

interface LeaveHeaderProperties {
  onSearch: (query: string) => void;
}

export const LeaveHeader = ({ onSearch }: LeaveHeaderProperties) => {
  const router = useRouter();

  return (
    <DashboardHeader
      title="Leave Hub"
      subtitle="View employee leave requests and manage leave types"
      actionComponent={
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-row-reverse items-center gap-2 lg:flex-row">
            {/* Mobile CTA dropdown sits rightmost via flex-row-reverse. */}
            <div className="flex lg:hidden">
              <GenericDropdown
                align="end"
                trigger={
                  <Button
                    size="icon"
                    className="shadow rounded-md p-2.5"
                    variant="default"
                  >
                    <Icon
                      name="More"
                      size={20}
                      variant="Outline"
                      className="text-primary rotate-90"
                    />
                  </Button>
                }
              >
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/admin/leave/type');
                  }}
                >
                  <Icon name="DocumentDownload" variant="Outline" />
                  Manage Leave Types
                </DropdownMenuItem>
              </GenericDropdown>
            </div>
            <SearchInput
              className="border-border h-10 w-full rounded-md border"
              placeholder="Search leave requests..."
              onSearch={onSearch}
            />
            <GenericDropdown
              contentClassName="bg-background"
              trigger={
                <Button
                  className="data-[state=open]:border-border data-[state=open]:text-gray h-10 rounded-md border px-3"
                  variant="primaryOutline"
                >
                  <Icon variant={`Outline`} name="Filter" size={16} />
                  <span className="hidden lg:block">Filter</span>
                </Button>
              }
            >
              <section className="text-muted-foreground min-w-[220px] p-3 text-sm">
                Basic filtering for leave requests will be available soon.
              </section>
            </GenericDropdown>
          </div>
          <div className="hidden lg:flex">
            <MainButton
              variant="primary"
              onClick={() => {
                router.push('/admin/leave/type');
              }}
            >
              Manage Leave Types
            </MainButton>
          </div>
        </div>
      }
    />
  );
};
