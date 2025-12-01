"use client";

import { CheckMailCard, ForgotPassword } from "@/modules/@org/auth";
import { useSearchParameters } from "@workspace/ui/hooks";

const Page = () => {
  const value = useSearchParameters("view");

  const getCurrentView = () => {
    if (value === "mail") return <CheckMailCard />;
    return <ForgotPassword />;
  };

  return <main className="flex h-[calc(35rem)] items-center justify-center">{getCurrentView()}</main>;
};

export default Page;
