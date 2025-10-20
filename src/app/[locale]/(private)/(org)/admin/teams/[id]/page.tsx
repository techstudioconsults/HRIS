// import { AddEmployeeForm } from "@/modules/@org/admin/employee/_components/forms/add-employee";

import { TeamDetails } from "@/modules/@org/admin/teams/_views/team-details";

const page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <>
      <TeamDetails
        params={{
          id,
        }}
      />
    </>
  );
};
export default page;
