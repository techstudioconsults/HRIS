"use client";

import { useSearchParameters } from "@/hooks/use-search-parameters";
import { EmployeeSetup, StepOne, TeamSetupPage, Welcome } from "@/modules/@org/onboarding";

const OnboardingPage = () => {
  const value = useSearchParameters("step");

  const renderStep = () => {
    switch (value) {
      case "1": {
        return <StepOne />;
      }
      case "2": {
        return <TeamSetupPage />;
      }
      case "3": {
        return <EmployeeSetup />;
      }
      default: {
        return <Welcome />;
      }
    }
  };

  return <div className="onboarding-container">{renderStep()}</div>;
};

export default OnboardingPage;
