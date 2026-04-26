// import { AddEmployeeForm } from "@/modules/@org/admin/employee/_components/forms/add-employee";

import { TeamDetails } from '@/modules/@org/admin/teams/_views/team-details';

import { type PageProps } from './types';

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
