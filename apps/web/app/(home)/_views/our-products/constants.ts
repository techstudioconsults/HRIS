export interface ProductCardItem {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export const productCardsTopRow: ProductCardItem[] = [
  {
    title: 'Employee Management',
    description: 'Centralize employee records, roles and departments in one secure system.',
    imageSrc: '/images/home/home-img-2.svg',
    imageAlt: 'Employee profile and management interface',
  },
  {
    title: 'Payroll Automation',
    description: 'Run accurate payroll in minutes with built-in deductions, bonuses, and payslip generation.',
    imageSrc: '/images/home/home-img-3.svg',
    imageAlt: 'Payroll analytics and payout progress interface',
  },
  {
    title: 'Attendance Tracking',
    description: 'Track clock-ins, lateness, and work hours with geo-based attendance.',
    imageSrc: '/images/home/home-img-4.svg',
    imageAlt: 'Attendance timeline and employee punctuality panel',
  },
];

export const productCardsBottomRow: ProductCardItem[] = [
  {
    title: 'Files & Resources',
    description: "Upload and save your organization's resources, files and documents.",
    imageSrc: '/images/home/home-img-5.svg',
    imageAlt: 'Company files and resources upload interface',
  },
  {
    title: 'Leave Management',
    description: 'Automate leave requests, approvals, balances, and policies with zero spreadsheets.',
    imageSrc: '/images/home/home-img-6.svg',
    imageAlt: 'Leave request and leave trend management interface',
  },
];
