import type { ButtonHTMLAttributes } from 'react';

export interface DashboardBannerProperties {
  img: string;
  title: string;
  desc: string;
}

export interface ActionBannerProperties {
  title: string;
  description: string;
  button: {
    label: string;
    onClick?: () => Promise<void> | void;
    className?: string;
  } & ButtonHTMLAttributes<HTMLButtonElement>;
  icon?: string;
  className?: string;
  isCompleted?: boolean;
}

export type RecentActivityType =
  | 'leave'
  | 'payroll'
  | 'report'
  | 'announcement'
  | 'attendance';

export interface Activity {
  id: string;
  action: string;
  timestamp: string;
  type: RecentActivityType;
}

export interface OnboardingProperties {
  steps: OnboardingStep[];
}

export interface OnboardingHeaderProperties {
  completedSteps: number;
  totalSteps: number;
}

export interface NewUserProperties {
  steps: OnboardingStep[];
  completedSteps: number;
}
