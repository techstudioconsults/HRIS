"use client";

import { FormField } from "@/components/shared/inputs/FormFields";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

interface Role {
  id: string;
  name: string;
}

interface Team {
  id: string;
  name: string;
  roles: Role[];
}

interface FilterValues {
  search?: string;
  teamId?: string;
  roleId?: string;
  status?: string;
  sortBy?: string;
  limit?: string;
  page?: string;
}

export const FilterForm = ({
  initialFilters,
  onFilterChange,
  teams = [],
}: {
  initialFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  teams: Team[];
}) => {
  const methods = useForm<FilterValues>({
    defaultValues: initialFilters,
  });
  const [debouncedFilters] = useDebounce(methods.watch(), 300);

  // Get roles for the selected team
  const selectedTeamId = methods.watch("teamId");
  const roles = teams.find((team) => team.id === selectedTeamId)?.roles || [];

  useEffect(() => {
    onFilterChange(debouncedFilters);
  }, [debouncedFilters, onFilterChange]);

  const handleTeamChange = (value: string) => {
    const actualValue = value === "all" ? undefined : value;
    methods.setValue("teamId", actualValue);
    methods.setValue("roleId", undefined); // Reset role when team changes
    methods.setValue("page", "1"); // Reset to first page on filter change
  };

  const handleFilterChange = (name: keyof FilterValues, value: string) => {
    const actualValue = value === "all" ? undefined : value;
    methods.setValue(name, actualValue);
    methods.setValue("page", "1"); // Reset to first page on filter change
  };

  return (
    <FormProvider {...methods}>
      <section className="mx-auto max-w-[527px] p-7">
        <h5 className="mb-4 text-xl">Filter Employees</h5>
        <div className="space-y-4">
          {/* Team Dropdown */}
          <FormField
            name="teamId"
            label="Department"
            type="select"
            placeholder="All Departments"
            options={[
              { value: "all", label: "All Departments" },
              ...teams.map((team) => ({ value: team.id, label: team.name })),
            ]}
            onChange={(event) => handleTeamChange(event.target.value)}
            className="!h-12"
          />

          {/* Role Dropdown */}
          <FormField
            name="roleId"
            label="Role"
            type="select"
            placeholder="All Roles"
            disabled={!selectedTeamId}
            options={[
              { value: "all", label: "All Roles" },
              ...roles.map((role) => ({ value: role.id, label: role.name })),
            ]}
            onChange={(event) => handleFilterChange("roleId", event.target.value)}
            className="!h-12"
          />

          {/* Status Dropdown */}
          <FormField
            name="status"
            label="Status"
            type="select"
            placeholder="All Statuses"
            options={[
              { value: "all", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "on_leave", label: "On Leave" },
            ]}
            onChange={(event) => handleFilterChange("status", event.target.value)}
            className="!h-12"
          />

          {/* Sort By Dropdown */}
          <FormField
            name="sortBy"
            label="Sort By"
            type="select"
            placeholder="Default"
            options={[
              { value: "all", label: "Default" },
              { value: "asc", label: "Ascending" },
              { value: "desc", label: "Descending" },
            ]}
            onChange={(event) => handleFilterChange("sortBy", event.target.value)}
            className="!h-12"
          />
        </div>
      </section>
    </FormProvider>
  );
};
