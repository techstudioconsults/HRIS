"use client";

import { AllTeams } from "@/modules/@org/admin/teams";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  // eslint-disable-next-line no-console
  console.log(session);
  return (
    <div>
      <AllTeams />
    </div>
  );
};

export default Page;
