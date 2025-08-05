"use client";

import { redirect } from "next/navigation";

const OnboardingPage = () => {
  redirect("/onboarding/welcome");
};

export default OnboardingPage;
