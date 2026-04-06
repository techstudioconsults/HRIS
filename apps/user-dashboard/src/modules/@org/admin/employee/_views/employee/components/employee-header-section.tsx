/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ExportAction from '@/components/shared/export-action';
import { SearchInput } from '@/modules/@org/shared/search-input';
import { Button } from '@workspace/ui/components/button';
import { DashboardHeader, GenericDropdown } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { useCallback } from 'react';

import { FilterForm } from '../../../_components/forms/filter-form';
import { useEmployeeService } from '../../../services/use-service';
import { Icon } from '@workspace/ui/lib/icons/icon';

interface EmployeeHeaderSectionProperties {
  search: string | null;
  teamId: string | null;
  roleId: string | null;
  status: string | null;
  sortBy: string | null;
  limit: number;
  page: number;
  apiFilters: any;
  onSearchChange: (query: string) => void;
  onFilterChange: (newFilters: any) => void;
}

export const EmployeeHeaderSection = ({
  search,
  teamId,
  roleId,
  status,
  sortBy,
  limit,
  page,
  apiFilters,
  onSearchChange,
  onFilterChange,
}: EmployeeHeaderSectionProperties) => {
  const { useGetAllTeams, useGetAllEmployees, useDownloadEmployees } =
    useEmployeeService();
  const { mutateAsync: downloadEmployees } = useDownloadEmployees();
  const { data: teams = [] } = useGetAllTeams();
  const { data: employeeData } = useGetAllEmployees(apiFilters);

  const handleFilterChange = useCallback(
    (newFilters: any) => {
      onFilterChange(newFilters);
    },
    [onFilterChange]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      onSearchChange(query);
    },
    [onSearchChange]
  );

  return (
    <DashboardHeader
      title="Employee"
      subtitle="All Employees"
      actionComponent={
        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          <div
            className={`flex flex-1 flex-row-reverse lg:flex-row items-center gap-2`}
          >
            <SearchInput
              className="border-border h-10 rounded-md border w-full"
              placeholder="Search employee..."
              onSearch={handleSearchChange}
            />
            <GenericDropdown
              contentClassName="bg-background"
              trigger={
                <Button
                  className="data-[state=open]:border-border
                  data-[state=open]:text-gray h-10 rounded-md border px-3"
                  variant="primaryOutline"
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
                    teamId: teamId || undefined,
                    roleId: roleId || undefined,
                    status: status || undefined,
                    sortBy: sortBy || undefined,
                    limit: limit ? String(limit) : undefined,
                    page: page ? String(page) : undefined,
                  }}
                  onFilterChange={handleFilterChange}
                  teams={teams}
                />
              </section>
            </GenericDropdown>
          </div>
          <div
            className={`flex flex-1 items-center justify-between gap-2 w-full`}
          >
            <ExportAction
              isDisabled={!employeeData?.data?.items?.length}
              downloadMutation={async () => {
                const fileData = await downloadEmployees(apiFilters);
                return fileData as unknown as Blob;
              }}
              currentPage={employeeData?.data?.metadata.page}
              buttonText="Export Employees"
              fileName="employees"
              className="h-10 rounded-md w-fit px-2.5 lg:px-6"
              size={`icon`}
            />
            <MainButton
              href="/admin/employees/add-employee"
              variant="primary"
              isLeftIconVisible
              icon={<Icon name={`Add`} variant={`Bold`} />}
              className={`w-full!`}
            >
              Add Employee
            </MainButton>
          </div>
        </div>
      }
    />
  );
};
