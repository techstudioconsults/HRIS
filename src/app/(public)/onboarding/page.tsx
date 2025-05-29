"use client";

import { useSearchParameters } from "@/hooks/use-search-parameters";
import { StepOne, StepThree, StepTwo, Welcome } from "@/modules/@org/onboarding";

const OnboardingPage = () => {
  const value = useSearchParameters("step");

  const renderStep = () => {
    switch (value) {
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
