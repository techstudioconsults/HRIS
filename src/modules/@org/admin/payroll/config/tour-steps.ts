import { DriveStep } from "driver.js";

// Payroll Overview tour steps
export const payrollSetupTourStep: DriveStep[] = [
  {
    element: '[data-tour="payroll-setup-wallet"]',
    popover: {
      title: "Payroll setup almost complete!",
      description:
        "Great job setting up your payroll policy. The final step is to set up your payment wallet to start processing payroll.",
      side: "right",
      align: "start",
    },
  },
];
export const generatePayrollTourStep: DriveStep[] = [
  {
    element: '[data-tour="generate-payroll"]',
    popover: {
      title: "Generate Payroll",
      description:
        "Click here to generate payroll for the current pay period. This will calculate salaries, bonuses, and deductions for all employees.",
      side: "right",
      align: "start",
    },
  },
];

// Payroll Setup Form tour steps
export const payrollSetupTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Welcome to Payroll Setup!",
      description:
        "Let's configure your payroll system. This tour will guide you through setting up payroll frequency, approvals, bonuses, and deductions.",
    },
  },
  {
    element: '[data-tour="payroll-general-setup"]',
    popover: {
      title: "General Payroll Setup",
      description:
        "Start by configuring the core payroll settings including how often you pay employees, when payments are made, and who approves payroll.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="payroll-bonuses-deductions"]',
    popover: {
      title: "Global Bonuses & Deductions",
      description:
        "Configure bonuses and deductions that apply to all employees. These will be automatically calculated in every payroll run.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="payroll-bonuses"]',
    popover: {
      title: "Bonuses",
      description:
        "Add recurring bonuses like performance bonuses, allowances, or commissions. You can set them as fixed amounts or percentages.",
      side: "left",
      align: "start",
    },
  },
  {
    element: '[data-tour="payroll-deductions"]',
    popover: {
      title: "Deductions",
      description:
        "Add recurring deductions like tax, pension, health insurance, or loans. These can also be fixed amounts or percentages.",
      side: "left",
      align: "start",
    },
  },
];
