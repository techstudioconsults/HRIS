"use client";

import Loading from "@/app/Loading";
import { SearchInput } from "@/components/core/miscellaneous/search-input";
import MainButton from "@/components/shared/button";
import { ReusableDialog } from "@/components/shared/dialog/Dialog";
import { EmptyState, FilteredEmptyState } from "@/components/shared/empty-state";
// import { TeamForm } from "@/modules/@org/onboarding/_components/forms/team/team-form";
import { Add } from "iconsax-reactjs";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import empty1 from "~/images/empty-state.svg";
import { DashboardTable } from "../../../_components/dashboard-table";
import { teamColumn, useTeamRowActions } from "../../../_components/dashboard-table/table-data";
import { useTeamService } from "../../services/use-service";

export const AllTeams = () => {
  // const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [status, setStatus] = useState<string>("all");
  const { getRowActions } = useTeamRowActions();
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [, setCurrentRole] = useState<Role | null>(null);
  const [dialogType, setDialogType] = useState<"team" | "role">("team");

  const handleOpenTeamDialog = (team?: Team) => {
    setCurrentTeam(team || null);
    setCurrentRole(null);
    setDialogType("team");
    setDialogOpen(true);
  };

  // const handleOpenRoleDialog = (team: Team, role?: Role) => {
  //   setCurrentTeam(team);
  //   setCurrentRole(role || null);
  //   setDialogType("role");
  //   setDialogOpen(true);
  // };

  const { useGetAllTeams } = useTeamService();

  // Create filters object
  const filters: IFilters = {
    page: currentPage,
    ...(status !== "all" && { status: status as "published" | "draft" }),
    ...(searchQuery && { search: searchQuery }),
  };

  // Fetch products data
  const { data: teamData, isLoading: isProductsLoading } = useGetAllTeams(filters);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <section className={`space-y-10`}>
        <section className={`space-y-4`}>
          <section className={`flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center`}>
            <div className="">
              <h1 className="text-2xl font-bold">Teams</h1>
              <p>All Teams</p>
            </div>
            <div className="">
              <div className="flex items-center gap-2">
                <SearchInput className={`h-10`} placeholder={`Search teams...`} onSearch={setSearchQuery} />
                {/* <MainButton
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
              </MainButton> */}
                <MainButton
                  variant="primary"
                  isLeftIconVisible
                  size="lg"
                  icon={<Add />}
                  onClick={() => handleOpenTeamDialog()}
                >
                  Add Team
                </MainButton>
              </div>
            </div>
          </section>
          {isProductsLoading ? (
            <Loading text={`Loading teams table...`} className={`w-fill h-fit p-20`} />
          ) : (
            <section>
              {teamData?.data?.items.length ? (
                <section>
                  <DashboardTable
                    data={teamData.data.items}
                    columns={teamColumn}
                    // currentPage={teamData.data.metadata.page}
                    // totalPages={teamData.data.metadata.totalPages}
                    // itemsPerPage={teamData.data.metadata.limit}
                    // hasPreviousPage={teamData.data.metadata.hasPreviousPage}
                    // hasNextPage={teamData.data.metadata.hasNextPage}
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
                  className={`bg-background`}
                  images={[{ src: empty1.src, alt: "No employees", width: 100, height: 100 }]}
                  title="No team added yet."
                  description="Add teams  to better organize your workforce, assign leads, and manage roles across your organization.."
                  button={{
                    text: "Add New Team",
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

      <ReusableDialog
        open={dialogOpen && dialogType === "team"}
        onOpenChange={setDialogOpen}
        title={currentTeam ? "Edit Team" : "Add New Team"}
        description={currentTeam ? "Modify the team details" : "Create a new team for your organization"}
      >
        {/* <TeamForm
          // onSubmit={(data) => {
          //   return currentTeam ? handleUpdateTeam(currentTeam.id!, data.name) : handleAddTeam(data.name);
          // }}
          onCancel={() => setDialogOpen(false)}
          onSubmit={() => {}} // isSubmitting={isSubmitting}
        /> */}
      </ReusableDialog>

      {/* <ReusableDialog
        open={dialogOpen && dialogType === "role"}
        onOpenChange={setDialogOpen}
        title={currentRole ? "Edit Role" : "Add New Role"}
        description={currentRole ? "Modify the role details" : "Create a new role for this team"}
        className={`!max-w-2xl`}
      >
        {currentTeam && (
          <RolesAndPermission
            initialData={currentRole}
            onSubmit={(data) => {
              return currentRole ? handleUpdateRole(currentRole.id!, data) : handleAddRole(currentTeam.id!, data);
            }}
            onCancel={() => setDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        )}
      </ReusableDialog> */}
    </>
  );
};
