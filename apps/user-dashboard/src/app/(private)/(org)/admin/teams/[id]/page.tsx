// import { AddEmployeeForm } from "@/modules/@org/admin/employee/_components/forms/add-employee";

import { TeamDetails } from '@/modules/@org/admin/teams/_views/team-details';

type PageProps = {
  params: Promise<{ id: string }>;
};

const Page = async ({ params }: PageProps) => {
  const { id } = await params;

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
export default Page;
