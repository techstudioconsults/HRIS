export { Welcome } from "./_views/welcome";
export { StepOne } from "./_views/step-one";
export { TeamSetupPage } from "./_views/step-two";
export { EmployeeSetup } from "./_views/step-three";

// Tour Guide exports
export { TourProvider, useTour } from "./context/tour-context";
export {
  welcomeTourSteps,
  stepOneTourSteps,
  stepTwoTourSteps,
  stepThreeTourSteps,
  fullOnboardingTour,
} from "./config/tour-steps";
