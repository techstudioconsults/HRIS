export interface Section {
  id: number;
  title: string;
  content: string;
  items?: string[];
  afterItems?: string;
  isNumbered?: boolean;
}

export interface SectionGroup {
  title?: string;
  description?: string;
  sections: Section[];
  videoUrl?: string;
  important?: {
    title: string;
    items: string[];
  };
}

export interface HelpArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  caution?: string;
  sections?: Section[];
  groups?: SectionGroup[];
  important?: {
    title: string;
    items: string[];
  };
  videoThumbnail?: string;
  videoUrl?: string;
}

export interface HelpCategory {
  title: string;
  slug: string;
  articles: HelpArticle[];
}

export const HELP_CENTER_DATA: HelpCategory[] = [
  {
    title: 'Getting Started',
    slug: 'getting-started',
    articles: [
      {
        id: 'create-organization',
        slug: 'create-your-organization',
        title: 'Create Your Organization Account',
        description:
          'Getting started with Techstudio HR is simple. Creating an organization account allows you to set up your company workspace, invite employees, and begin managing your HR operations in one centralized platform.\n\nYour organization account acts as the control center for your HR management, giving administrators the ability to manage employees, run payroll, track attendance, and configure company policies.\n\nBefore you begin, make sure you have a valid company email address and the basic details of your organization ready.',
        sections: [
          {
            id: 1,
            title: 'Visit the Techstudio HR Signup Page',
            content:
              'Open the Techstudio HR website and click Start Free Trial or Create Account. You will be redirected to the signup page where you can begin registering your organization.',
          },
          {
            id: 2,
            title: 'Enter Your Organization Details',
            content:
              'Provide the required information to register your organization. You will be asked to enter:',
            items: ['Company name', 'Company size', 'Company address'],
          },
          {
            id: 3,
            title: 'Set up team and invite employees',
            content:
              'You will be required to set up your team from product to Admin to sales and also set roles and role based permissions. whereby you can start inviting employees and assigning them to roles.',
          },
          {
            id: 4,
            title: 'Access Your Admin Dashboard',
            content:
              'Once your email has been verified, you will be able to log in to your Techstudio HR account. After logging in, you will be redirected to your admin dashboard, where you can begin setting up your organization workspace. The dashboard provides access to key features including:',
            items: [
              'Employee management',
              'Payroll processing',
              'Attendance tracking',
              'Leave management',
              'Organizational settings',
            ],
          },
        ],
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
    ],
  },
  {
    title: 'Teams',
    slug: 'teams',
    articles: [
      {
        id: 'set-up-team',
        slug: 'set-up-your-team',
        title: 'Set Up Your Team',
        description:
          'Learn how to setting up teams in your TechStudioHR organization. Follow the steps below to get started.',
        sections: [
          {
            id: 1,
            title: 'Navigate to the Employees Section',
            content:
              'From your dashboard sidebar, click Teams. This will open the Teams management page where all teams in your organization are listed.',
          },
          {
            id: 2,
            title: 'Create a New Team',
            content:
              'Click Add Team at the top right of the Teams page. Enter the team name and continue.',
          },
          {
            id: 3,
            title: 'Add Employees to the Team',
            content:
              'You can now assign employees to the team and select their roles.',
          },
          {
            id: 4,
            title: 'Team Created Successfully',
            content:
              'Once the process is complete, the team will appear in your Teams dashboard.',
          },
        ],
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
      {
        id: 'deleting-team',
        slug: 'deleting-a-team',
        title: 'Deleting a Team',
        description:
          'Learn how to safely remove a team structure while preserving employee data within TechStudioHR.',
        caution:
          'Deleting a team removes the organizational structure immediately. While employees are not deleted, their team associations will be cleared. Use this option carefully, especially if the team currently contains members or sub-teams.',
        sections: [
          {
            id: 1,
            title: 'Navigate to the Teams Page',
            content:
              'From your Dashboard, open the sidebar and click Teams. This will take you to the Teams management page, where all teams in your organization are listed. Here you can view team details such as team name, team lead, sub-teams, and number of members. You can also manage each team from the Actions menu.',
          },
          {
            id: 2,
            title: 'Open the Team Actions Menu',
            content:
              'Locate the team you want to remove from the list. On the far right of the team row, click the three-dot actions menu ... \nThis menu provides the following options: View Team, Edit Team, and Delete Team.',
          },
          {
            id: 3,
            title: 'Select "Delete Team"',
            content:
              'From the dropdown menu, click Delete Team. Once selected, the system will begin the deletion process.',
          },
        ],
        important: {
          title: 'Important Things to Know',
          items: [
            'Deleting a team removes the team structure from the system.',
            'Employees assigned to the team willnotbe deleted.',
            'You may need to reassign those employees to another team afterward.',
            'If the team contains active members, move them to another team before deleting.',
          ],
        },
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
      {
        id: 'create-sub-team',
        slug: 'creating-a-sub-team',
        title: 'Creating a Sub-Team',
        description:
          'Sub-teams allow you to organize larger teams into smaller functional groups. This is useful for structuring departments that contain multiple units or specialized groups.\n\nFor example, within an Engineering team, you might create sub-teams such as Frontend, Backend, or DevOps. \nThis guide explains how to create a sub-team within an existing team.',
        sections: [
          {
            id: 1,
            title: 'Navigate to the Teams Page',
            content:
              'From your Dashboard, open the sidebar and click Teams. This will take you to the Teams management page, where all teams in your organization are listed. Here you can view team details such as team name, team lead, sub-teams, and number of members. You can also manage each team from the Actions menu.',
          },
          {
            id: 2,
            title: 'Select the Team',
            content:
              'Locate the team where you want to create the sub-team. Click the three-dot actions menu ... on the right side of the team row and select View Team. This will open the Team Details page, where you can manage the structure of that team.',
          },
          {
            id: 3,
            title: 'Open the Team Details Page',
            content:
              'Once inside the team details page, you will see information such as:',
            items: [
              'Team name',
              'Team lead',
              'Members assigned to the team',
              'Existing sub-teams',
              'On this page, you will also find the Create Sub-Team button.',
            ],
          },
          {
            id: 4,
            title: 'Create the Sub-Team',
            content:
              'Click Create Sub-Team to begin the process. Enter the sub-team name and configure any necessary details.\n\nAfter entering the sub-team name, click Continue to complete the setup.',
          },
          {
            id: 5,
            title: 'Create the Sub-Team',
            isNumbered: false,
            content:
              'Once created, the new sub-team will appear under the parent team on the Team Details page. \nYou can then:',
            items: [
              'Assign employees to the sub-team',
              'Create roles within the sub-team',
              'Manage the sub-team independently',
            ],
            afterItems:
              'Sub-teams help make it easier to organize larger departments and maintain clear reporting structures.',
          },
        ],
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
    ],
  },
  {
    title: 'Employees',
    slug: 'employees',
    articles: [
      {
        id: 'add-new-employee',
        slug: 'adding-a-new-employee',
        title: 'Adding a New Employee',
        description:
          'Adding employees allows you to create profiles for members of your organization, assign them to teams, and define their roles within TechStudioHR.\n\nFollow the steps below to add a new employee.',
        sections: [
          {
            id: 1,
            title: 'Open the Employees Page',
            content:
              'From your TechStudioHR dashboard, navigate to the left sidebar and click Employees.\n\nThis will open the Employees page, where all employee profiles in your organization are listed.',
          },
          {
            id: 2,
            title: 'Click "Add Employee"',
            content:
              'On the Employees page, locate the Add Employee button at the top of the page. Click Add Employee to begin creating a new employee profile.',
          },
          {
            id: 3,
            title: 'Enter Employee Details',
            content: 'Fill in the required employee information:',
            items: [
              'Employee name',
              'Email address',
              'Role',
              'Assigned team',
              'etc',
              'Make sure the information entered is accurate before continuing.',
            ],
          },
          {
            id: 4,
            title: 'Complete the Setup',
            content:
              'After entering the employee details, click Continue or Save to complete the process.\n\nOnce completed, the employee will appear in the Employees list, and their profile can be viewed or edited anytime.',
          },
        ],
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
      {
        id: 'viewing-managing-employee',
        slug: 'viewing-and-managing-employee-details',
        title: 'Viewing and Managing Employee Details',
        description:
          'After adding employees to your organization, you can view and update their information at any time from the Employees page.\n\nThe employee details page allows administrators to review employee records, update information, and manage role or team assignments.',
        sections: [
          {
            id: 1,
            title: 'Open the Employees Page',
            content:
              'From your TechStudioHR dashboard, navigate to the left sidebar and click Employees.\n\nThis will open the Employees page, where all employee profiles in your organization are listed.',
          },
          {
            id: 2,
            title: 'Select an Employee',
            content:
              'On the Employees page, locate the employee whose details you want to view. Click on the employee from the list to open their Employee Details page.',
          },
          {
            id: 3,
            title: 'View Employee Information',
            content:
              'The Employee Details page displays important information about the selected employee. This may include:',
            items: [
              'Employee name',
              'Email address',
              'Assigned team',
              'Role within the organization',
              'Other profile information',
              'Administrators can review this information to ensure employee records are accurate and up to date.',
            ],
          },
          {
            id: 4,
            title: 'Edit Employee Information',
            content:
              "To update an employee's details, click Edit on the employee profile page. From here, you can modify information such as:",
            items: [
              'Employee details',
              'Assigned team',
              'Role or position',
              'After making the necessary changes, click Save to update the employee record.',
            ],
          },
          {
            id: 5,
            title: 'After Updating Employee Information',
            isNumbered: false,
            content:
              "Once changes are saved, the employee's profile will reflect the updated information.\n\nYou can return to the Employees page at any time to view or manage other employee profiles.",
          },
        ],
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
    ],
  },
  {
    title: 'Payroll',
    slug: 'payroll',
    articles: [
      {
        id: 'setup-payroll',
        slug: 'setting-up-payroll',
        title: 'Setting Up Payroll',
        description:
          'Define how salaries are calculated, pay frequencies, and organizational deductions. Once configured, manage compensation and run payroll with ease.',
        sections: [
          {
            id: 1,
            title: 'Open the Payroll Page',
            content:
              'From your TechStudioHR dashboard, locate the sidebar and click Payroll. This opens the Payroll Setup page, where you configure how payroll works across your organization.',
          },
          {
            id: 2,
            title: 'Configure General Payroll Settings',
            content:
              'Under General Payroll Setup, define the core payroll structure for your company. Configure the following:',
            items: [
              'Payroll Frequency: Select how often employees are paid — monthly, bi-weekly, or weekly cycles.',
              'Payday: Choose the specific calendar data for salary disbursement.',
              'Currency: Confirm the currency used for all payroll payments.',
              'Approval for Disbursement: Designate specific admins for final sign-off before salaries are processed.',
            ],
          },
          {
            id: 3,
            title: 'Configure Bonuses',
            content:
              'Bonuses allow you to apply additional earnings to employee salaries. To add a bonus:',
            items: [
              '1. Click Add Bonus',
              '2. Enter the Bonus Name',
              '3. Select the Value Type (percentage or fixed amount)',
              '4. Enter the Bonus Value',
              '5. Set the Status to Active if it should apply immediately',
            ],
          },
          {
            id: 4,
            title: 'Configure Deductions',
            content:
              'Deductions subtract specific amounts from employee salaries during payroll processing. To add a deduction:',
            items: [
              '1. Click Add Deduction',
              '2. Enter the Deduction Name',
              '3. Select the Value Type (percentage or fixed amount)',
              '4. Enter the Deduction Value',
              '5. Activate the deduction if it should apply automatically',
            ],
          },
          {
            id: 5,
            title: 'Save Payroll Configuration',
            content:
              "After completing your payroll settings, click Save & Continue. TechStudioHR applies these configurations to your organization's payroll system.",
          },
          {
            id: 6,
            title: 'Payroll Setup Completed',
            isNumbered: false,
            content:
              'Once your payroll configuration is saved, payroll is ready for use. You can now:',
            items: [
              'Review employee salary information',
              'Adjust bonuses or deductions when necessary',
              'Run payroll when it is time to pay employees',
            ],
          },
        ],
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
      {
        id: 'fund-payroll-wallet',
        slug: 'setting-up-and-funding-your-payroll-wallet',
        title: 'Setting Up and Funding Your Payroll Wallet',
        description:
          'The payroll wallet securely holds funds for employee salaries. Complete this setup to ensure uninterrupted payroll processing.',
        sections: [
          {
            id: 1,
            title: 'Open the Payroll Page',
            content:
              'This will open the Payroll Overview page, where you can see payroll summaries, employee payroll information, and your wallet balance.\n\nTo set up your wallet:',
            items: [
              '1. Click Fund Wallet on the Payroll Overview page.',
              '2. A Set up Payroll Wallet form will appear. Enter the required details: First Name, Last Name, Email Address, Phone Number',
              '3. Click Save & Continue to complete the wallet setup.',
            ],
            afterItems:
              'Once submitted, your payroll wallet will be created successfully.',
          },
          {
            id: 2,
            title: 'Confirm Wallet Setup',
            content:
              'After completing the setup, you will see a Wallet Setup Completed confirmation message.\n\nYour payroll wallet is now ready to receive funds. You can proceed to fund the wallet so payroll payments can be processed.',
          },
          {
            id: 3,
            title: 'Fund Your Payroll Wallet',
            content: 'To add money to your payroll wallet:',
            items: [
              '1. Click Fund Wallet on the Payroll Overview page.',
              '2. A funding modal will appear displaying your dedicated bank account details.',
              '3. Transfer the desired amount to the provided account using your bank.',
            ],
            afterItems:
              'Your organization will receive a unique virtual account used specifically for payroll funding.',
          },
          {
            id: 4,
            title: 'Verify Wallet Balance',
            content:
              'After funding the wallet, return to the Payroll Overview page. Your updated Wallet Balance will be displayed, confirming that funds are available for payroll processing. You can now proceed to generate and run payroll for your employees.',
          },
        ],
        important: {
          title: 'Important Notes',
          items: [
            'The bank account provided is unique to your organization.',
            'Transfers must be verified by the payment provider before the wallet balance is updated.',
            'Once payment is confirmed, the funds will automatically appear in your Payroll Wallet Balance.',
          ],
        },
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
      {
        id: 'generate-payroll',
        slug: 'generating-payroll',
        title: 'Generating Payroll',
        description:
          "Generating payroll allows TechStudioHR to automatically calculate employee salaries for the current payroll period. During this process, the system applies all configured salary structures, bonuses, and deductions to produce each employee's final pay.",
        sections: [
          {
            id: 1,
            title: 'Open the Payroll Page',
            content:
              'From your TechStudioHR dashboard, locate the sidebar and click Payroll (after you must have set up payroll). This will open the Payroll Overview page, where payroll activities are managed.\n\nOn this page, you will see payroll summaries, employee payroll information, and',
          },
          {
            id: 2,
            title: 'Generate Payroll',
            content:
              'On the Payroll Overview page, click Generate Payroll.\n\nTechStudioHR will begin calculating payroll for all employees based on the configured payroll settings.\n\nDuring this process, the system automatically:\nCalculates employee gross pay\nApplies configured bonuses\nApplies deductions such as taxes or insurance\nDetermines the final net pay for each employee\n\nA Generating Payroll progress indicator will appear while the system processes the payroll calculations',
          },
          {
            id: 3,
            title: 'Review the Generated Payroll',
            content:
              'Once payroll generation is complete, the Employee Payroll Summary table will be populated.\n\nHere you can review payroll information for all employees, including:',
            items: [
              'Employee name and role',
              'Gross pay',
              'Net pay',
              'Bonuses applied',
              'Deductions applied',
              'Payroll status',
            ],
            afterItems:
              'This review step helps ensure payroll calculations are accurate before processing payments.',
          },
          {
            id: 4,
            title: 'Proceed to Run Payroll',
            content:
              'After confirming that all payroll information is correct, you can proceed to salary disbursement.\n\nClick Run Payroll to initiate employee payments using the funds available in your Payroll Wallet.',
          },
        ],
        important: {
          title: 'Important Notes',
          items: [
            'Payroll must be generated before payroll can be run.',
            'Ensure your Payroll Wallet has sufficient funds before running payroll.',
            'Always review payroll details before initiating payment.',
          ],
        },
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
      {
        id: 'exclude-add-employee-payroll',
        slug: 'excluding-or-adding-an-employee-to-payroll',
        title: 'Excluding or Adding an Employee to Payroll',
        description:
          'Manage payroll cycles by temporarily removing inactive or reviewed employees without deleting their records.',
        groups: [
          {
            title: 'Excluding an Employee from Payroll',
            description:
              'If an employee should not be included in the current payroll cycle, you can exclude them from the payroll list.',
            sections: [
              {
                id: 1,
                title: 'Open the Payroll Page',
                content:
                  'From your TechStudioHR dashboard, click Payroll in the sidebar. This will open the Payroll Overview page with the Employee Payroll Summary table.',
              },
              {
                id: 2,
                title: 'Locate the Employee',
                content:
                  'Find the employee you want to exclude in the Employee Payroll Summary list. Each row contains an Action menu represented by the three-dot icon.',
              },
              {
                id: 3,
                title: 'Exclude the Employee',
                content:
                  'Click the Action (...) menu and select Exclude Employee. The employee will be removed from the payroll calculation for that cycle.',
              },
            ],
            videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
          },
          {
            title: 'Adding an Employee Back to Payroll',
            description:
              'If an employee was excluded by mistake or needs to be included again, you can easily add them back.',
            sections: [
              {
                id: 1,
                title: 'Click Add Employee',
                content:
                  'On the Payroll Overview page, click Add Employee above the payroll table. This allows you to include employees currently excluded from the cycle.',
              },
              {
                id: 2,
                title: 'Select the Employee',
                content:
                  "Choose the employee you want to add back. Once selected, they'll be included in the Employee Payroll Summary list with their salary, bonuses, and deductions applied.",
              },
            ],
            important: {
              title: 'Important Notes',
              items: [
                'Excluded employees will not receive payment for the current payroll cycle.',
                'You can add excluded employees back at any time before running payroll.',
                'Always review the payroll summary to ensure the correct employees are included.',
              ],
            },
            videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
          },
        ],
      },
      {
        id: 'run-schedule-payroll',
        slug: 'running-or-scheduling-payroll',
        title: 'Running or Scheduling Payroll',
        description:
          'Choose whether to process immediate payments or set up future payment dates for your organization.\n\nOnce payroll has been generated, you can proceed to run payroll immediately or schedule it for a later date.\n\nRunning payroll sends the payment for processing, either for immediate disbursement or for future disbursement based on your selection.',
        groups: [
          {
            title: 'Running Payroll',
            description:
              'Running payroll processes the payments immediately for the current payroll cycle.',
            sections: [
              {
                id: 1,
                title: 'Open the Payroll Page',
                content:
                  'From your TechStudioHR dashboard, click Payroll in the sidebar. This will open the Payroll Overview page with the Employee Payroll Summary table.',
              },
              {
                id: 2,
                title: 'Generate Payroll (if not already generated)',
                content:
                  'Before running payroll, ensure payroll has been generated.\nIf payroll has not yet been generated, follow the instructions for generating payroll.',
              },
              {
                id: 3,
                title: 'Click Run Payroll',
                content:
                  'Once payroll has been generated, click Run Payroll at the top of the Payroll Overview page.\nA modal will appear asking you to confirm that you are ready to process payroll for payment processing.',
              },
              {
                id: 4,
                title: 'Review Payroll Details',
                content:
                  'On the Run Payroll Modal, review the payroll summary including:',
                items: [
                  'Total amount to be paid (Net Pay)',
                  'Total payroll deductions',
                  'Number of employees',
                  'Total amount to be disbursed',
                  'Any other important review metrics',
                  'Account being charged for payment',
                ],
                afterItems:
                  'If any adjustments are needed, you can modify the payroll (such as excluding an employee) before proceeding.',
              },
              {
                id: 5,
                title: 'Confirm Payment Run',
                content: 'After reviewing the details, confirm:',
                items: [
                  'Authorize payment',
                  'Confirm disbursement and approve',
                  'Click Run / Pay Payroll to proceed',
                ],
                afterItems: 'The payroll will then be processed for payment.',
              },
              {
                id: 6,
                title: 'Payroll Processed',
                content: 'Once payment is completed:',
                items: [
                  'The payroll status becomes Pending / Approved',
                  'Payment is processed to employee bank accounts',
                  'Payslips are generated and employees can view them in their TechStudio portal',
                ],
              },
            ],
            videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
          },
          {
            title: 'Scheduling Payroll',
            description:
              'Instead of running payroll immediately, you can schedule it for payment processing on a specific date.',
            sections: [
              {
                id: 1,
                title: 'Open the Payroll Overview Page',
                content:
                  'After generating payroll, click Run Payroll to open the Payroll Review page.',
              },
              {
                id: 2,
                title: 'Select Schedule Payment',
                content:
                  'On the Run Payroll Review page, select Schedule Payment.\nA scheduling section will appear showing you to choose a payment date.',
              },
              {
                id: 3,
                title: 'Choose the Payment Date',
                content:
                  'Select the date you want the payroll to be processed.\nAfter selecting the date, click Confirm to save the scheduled payroll.',
              },
            ],
            videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
          },
          {
            title: 'Viewing Scheduled Payroll',
            description:
              'You can view and manage scheduled payroll from the Payroll menu options.',
            sections: [
              {
                id: 1,
                title: 'Open Payroll Options',
                content:
                  'On the Payroll Overview page, click on the three-dot menu beside the Run Payroll button.',
              },
              {
                id: 2,
                title: 'Select Scheduled Payroll',
                content:
                  'From the dropdown menu, select Scheduled Payroll.\nThis will open the Scheduled Payroll page, where you can view:',
                items: [
                  'Total payment amount due',
                  'Number of employees due',
                  'Assigner/Approver',
                  'Scheduled date for disbursement',
                ],
              },
            ],
            videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
          },
          {
            title: 'Managing scheduled payroll',
            description:
              'If you need to change a scheduled payroll, you can either adjust the date or cancel the disbursement.',
            sections: [
              {
                id: 1,
                title: 'Change Scheduled Date',
                isNumbered: false,
                content: 'Modify the scheduled payment date',
              },
              {
                id: 2,
                title: 'Cancel Payroll',
                isNumbered: false,
                content: 'Cancel the scheduled payroll before it is processed.',
              },
            ],
            videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
          },
        ],
      },
      {
        id: 'view-download-payslips',
        slug: 'viewing-and-downloading-employee-payslips',
        title: 'Viewing and Downloading Employee Payslips',
        description:
          "TechStudioHR allows administrators to view and download employee payslips directly from the payroll system. Payslips provide a detailed breakdown of each employee's salary for a specific payroll cycle.",
        sections: [
          {
            id: 1,
            title: 'Open the Payroll Page',
            content:
              'From your TechStudioHR dashboard, locate the sidebar and click Payroll. This will open the Payroll Overview page, where you can see the Employee Payroll Summary table containing all employees included in the payroll.',
          },
          {
            id: 2,
            title: 'Locate the Employee',
            content:
              'In the Employee Payroll Summary table, find the employee whose payslip you want to view. Each employee row includes an Action menu ... Click the three-dot menu beside the employee.',
          },
          {
            id: 3,
            title: 'Navigate to Payroll History',
            content:
              "On the Employee Payroll Details page, open the Payroll History section. This section displays the employee's payroll records for previous payroll cycles. Each entry represents a specific payroll month.",
          },
          {
            id: 4,
            title: 'Select the Payroll Record',
            content:
              'Find the payroll cycle you want to review. Click the three-dot action menu next to that payroll record. This will display options for accessing the payslip.',
          },
          {
            id: 5,
            title: 'View or Download the Payslip',
            content:
              'From the available options, you can View Payslip (opens with detailed breakdown) or Download Payslip (for record-keeping or sharing). The payslip includes employee name, role, cycle, gross salary, bonuses, deductions, and net pay.',
          },
        ],
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
    ],
  },
  {
    title: 'Attendance',
    slug: 'attendance',
    articles: [
      {
        id: 'setup-attendance',
        slug: 'setting-up-attendance',
        title: 'Setting Up Attendance',
        description:
          'The Attendance module in TechStudioHR helps organizations track employee work hours, punctuality, and attendance status. Administrators can configure attendance rules such as workdays, clock-in time, clock-out time, and late tolerance, as well as enable GPS-based clock-ins using geofencing. Once attendance is set up, employee attendance records can be viewed from the Attendance dashboard.',
        sections: [
          {
            id: 1,
            title: 'Open the Attendance Page',
            content:
              'From your TechStudioHR dashboard, locate the sidebar and click Attendance. This will open the Attendance module, where attendance records and policies are managed.',
          },
          {
            id: 2,
            title: 'Configure Attendance Policy',
            content:
              "On the Set Up Attendance page, define your organization's attendance rules. Configure workdays (e.g., Monday-Friday), set clock-in time (e.g., 09:00 AM), clock-out time (e.g., 05:00 PM), and late tolerance (e.g., 10 minutes).",
          },
          {
            id: 3,
            title: 'Enable Clock-in Method',
            content:
              'To ensure employees clock in from an approved location, configure geofencing. Set the office location address and radius control. Employees must be within this radius to successfully clock in.',
          },
          {
            id: 4,
            title: 'Add Attendance Notes',
            content:
              'Include internal notes describing the attendance policy. For example: "Clock-ins after 09:10 AM will be considered late." This helps clarify expectations for all stakeholders.',
          },
          {
            id: 5,
            title: 'Save Attendance Settings',
            content:
              'After configuring all attendance policies, click Save Attendance. A confirmation message will appear indicating successful configuration. Employees can now start marking attendance based on the rules you defined.',
          },
        ],
        videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
      },
    ],
  },
  {
    title: 'Leave Management',
    slug: 'leave-management',
    articles: [
      {
        id: 'leave-management',
        slug: 'leave-management',
        title: 'Leave Management',
        description:
          'The Leave Hub in TechStudioHR allows administrators to manage employee leave policies and review leave requests submitted by employees.',
        groups: [
          {
            title: 'Creating Leave Types',
            description:
              'Before employees can submit leave requests, administrators must first create leave types. Leave types define the categories of leave available, such as Annual Leave, Sick Leave, or Maternity Leave.',
            sections: [
              {
                id: 1,
                title: 'Open the Leave Hub',
                content:
                  'From your TechStudioHR dashboard, locate the sidebar and click Leave Hub. This opens the Leave Hub where leave types and leave requests are managed.',
              },
              {
                id: 2,
                title: 'Add a New Leave Type',
                content:
                  'On the Leave Hub page, click Add Leave Type. This will open the Add Leave Type form where you can configure the leave policy.',
              },
              {
                id: 3,
                title: 'Enter Leave Details',
                content: 'Provide the required information for the leave type.',
              },
              {
                id: 4,
                title: 'Configure Leave Roll Over (Optional)',
                content:
                  'You can enable roll over to allow unused leave days to carry forward into the next cycle. If enabled, specify the maximum number of days that can be rolled over.\n\nExample: Unused leave days up to 5 days can be carried into the next year.',
              },
              {
                id: 5,
                title: 'Set Employee Eligibility',
                content:
                  'Select which employees or groups are eligible for the leave type.',
                items: [
                  'All employees',
                  'Specific departments',
                  'Specific employee groups',
                ],
              },
              {
                id: 6,
                title: 'Save the Leave Type',
                content:
                  'After entering the required information, click Save Leave. The new leave type will now appear in the Leave Types table. Employees can now request this type of leave.',
              },
            ],
            videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
          },
          {
            title: 'Review Leave Request',
            description:
              'From the dashboard sidebar, click Leave Hub. This will display a table of all employee leave requests. Select and check the details of the request including leave type, duration, reason provided, and any supporting attachments. You can approve or reject leave.',
            sections: [],
            videoUrl: 'https://www.youtube.com/embed/dhdhshshs',
          },
        ],
      },
    ],
  },
  { title: 'Billing & Subscription', slug: 'billing', articles: [] },
  { title: 'Account & Security', slug: 'account-security', articles: [] },
];
