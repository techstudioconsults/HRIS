import dynamic from 'next/dynamic';
import type { ComponentType, SVGProps } from 'react';

// Dynamically loaded so each SVG's JS chunk is deferred out of the initial bundle.
const HomeImg2 = dynamic<SVGProps<SVGSVGElement>>(
  () => import('~/images/home/home-img-2.svg')
);
const HomeImg3 = dynamic<SVGProps<SVGSVGElement>>(
  () => import('~/images/home/home-img-3.svg')
);
const HomeImg4 = dynamic<SVGProps<SVGSVGElement>>(
  () => import('~/images/home/home-img-4.svg')
);
const HomeImg5 = dynamic<SVGProps<SVGSVGElement>>(
  () => import('~/images/home/home-img-5.svg')
);
const HomeImg6 = dynamic<SVGProps<SVGSVGElement>>(
  () => import('~/images/home/home-img-6.svg')
);

type SvgComponent = ComponentType<SVGProps<SVGSVGElement>>;

export type ProductCardAnimationTarget =
  | 'employee-management'
  | 'payroll-automation'
  | 'attendance-tracking'
  | 'files-resources'
  | 'leave-management';

export interface ProductCardItem {
  title: string;
  description: string;
  /** Render as <ImageSrc /> inside a <Suspense> boundary. */
  ImageSrc: SvgComponent;
  imageAlt: string;
  animationTarget: ProductCardAnimationTarget;
}

export const productCardsTopRow: ProductCardItem[] = [
  {
    title: 'Employee Management',
    description:
      'Centralize employee records, roles and departments in one secure system.',
    ImageSrc: HomeImg2,
    imageAlt: 'Employee profile and management interface',
    animationTarget: 'employee-management',
  },
  {
    title: 'Payroll Automation',
    description:
      'Run accurate payroll in minutes with built-in deductions, bonuses, and payslip generation.',
    ImageSrc: HomeImg3,
    imageAlt: 'Payroll analytics and payout progress interface',
    animationTarget: 'payroll-automation',
  },
  {
    title: 'Attendance Tracking',
    description:
      'Track clock-ins, lateness, and work hours with geo-based attendance.',
    ImageSrc: HomeImg4,
    imageAlt: 'Attendance timeline and employee punctuality panel',
    animationTarget: 'attendance-tracking',
  },
];

export const productCardsBottomRow: ProductCardItem[] = [
  {
    title: 'Files & Resources',
    description:
      "Upload and save your organization's resources, files and documents.",
    ImageSrc: HomeImg5,
    imageAlt: 'Company files and resources upload interface',
    animationTarget: 'files-resources',
  },
  {
    title: 'Leave Management',
    description:
      'Automate leave requests, approvals, balances, and policies with zero spreadsheets.',
    ImageSrc: HomeImg6,
    imageAlt: 'Leave request and leave trend management interface',
    animationTarget: 'leave-management',
  },
];
