'use client';

import { SearchInput } from '@/modules/@org/shared/search-input';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useRouter } from 'next/navigation';
import { LeaveHeaderProperties } from '@/modules/@org/admin/leave/types';
import { routes } from '@/lib/routes/routes';

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
                    className="rounded-md size-10"
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
                    router.push(routes.admin.leave.types());
                  }}
                >
                  <Icon name="DocumentDownload" variant="Outline" />
                  Manage Leave Types
                </DropdownMenuItem>
              </GenericDropdown>
            </div>
            <SearchInput
              className=" h-10 w-full"
              placeholder="Search leave requests..."
              onSearch={onSearch}
            />
            {/*<GenericDropdown*/}
            {/*  contentClassName="bg-background"*/}
            {/*  trigger={*/}
            {/*    <Button disabled variant={`primaryOutline`} className={`h-10`}>*/}
            {/*      <Icon variant={`Outline`} name="Filter" size={16} />*/}
            {/*      <span className="hidden lg:block">Filter</span>*/}
            {/*    </Button>*/}
            {/*  }*/}
            {/*>*/}
            {/*  <section className="text-muted-foreground min-w-55 p-3 text-sm">*/}
            {/*    Basic filtering for leave requests will be available soon.*/}
            {/*  </section>*/}
            {/*</GenericDropdown>*/}
          </div>
          <div className="hidden lg:flex">
            <MainButton
              variant="primary"
              onClick={() => {
                router.push(routes.admin.leave.types());
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
