import type { ReactNode } from 'react';
import HomeImg2 from '~/images/home/home-img-2.svg';
import HomeImg3 from '~/images/home/home-img-3.svg';
import HomeImg4 from '~/images/home/home-img-4.svg';
import HomeImg5 from '~/images/home/home-img-5.svg';
import HomeImg6 from '~/images/home/home-img-6.svg';

export type ProductCardAnimationTarget =
  | 'employee-management'
  | 'payroll-automation'
  | 'attendance-tracking'
  | 'files-resources'
  | 'leave-management';

export interface ProductCardItem {
  title: string;
  description: string;
  imageSrc: string | ReactNode;
  imageAlt: string;
  animationTarget: ProductCardAnimationTarget;
}

export const productCardsTopRow: ProductCardItem[] = [
  {
    title: 'Employee Management',
    description: 'Centralize employee records, roles and departments in one secure system.',
    imageSrc: <HomeImg2 />,
    imageAlt: 'Employee profile and management interface',
    animationTarget: 'employee-management',
  },
  {
    title: 'Payroll Automation',
    description: 'Run accurate payroll in minutes with built-in deductions, bonuses, and payslip generation.',
    imageSrc: <HomeImg3 />,
    imageAlt: 'Payroll analytics and payout progress interface',
    animationTarget: 'payroll-automation',
  },
  {
    title: 'Attendance Tracking',
    description: 'Track clock-ins, lateness, and work hours with geo-based attendance.',
    imageSrc: <HomeImg4 />,
    imageAlt: 'Attendance timeline and employee punctuality panel',
    animationTarget: 'attendance-tracking',
  },
];

export const productCardsBottomRow: ProductCardItem[] = [
  {
    title: 'Files & Resources',
    description: "Upload and save your organization's resources, files and documents.",
    imageSrc: <HomeImg5 />,
    imageAlt: 'Company files and resources upload interface',
    animationTarget: 'files-resources',
  },
  {
    title: 'Leave Management',
    description: 'Automate leave requests, approvals, balances, and policies with zero spreadsheets.',
    imageSrc: <HomeImg6 />,
    imageAlt: 'Leave request and leave trend management interface',
    animationTarget: 'leave-management',
  },
];
