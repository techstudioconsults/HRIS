/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ExportAction from '@/components/shared/export-action';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useCallback } from 'react';

import { FilterForm } from '../../../_components/forms/filter-form';
import { useTeamService } from '../../../services/use-service';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { SearchInput } from '@/modules/@org/shared/search-input';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import type { TeamHeaderSectionProperties } from '../../../types';

export const TeamHeaderSection = ({
  search,
  status,
  sortBy,
  limit,
  page,
  onSearchChange,
  onFilterChange,
  onAddTeamClick,
}: TeamHeaderSectionProperties) => {
  const { useDownloadTeams } = useTeamService();
  const { refetch: downloadTeams } = useDownloadTeams({}, { enabled: false });

  const handleFilterChange = useCallback(
    (newFilters: any) => {
      onFilterChange(newFilters);
    },
    [onFilterChange]
  );

  return (
    <DashboardHeader
      title="Teams"
      subtitle="All Teams"
      actionComponent={
        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          <div
            className={`flex flex-1 flex-row-reverse lg:flex-row items-center gap-2`}
          >
            {/* Mobile CTA dropdown — first in DOM so it sits rightmost with flex-row-reverse */}
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
                <DropdownMenuItem disabled>
                  <Icon name="DocumentDownload" variant="Outline" />
                  Export Teams
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onAddTeamClick}>
                  <Icon name="Add" variant="Bold" />
                  Add Team
                </DropdownMenuItem>
              </GenericDropdown>
            </div>
            <SearchInput
              className="h-10 rounded-md w-full"
              placeholder="Search teams..."
              onSearch={onSearchChange}
            />
            <GenericDropdown
              contentClassName="bg-background"
              trigger={
                <Button
                  variant={'default'}
                  className=" h-10 rounded-md px-3 bg-primary-50 text-primary"
                >
                  <Icon name="Filter" size={16} variant={`Outline`} />
                  <span className={`hidden lg:block`}>Filter</span>
                </Button>
              }
            >
              <section className="min-w-screen sm:min-w-sm">
                <FilterForm
                  initialFilters={{
                    search: search || undefined,
                    status: status || undefined,
                    sortBy: sortBy || undefined,
                    limit: limit ? String(limit) : undefined,
                    page: page ? String(page) : undefined,
                  }}
                  onFilterChange={handleFilterChange}
                />
              </section>
            </GenericDropdown>
          </div>
          {/* Desktop CTAs — hidden on mobile */}
          <div className={`hidden lg:flex flex-1 items-center gap-2`}>
            <ExportAction
              isDisabled
              downloadMutation={async (filters) => {
                const { data } = await downloadTeams(filters);
                return data as Blob;
              }}
              currentPage={undefined}
              dateRange={undefined}
              status={undefined}
              buttonText="Export Teams"
              fileName="Teams"
              className="h-10 rounded-md w-fit px-2.5 lg:px-6"
              size={`icon`}
            />
            <MainButton
              variant="primary"
              isLeftIconVisible
              icon={<Icon name="Add" variant={`Bold`} />}
              onClick={onAddTeamClick}
              className={`w-full`}
            >
              Add Team
            </MainButton>
          </div>
        </div>
      }
    />
  );
};
