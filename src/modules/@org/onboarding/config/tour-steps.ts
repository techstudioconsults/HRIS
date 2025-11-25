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
    target: '[data-tour="welcome-heading"]',
    content: "This is your starting point. You can either take a quick video tour or jump right into the setup.",
    placement: "bottom",
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
    target: '[data-tour="progress-indicator"]',
    content: "Track your progress through the 3-step onboarding process here.",
    placement: "bottom",
  },
  {
    target: '[data-tour="step-heading"]',
    content: "We'll gather basic information about your company to customize the platform for your needs.",
    placement: "bottom",
  },
  {
    target: '[data-tour="company-form"]',
    content:
      "Fill in your company details including name, industry, size, and address. All fields are required for a complete setup.",
    placement: "left",
  },
  {
    target: '[data-tour="company-name"]',
    content: "Enter your company's legal or registered business name.",
    placement: "right",
  },
  {
    target: '[data-tour="company-industry"]',
    content: "Select the industry that best describes your business.",
    placement: "right",
  },
  {
    target: '[data-tour="company-size"]',
    content: "Choose your company size range. This helps us tailor features and recommendations.",
    placement: "right",
  },
  {
    target: '[data-tour="company-address"]',
    content: "Provide your company's physical address for legal and tax purposes.",
    placement: "right",
  },
  {
    target: '[data-tour="submit-button"]',
    content: "Once all fields are complete, click here to save and proceed to team setup.",
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
    target: '[data-tour="progress-indicator"]',
    content: "You're making great progress! Two steps down, one to go.",
    placement: "bottom",
  },
  {
    target: '[data-tour="step-heading"]',
    content:
      "Build your organizational structure by creating teams (departments) and assigning roles with appropriate access levels.",
    placement: "bottom",
  },
  {
    target: '[data-tour="team-form"]',
    content:
      "We've suggested common departments to get you started. You can customize these, add new teams, or remove ones you don't need.",
    placement: "left",
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
    target: '[data-tour="continue-button"]',
    content: "When your team structure is ready, continue to the final step where you'll add your employees.",
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
    target: '[data-tour="progress-indicator"]',
    content: "Almost there! This is the final step of your onboarding journey.",
    placement: "bottom",
  },
  {
    target: '[data-tour="step-heading"]',
    content:
      "Add your team members one by one, or use bulk import to add multiple employees at once (available after setup).",
    placement: "bottom",
  },
  {
    target: '[data-tour="employee-form"]',
    content:
      "Enter employee details including their name, email, phone number, and assign them to the appropriate team and role you created in the previous step.",
    placement: "left",
  },
  {
    target: '[data-tour="employee-name"]',
    content: "Enter the employee's full name as it should appear in the system.",
    placement: "right",
  },
  {
    target: '[data-tour="employee-email"]',
    content: "This email will be used for login and system notifications.",
    placement: "right",
  },
  {
    target: '[data-tour="employee-team"]',
    content: "Assign the employee to one of the teams you created earlier.",
    placement: "right",
  },
  {
    target: '[data-tour="employee-role"]',
    content: "Select the role that defines their permissions and access level within their team.",
    placement: "right",
  },
  {
    target: '[data-tour="add-another-employee"]',
    content: "Click here to add additional employees to your organization.",
    placement: "top",
  },
  {
    target: '[data-tour="finish-button"]',
    content:
      "Once you've added your team members, click here to complete the onboarding process and access your dashboard!",
    placement: "top",
  },
];

// Combined all steps for a full tour
export const fullOnboardingTour: Step[] = [
  ...welcomeTourSteps,
  ...stepOneTourSteps,
  ...stepTwoTourSteps,
  ...stepThreeTourSteps,
];
