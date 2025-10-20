import { SubTeamDetails } from "@/modules/@org/admin/teams";

const Page = async ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <>
      <SubTeamDetails
        params={{
          id,
        }}
      />
    </>
  );
};

export default Page;
