/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ExportAction from '@/components/shared/export-action';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useCallback } from 'react';

import { FilterForm } from '../../../_components/forms/filter-form';
import { useTeamService } from '../../../services/use-service';
import { DashboardHeader, GenericDropdown } from '@workspace/ui/lib';
import { SearchInput } from '@/modules/@org/shared/search-input';
import { Button } from '@workspace/ui/components/button';

interface TeamHeaderSectionProperties {
  search: string | null;
  status: string | null;
  sortBy: string | null;
  limit: number;
  page: number;
  onSearchChange: (query: string) => void;
  onFilterChange: (newFilters: any) => void;
  onAddTeamClick: () => void;
}

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
            <SearchInput
              className="border-border h-10 rounded-md border w-full"
              placeholder="Search teams..."
              onSearch={onSearchChange}
            />
            <GenericDropdown
              contentClassName="bg-background"
              trigger={
                <Button
                  variant={'primaryOutline'}
                  className="data-[state=open]:border-border data-[state=open]:text-gray h-10 rounded-md border px-3 shadow-none"
                >
                  <Icon name="Filter" size={16} />
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
          <div className={`flex flex-1 items-center gap-2`}>
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
