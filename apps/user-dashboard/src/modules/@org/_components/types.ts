import { ReactNode } from 'react';

export interface CardGroupProperties {
  children: ReactNode;
  className?: string;
  cols?: 2 | 3 | 4;
}

export type IconVariant = 'success' | 'primary' | 'warning' | 'purple-500';
export type TrendDirection = 'up' | 'down';
