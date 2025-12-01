"use client";

import { FormField } from "@workspace/ui/lib";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDebounce } from "use-debounce";

interface FilterValues {
  search?: string;
  status?: string;
  sortBy?: string;
  limit?: string;
  page?: string;
}

export const FilterForm = ({
  initialFilters,
  onFilterChange,
}: {
  initialFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}) => {
  const methods = useForm<FilterValues>({
    defaultValues: initialFilters,
  });
  const [debouncedFilters] = useDebounce(methods.watch(), 300);

  // Sync form with parent's filter state when it changes (e.g., on reset)
  useEffect(() => {
    methods.reset(initialFilters);
  }, [initialFilters, methods]);

  useEffect(() => {
    onFilterChange(debouncedFilters);
  }, [debouncedFilters, onFilterChange]);

  const handleFilterChange = (name: keyof FilterValues, value: string) => {
    const actualValue = value === "all" ? undefined : value;
    methods.setValue(name, actualValue);
    methods.setValue("page", "1"); // Reset to first page on filter change
  };

  return (
    <FormProvider {...methods}>
      <section className="mx-auto max-w-[527px] p-7">
        <h5 className="mb-4 text-xl">Filter Teams</h5>
        <div className="space-y-4">
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
              { value: "name_asc", label: "Name (A-Z)" },
              { value: "name_desc", label: "Name (Z-A)" },
              { value: "created_at_asc", label: "Created Date (Oldest)" },
              { value: "created_at_desc", label: "Created Date (Newest)" },
              { value: "members_asc", label: "Members (Fewest)" },
              { value: "members_desc", label: "Members (Most)" },
            ]}
            onChange={(event) => handleFilterChange("sortBy", event.target.value)}
            className="!h-12"
          />

          {/* Items Per Page */}
          <FormField
            name="limit"
            label="Items Per Page"
            type="select"
            placeholder="10"
            options={[
              { value: "5", label: "5" },
              { value: "10", label: "10" },
              { value: "20", label: "20" },
              { value: "50", label: "50" },
            ]}
            onChange={(event) => handleFilterChange("limit", event.target.value)}
            className="!h-12"
          />
        </div>
      </section>
    </FormProvider>
  );
};
