"use client";

import { useSearchParameters } from "@/hooks/use-search-parameters";
import { CheckMailCard, ForgotPassword, InputOtpCard } from "@/modules/@org/auth";

const Page = () => {
  const value = useSearchParameters("view");

  const getCurrentView = () => {
    if (value === "mail") return <CheckMailCard />;
    if (value === "otp") return <InputOtpCard />;
    return <ForgotPassword />;
  };

  return <section>{getCurrentView()}</section>;
};

export default Page;
