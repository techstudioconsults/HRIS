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
