import { DriveStep } from "driver.js";

// Welcome page tour steps
export const welcomeTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Welcome to TechstudioHR!",
      description: "This interactive tour will guide you through the setup process. Let's get started!",
    },
  },
  {
    element: '[data-tour="take-tour-button"]',
    popover: {
      title: "Video Tour",
      description: "Click here to watch a quick video overview of the platform's key features.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: '[data-tour="skip-tour-button"]',
    popover: {
      title: "Skip to Setup",
      description: "Or skip the video and start setting up your company profile right away.",
      side: "bottom",
      align: "start",
    },
  },
];

// Step 1 (Company Profile) tour steps
export const stepOneTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Step 1 of 3: Company Profile",
      description: "Let's set up your company profile. This information helps personalize your HR experience.",
    },
  },
  {
    element: '[data-tour="company-form"]',
    popover: {
      title: "Company Details Form",
      description:
        "Fill in your company details including name, industry, size, and address. All fields are required for a complete setup.",
      side: "left",
      align: "start",
    },
  },
];

// Step 2 (Team Setup) tour steps
export const stepTwoTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Step 2 of 3: Team Structure",
      description:
        "Time to structure your organization! Create departments and define roles with specific permissions.",
    },
  },
  {
    element: '[data-tour="team-form"]',
    popover: {
      title: "Suggested Departments",
      description:
        "We've suggested common departments to get you started. You can customize these, add new teams, or remove ones you don't need.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="team-accordion"]',
    popover: {
      title: "Team Details",
      description:
        "Click on any team to expand and see its roles. You can edit team names, add custom roles, and configure permissions for each role.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="add-team-button"]',
    popover: {
      title: "Add Custom Team",
      description: "Need a team that's not listed? Click here to create a custom department.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="add-role-button"]',
    popover: {
      title: "Add Custom Role",
      description: "Need a role that's not listed? Click here to create a custom role for any team.",
      side: "top",
      align: "start",
    },
  },
];

// Step 3 (Employee Setup) tour steps
export const stepThreeTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Step 3 of 3: Add Employees",
      description:
        "Final step! Let's bring your team onboard by adding employee information and assigning them to teams and roles.",
    },
  },
  {
    element: '[data-tour="employee-form"]',
    popover: {
      title: "Employee Details",
      description:
        "Enter employee details including their name, email, phone number, and assign them to the appropriate team and role you created in the previous step.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="add-another-employee"]',
    popover: {
      title: "Add More Employees",
      description: "Click here to add additional employees to your organization.",
      side: "top",
      align: "start",
    },
  },
];

// Combined all steps for a full tour
export const fullOnboardingTour: DriveStep[] = [
  ...welcomeTourSteps,
  ...stepOneTourSteps,
  ...stepTwoTourSteps,
  ...stepThreeTourSteps,
];
