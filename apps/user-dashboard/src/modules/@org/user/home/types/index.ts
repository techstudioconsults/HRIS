import type { ButtonHTMLAttributes } from 'react';

// ── Activity ──────────────────────────────────────────────────────────────────

export type ActivityType = 'approved' | 'rejected' | 'available' | 'submitted';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  message: string;
  timestamp?: Date | string | null;
}

export interface QuickAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  href: string;
}

// ── Setup tasks ───────────────────────────────────────────────────────────────

export type SetupTaskStatus = 'pending' | 'completed' | 'locked';

export interface SetupTask {
  id: string;
  title: string;
  description: string;
  status: SetupTaskStatus;
  icon: React.ReactNode;
  decorativeIcon: React.ReactNode;
  buttonLabel: string;
  buttonAction: () => void | Promise<void>;
  order: number;
}

export interface SetupPageState {
  tasks: SetupTask[];
  completedCount: number;
  totalCount: number;
  isLoading: boolean;
  userSetupComplete: boolean;
}

export const SETUP_TASKS_TOTAL = 4;
export const SETUP_COMPLETION_THRESHOLD = 4;

export const SETUP_TASK_IDS = {
  RESET_PASSWORD: 'reset-password',
  REVIEW_PROFILE: 'review-profile',
  ACKNOWLEDGE_POLICY: 'acknowledge-policy',
  REVIEW_PAYROLL: 'review-payroll',
} as const;

// ── Component props ───────────────────────────────────────────────────────────

export interface QuickActionCardProps {
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

export interface ActivityItemProps {
  type: ActivityType;
  title: string;
  message: string;
  timestamp?: Date | string | null;
}

// ── View props ────────────────────────────────────────────────────────────────

export interface RecentActivitiesProps {
  activities: Activity[];
}

export interface OnboardingProperties {
  steps: OnboardingStep[];
}

export interface OnboardingHeaderProperties {
  completedSteps: number;
  totalSteps: number;
}
