"use client";

import { SearchInput } from "@/modules/@org/shared/search-input";
import { Button } from "@workspace/ui/components/button";
import { DashboardHeader, GenericDropdown } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { Filter } from "iconsax-reactjs";
import { useRouter } from "next/navigation";

interface LeaveHeaderProperties {
  onSearch: (query: string) => void;
}

export const LeaveHeader = ({ onSearch }: LeaveHeaderProperties) => {
  const router = useRouter();

  return (
    <DashboardHeader
      title="Leave Hub"
      subtitle="View employee leave requests and manage leave types"
      actionComponent={
        <div className="flex items-center gap-4">
          <SearchInput
            className="border-border h-10 rounded-md border"
            placeholder="Search leave requests..."
            onSearch={onSearch}
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
            <section className="text-muted-foreground min-w-[220px] p-3 text-sm">
              Basic filtering for leave requests will be available soon.
            </section>
          </GenericDropdown>
          <MainButton
            variant="primary"
            onClick={() => {
              router.push("/admin/leave/type");
            }}
          >
            Manage Leave Types
          </MainButton>
        </div>
      }
    />
  );
};
