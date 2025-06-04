"use client";

import { useSearchParameters } from "@/hooks/use-search-parameters";
import { CheckMailCard, ForgotPassword } from "@/modules/@org/auth";

const Page = () => {
  const value = useSearchParameters("view");

  const getCurrentView = () => {
    if (value === "mail") return <CheckMailCard />;
    return <ForgotPassword />;
  };

  return <section>{getCurrentView()}</section>;
};

export default Page;
