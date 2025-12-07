import { SubTeamDetails } from "../../../../../../../modules/@org/admin/teams";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

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
