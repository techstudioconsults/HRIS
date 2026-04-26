/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ExportAction from '@/components/shared/export-action';
import { SearchInput } from '@/modules/@org/shared/search-input';
import { Button } from '@workspace/ui/components/button';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { saveAs } from 'file-saver';
import Link from 'next/link';
import { useCallback, useTransition } from 'react';

import { FilterForm } from '../../../_components/forms/filter-form';
import { useEmployeeService } from '../../../services/use-service';
import type { EmployeeHeaderSectionProperties } from '../../../types';

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
  const [isExporting, startExport] = useTransition();
  const isExportDisabled = !employeeData?.data?.items?.length;

  const handleMobileExport = () => {
    startExport(async () => {
      const fileData = await downloadEmployees(apiFilters);
      const blob = new Blob([fileData as unknown as File], {
        type: 'text/csv',
      });
      saveAs(blob, `employees.csv`);
    });
  };

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
                <DropdownMenuItem
                  onClick={handleMobileExport}
                  disabled={isExportDisabled || isExporting}
                >
                  <Icon name="DocumentDownload" variant="Outline" />
                  {isExporting ? 'Exporting...' : 'Export Employees'}
                </DropdownMenuItem>
                <Link href="/admin/employees/add-employee">
                  <DropdownMenuItem>
                    <Icon name="Add" variant="Bold" />
                    Add Employee
                  </DropdownMenuItem>
                </Link>
              </GenericDropdown>
            </div>
            <SearchInput
              className="h-10 w-full"
              placeholder="Search employee..."
              onSearch={handleSearchChange}
            />
            <GenericDropdown
              contentClassName="bg-background"
              trigger={
                <Button
                  className="h-10 rounded-md bg-primary/10 text-primary px-3"
                  variant="default"
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
          {/* Desktop CTAs — hidden on mobile */}
          <div
            className={`hidden lg:flex flex-1 items-center justify-between gap-2 w-full`}
          >
            <ExportAction
              isDisabled={isExportDisabled}
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
