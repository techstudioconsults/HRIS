import { DriveStep } from "driver.js";

// Leave Setup tour steps
export const leaveSetupTourSteps: DriveStep[] = [
  {
    popover: {
      title: "Welcome to Leave Setup",
      description:
        "Let's configure your company's leave management system. This will help you manage time-off requests efficiently.",
    },
  },
  {
    element: '[data-tour="leave-types-section"]',
    popover: {
      title: "Leave Types",
      description:
        "Configure different types of leave available in your organization - Annual, Sick, Casual, and more.",
      side: "right",
      align: "start",
    },
  },
  {
    element: '[data-tour="leave-approvers"]',
    popover: {
      title: "Approvers",
      description: "Select employees who can approve leave requests. Typically managers or HR personnel.",
      side: "right",
      align: "start",
    },
  },
];

export const leaveOverviewTourSteps: DriveStep[] = [
  {
    element: '[data-tour="leave-requests-table"]',
    popover: {
      title: "Leave Requests",
      description:
        "View and manage all leave requests from your team. You can approve, decline, or view details for each request.",
      side: "top",
      align: "start",
    },
  },
  {
    element: '[data-tour="leave-filters"]',
    popover: {
      title: "Filter Requests",
      description: "Use these filters to find specific leave requests by status, type, or employee.",
      side: "bottom",
      align: "start",
    },
  },
];
