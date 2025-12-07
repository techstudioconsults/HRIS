/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormField } from "@workspace/ui/lib";
import { useEffect, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

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
  // Skip the next debounced effect when we trigger an immediate refresh
  const skipNextDebouncedEffect = useRef(false);

  // Get roles for the selected team
  const selectedTeamId = methods.watch("teamId");
  const roles: any = teams.find((team) => team.id === selectedTeamId)?.roles || [];

  // Sync form with parent's filter state when it changes (e.g., on reset)
  useEffect(() => {
    methods.reset(initialFilters);
  }, [initialFilters, methods]);

  useEffect(() => {
    if (skipNextDebouncedEffect.current) {
      skipNextDebouncedEffect.current = false;
      return; // avoid duplicate refresh after immediate change
    }
    // Normalize: drop keys with undefined, empty string, or sentinel 'all'
    const normalized: FilterValues = {};
    for (const [key, value] of Object.entries(debouncedFilters)) {
      if (value === undefined || value === "" || value === "all") continue;
      (normalized as any)[key] = value;
    }
    onFilterChange(normalized);
  }, [debouncedFilters, onFilterChange]);

  const handleTeamChange = (value: string) => {
    const isAll = value === "all"; // 'all' sentinel from select options
    // If "All Departments" selected, reset to initial state and omit teamId entirely
    if (isAll) {
      skipNextDebouncedEffect.current = true;
      const resetFilters: FilterValues = {
        ...initialFilters,
        teamId: undefined,
        roleId: undefined,
        page: "1",
      };
      methods.reset(resetFilters);
      const nextFilters = { ...resetFilters } as Record<string, unknown>;
      delete nextFilters.teamId; // omit teamId entirely
      onFilterChange(nextFilters as FilterValues);
      return;
    }
    // Otherwise, apply team normally and clear role
    methods.setValue("teamId", value);
    methods.setValue("roleId", undefined);
    methods.setValue("page", "1");
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
            className="border-border !h-10"
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
              ...roles.map((role: Role) => ({ value: role.id, label: role.name })),
            ]}
            onChange={(event) => handleFilterChange("roleId", event.target.value)}
            className="border-border !h-10"
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
            className="border-border !h-10"
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
            className="border-border !h-10"
          />
        </div>
      </section>
    </FormProvider>
  );
};
