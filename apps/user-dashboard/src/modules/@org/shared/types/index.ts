import type { ReactNode } from 'react';

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
