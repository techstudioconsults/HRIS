import type { ReactNode } from 'react';
import type { IconVariant, TrendDirection } from '../../_components/types';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category?: string;
  icon?: ReactNode;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface SearchInputProperties {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number;
  className?: string;
  isDisabled?: boolean;
}

export interface GlobalSearchInputProperties {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  isLoading?: boolean;
  disabled?: boolean;
  recentSearches?: string[];
  onClearRecent?: () => void;
  emptyMessage?: string;
  delay?: number;
}

// ============================================================================
// @org SHARED COMPONENT PROP TYPES
// ============================================================================

export interface DashboardCardProperties {
  title: string;
  value: string | number | ReactNode;
  percentage?: string;
  icon?: ReactNode;
  iconVariant?: IconVariant;
  className?: string;
  actionText?: string;
  actionHref?: string;
  showTrendIcon?: boolean;
  trend?: TrendDirection;
  onAction?: () => void;
  titleColor?: string;
  valueColor?: string;
  percentageColor?: string;
  actionTextColor?: string;
}

export interface ProgressBarProperties {
  current: number;
  total: number;
}

export interface SSEProgressWidgetProperties {
  channel: string;
  title?: string;
}
