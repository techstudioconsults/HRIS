"use client";

import { useSearchParameters } from "@/hooks/use-search-parameters";
import { Login, OTPLogin } from "@/modules/@org/auth";

const LoginPage = () => {
  const value = useSearchParameters("type");

  const getCurrentView = () => {
    if (value === "otp") return <OTPLogin />;
    return <Login />;
  };

  return <section>{getCurrentView()}</section>;
};

export default LoginPage;
