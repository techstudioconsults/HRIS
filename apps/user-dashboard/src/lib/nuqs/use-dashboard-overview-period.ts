'use client';

import { parseAsInteger, useQueryState } from 'nuqs';

export function useDashboardOverviewPeriod() {
  const currentYear = new Date().getFullYear();
  return useQueryState('year', parseAsInteger.withDefault(currentYear));
}
