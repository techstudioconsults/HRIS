import { Step } from "react-joyride";

// Welcome page tour steps
export const welcomeTourSteps: Step[] = [
  {
    target: "body",
    content:
      "Welcome to TechstudioHR onboarding! This interactive tour will guide you through the setup process. Let's get started!",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="take-tour-button"]',
    content: "Click here to watch a quick video overview of the platform's key features.",
    placement: "bottom",
  },
  {
    target: '[data-tour="skip-tour-button"]',
    content: "Or skip the video and start setting up your company profile right away.",
    placement: "bottom",
  },
];

// Step 1 (Company Profile) tour steps
export const stepOneTourSteps: Step[] = [
  {
    target: "body",
    content: "Step 1 of 3: Let's set up your company profile. This information helps personalize your HR experience.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="company-form"]',
    content:
      "Fill in your company details including name, industry, size, and address. All fields are required for a complete setup.",
    placement: "left",
  },
  {
    target: '[data-tour="skip-form"]',
    content: "If you're not ready to provide this information, you can skip and complete it later from the dashboard.",
    placement: "top",
  },
];

// Step 2 (Team Setup) tour steps
export const stepTwoTourSteps: Step[] = [
  {
    target: "body",
    content:
      "Step 2 of 3: Time to structure your organization! Create departments and define roles with specific permissions.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="team-accordion"]',
    content:
      "Click on any team to expand and see its roles. You can edit team names, add custom roles, and configure permissions for each role.",
    placement: "right",
  },
  {
    target: '[data-tour="add-team-button"]',
    content: "Need a team that's not listed? Click here to create a custom department.",
    placement: "top",
  },
  {
    target: '[data-tour="add-role-button"]',
    content: "Need a role that's not listed? Click here to create a custom role.",
    placement: "top",
  },
];

// Step 3 (Employee Setup) tour steps
export const stepThreeTourSteps: Step[] = [
  {
    target: "body",
    content:
      "Step 3 of 3: Final step! Let's bring your team onboard by adding employee information and assigning them to teams and roles.",
    placement: "center",
    disableBeacon: true,
  },
  {
    target: '[data-tour="employee-form"]',
    content:
      "Enter employee details including their name, email, phone number, and assign them to the appropriate team and role you created in the previous step.",
    placement: "left",
  },
  {
    target: '[data-tour="add-another-employee"]',
    content:
      "Enter employee details including their name, email, phone number, and assign them to the appropriate team and role you created in the previous step.",
    placement: "left",
  },
];

// Combined all steps for a full tour
export const fullOnboardingTour: Step[] = [
  ...welcomeTourSteps,
  ...stepOneTourSteps,
  ...stepTwoTourSteps,
  ...stepThreeTourSteps,
];
