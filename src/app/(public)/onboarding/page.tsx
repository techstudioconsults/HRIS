"use client";

import { StepOne, StepThree, StepTwo, Welcome } from "@/modules/@org/onboarding";
import { useSearchParams } from "next/navigation";

const OnboardingPage = () => {
  const searchParameters = useSearchParams();
  const step = searchParameters.get("step");

  const renderStep = () => {
    switch (step) {
      case "1": {
        return <StepOne />;
      }
      case "2": {
        return <StepTwo />;
      }
      case "3": {
        return <StepThree />;
      }
      default: {
        return <Welcome />;
      }
    }
  };

  return <div className="onboarding-container">{renderStep()}</div>;
};

export default OnboardingPage;
