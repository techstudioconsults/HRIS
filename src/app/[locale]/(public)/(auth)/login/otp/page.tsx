"use client";

import { InputOtpCard } from "@/modules/@org/auth";

const LoginPage = () => {
  const getCurrentView = () => {
    return <InputOtpCard />;
  };

  return <section>{getCurrentView()}</section>;
};

export default LoginPage;
