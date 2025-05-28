import { StepOne, StepThree, StepTwo, Welcome } from "@/modules/@org/onboarding";

type OnboardingPageProperties = {
  searchParams: {
    step?: number;
  };
};

const OnboardingPage = ({ searchParams }: OnboardingPageProperties) => {
  // Determine the current step from query params, default to 'welcome'
  const currentStep = searchParams.step || "welcome";

  const renderStep = () => {
    switch (currentStep) {
      case 1: {
        return <StepOne />;
      }
      case 2: {
        return <StepTwo />;
      }
      case 3: {
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
