"use client";

import { FormField } from "@workspace/ui/lib";
import { cn } from "@workspace/ui/lib/utils";
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

type FilterOption = {
  value: string;
  label: string;
};

export const FilterForm = ({
  initialFilters,
  onFilterChange,
  title = "Filter Teams",
  hideTitle = false,
  containerClassName,
  statusOptions,
  sortOptions,
  limitOptions,
  statusLabel = "Status",
  statusPlaceholder = "All Statuses",
  sortByLabel = "Sort By",
  sortByPlaceholder = "Default",
  limitLabel = "Items Per Page",
  limitPlaceholder = "10",
  showStatus = true,
  showSortBy = true,
  showLimit = true,
}: {
  initialFilters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  title?: string;
  hideTitle?: boolean;
  containerClassName?: string;
  statusOptions?: FilterOption[];
  sortOptions?: FilterOption[];
  limitOptions?: FilterOption[];
  statusLabel?: string;
  statusPlaceholder?: string;
  sortByLabel?: string;
  sortByPlaceholder?: string;
  limitLabel?: string;
  limitPlaceholder?: string;
  showStatus?: boolean;
  showSortBy?: boolean;
  showLimit?: boolean;
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
      <section className={cn("mx-auto max-w-[527px] p-7", containerClassName)}>
        {!hideTitle && <h5 className="mb-4 text-xl">{title}</h5>}
        <div className="space-y-4">
          {/* Status Dropdown */}
          {showStatus && (
            <FormField
              name="status"
              label={statusLabel}
              type="select"
              placeholder={statusPlaceholder}
              options={
                statusOptions ?? [
                  { value: "all", label: "All Statuses" },
                  { value: "active", label: "Active" },
                  { value: "inactive", label: "Inactive" },
                ]
              }
              onChange={(event) => handleFilterChange("status", event.target.value)}
              className="!h-12"
            />
          )}

          {/* Sort By Dropdown */}
          {showSortBy && (
            <FormField
              name="sortBy"
              label={sortByLabel}
              type="select"
              placeholder={sortByPlaceholder}
              options={
                sortOptions ?? [
                  { value: "all", label: "Default" },
                  { value: "name_asc", label: "Name (A-Z)" },
                  { value: "name_desc", label: "Name (Z-A)" },
                  { value: "created_at_asc", label: "Created Date (Oldest)" },
                  { value: "created_at_desc", label: "Created Date (Newest)" },
                  { value: "members_asc", label: "Members (Fewest)" },
                  { value: "members_desc", label: "Members (Most)" },
                ]
              }
              onChange={(event) => handleFilterChange("sortBy", event.target.value)}
              className="!h-12"
            />
          )}

          {/* Items Per Page */}
          {showLimit && (
            <FormField
              name="limit"
              label={limitLabel}
              type="select"
              placeholder={limitPlaceholder}
              options={
                limitOptions ?? [
                  { value: "5", label: "5" },
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                ]
              }
              onChange={(event) => handleFilterChange("limit", event.target.value)}
              className="!h-12"
            />
          )}
        </div>
      </section>
    </FormProvider>
  );
};
