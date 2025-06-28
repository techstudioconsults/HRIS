"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
import { Add, Export, Filter } from "iconsax-reactjs";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import empty1 from "~/images/empty-state.svg";
import { DashboardTable } from "../../../_components/dashboard-table";
import { employeeColumn, useEmployeeRowActions } from "../../../_components/dashboard-table/table-data";
import { useEmployeeService } from "../../services/use-service";

export const AllEmployees = () => {
  // const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [status, setStatus] = useState<string>("all");
  const { getRowActions } = useEmployeeRowActions();
  const [searchQuery, setSearchQuery] = useState("");

  const { useGetAllEmployees } = useEmployeeService();

  // Create filters object
  const filters: IFilters = {
    page: currentPage,
    ...(status !== "all" && { status: status as "published" | "draft" }),
    ...(searchQuery && { search: searchQuery }),
  };

  // Fetch products data
  const { data: employeeData, isLoading: isProductsLoading } = useGetAllEmployees(filters, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className={`space-y-10`}>
      <section className={`space-y-4`}>
        <section className={`flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center`}>
          <div className="">
            <h1 className="text-2xl font-bold">Employee</h1>
            <p>All Employees</p>
          </div>
          <div className="">
            <div className="flex items-center gap-2">
              <SearchInput onSearch={setSearchQuery} />
              <MainButton
                className="border-gray-75 bg-background border-1 px-3 text-black dark:text-white"
                variant="outline"
                isLeftIconVisible
                size="lg"
                icon={<Filter />}
              >
                Filter
              </MainButton>
              <MainButton
                className="border-gray-75 bg-background border-1 px-3 text-black dark:text-white"
                variant="outline"
                size="lg"
                isLeftIconVisible={true}
                icon={<Export />}
              >
                Export
              </MainButton>
              <MainButton
                href="/admin/employees/add-employee"
                variant="primary"
                isLeftIconVisible
                size="lg"
                icon={<Add />}
              >
                Add Employee
              </MainButton>
            </div>
          </div>
        </section>
        {isProductsLoading ? (
          <Loading text={`Loading employee table.`} className={`w-fill h-fit p-20`} />
        ) : (
          <section>
            {employeeData?.data?.items.length ? (
              <section>
                <DashboardTable
                  data={employeeData.data.items}
                  columns={employeeColumn}
                  currentPage={employeeData.data.metadata.page}
                  totalPages={employeeData.data.metadata.totalPages}
                  itemsPerPage={employeeData.data.metadata.limit}
                  hasPreviousPage={employeeData.data.metadata.hasPreviousPage}
                  hasNextPage={employeeData.data.metadata.hasNextPage}
                  onPageChange={handlePageChange}
                  rowActions={getRowActions}
                  showPagination
                  // onRowClick={(employee) => {
                  //   router.push(`/dashboard/${user?.id}/products/${product.id}`);
                  // }}
                />
              </section>
            ) : dateRange?.from || dateRange?.to || status !== "all" ? (
              <FilteredEmptyState
                onReset={() => {
                  setDateRange(undefined);
                  setStatus("all");
                  setCurrentPage(1);
                }}
              />
            ) : (
              <EmptyState
                images={[{ src: empty1.src, alt: "No employees", width: 100, height: 100 }]}
                title="No employee yet."
                description="Once you add team members, you’ll see their details here, including department, role, work status, and more."
                button={{
                  text: "Add New Employee",
                  onClick: () => {
                    return;
                    // router.push(`/dashboard/products/new`);
                  },
                }}
              />
            )}
          </section>
        )}
      </section>
    </section>
  );
};
