/**
 * Types for User Home/Dashboard Page
 */

export type ActivityType = 'approved' | 'rejected' | 'available' | 'submitted';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  message: string;
  timestamp: Date | string;
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
