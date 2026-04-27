import { type ReactNode } from 'react';
import { type ACCESS_LEVELS } from '../auth-types';

export interface ComponentGuardProperties {
  children: ReactNode;
  accessLevel: (typeof ACCESS_LEVELS)[keyof typeof ACCESS_LEVELS];
  requiredPermissions?: string[];
  fallback?: ReactNode;
  redirectTo?: string;
}
