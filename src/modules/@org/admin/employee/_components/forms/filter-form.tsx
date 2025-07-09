"use client";

import { useEffect, useState } from "react";
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
  const [localFilters, setLocalFilters] = useState<FilterValues>(initialFilters);
  const [debouncedFilters] = useDebounce(localFilters, 300);

  // Get roles for the selected team
  const roles = teams.find((team) => team.id === localFilters.teamId)?.roles || [];

  useEffect(() => {
    onFilterChange(debouncedFilters);
  }, [debouncedFilters, onFilterChange]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    const newValue = value || undefined;

    setLocalFilters((previous) => {
      const newFilters = {
        ...previous,
        [name]: newValue,
        page: "1", // Reset to first page on filter change
      };

      // Reset role when team changes
      if (name === "teamId" && newValue !== previous.teamId) {
        newFilters.roleId = undefined;
      }

      return newFilters;
    });
  };

  return (
    <section className="mx-auto max-w-[527px] p-7">
      <h5 className="mb-4 text-xl">Filter Employees</h5>
      <div className="space-y-4">
        {/* Team Dropdown */}
        <div className="space-y-2">
          <label htmlFor="teamId" className="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            id="teamId"
            name="teamId"
            value={localFilters.teamId || ""}
            onChange={handleChange}
            className="block h-14 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">All Departments</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Dropdown */}
        <div className="space-y-2">
          <label htmlFor="roleId" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="roleId"
            name="roleId"
            value={localFilters.roleId || ""}
            onChange={handleChange}
            disabled={!localFilters.teamId}
            className="block h-14 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
          >
            <option value="">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Dropdown */}
        <div className="space-y-2">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={localFilters.status || ""}
            onChange={handleChange}
            className="block h-14 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="space-y-2">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700">
            Sort By
          </label>
          <select
            id="sortBy"
            name="sortBy"
            value={localFilters.sortBy || ""}
            onChange={handleChange}
            className="block h-14 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="">Default</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </section>
  );
};
