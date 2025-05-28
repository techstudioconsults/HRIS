"use client";

import { CheckMailCard, ForgotPassword, InputOtpCard } from "@/modules/@org/auth";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const searchParameters = useSearchParams();
  const view = searchParameters.get("view");

  const getCurrentView = () => {
    if (view === "mail") return <CheckMailCard />;
    if (view === "otp") return <InputOtpCard />;
    return <ForgotPassword />;
  };

  return <section>{getCurrentView()}</section>;
};

export default Page;
