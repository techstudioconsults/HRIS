/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import ExportAction from "@/components/shared/export-action";
import { SearchInput } from "@/modules/@org/shared/search-input";
import { Button } from "@workspace/ui/components/button";
import { DashboardHeader, GenericDropdown } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { Add, Filter } from "iconsax-reactjs";
import { useCallback } from "react";

import { FilterForm } from "../../../_components/forms/filter-form";
import { useEmployeeService } from "../../../services/use-service";

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
  const { useGetAllTeams, useGetAllEmployees, useDownloadEmployees } = useEmployeeService();
  const { mutateAsync: downloadEmployees } = useDownloadEmployees();
  const { data: teams = [] } = useGetAllTeams();
  const { data: employeeData } = useGetAllEmployees(apiFilters);

  const handleFilterChange = useCallback(
    (newFilters: any) => {
      onFilterChange(newFilters);
    },
    [onFilterChange],
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      onSearchChange(query);
    },
    [onSearchChange],
  );

  return (
    <DashboardHeader
      title="Employee"
      subtitle="All Employees"
      actionComponent={
        <div>
          <div className="flex items-center gap-2">
            <SearchInput
              className="border-border h-10 rounded-md border"
              placeholder="Search employee..."
              onSearch={handleSearchChange}
            />
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
              <section className="min-w-sm">
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
            <ExportAction
              isDisabled={!employeeData?.data?.items?.length}
              downloadMutation={async () => {
                const fileData = await downloadEmployees(apiFilters);
                return fileData as unknown as Blob;
              }}
              currentPage={employeeData?.data?.metadata.page}
              buttonText="Export Employees"
              fileName="employees"
            />
            <MainButton href="/admin/employees/add-employee" variant="primary" isLeftIconVisible icon={<Add />}>
              Add Employee
            </MainButton>
          </div>
        </div>
      }
    />
  );
};
