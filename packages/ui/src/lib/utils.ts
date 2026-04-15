import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTimestamp = (
  date?: Date | string | null,
  fallback = '-'
): string => {
  if (!date) return fallback;

  const timestampDate = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(timestampDate.getTime())) return fallback;

  // Check if it's a specific date (not recent)
  const now = new Date();
  const diffMs = now.getTime() - timestampDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 7) {
    return timestampDate
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '-');
  }

  return formatDistanceToNow(timestampDate, { addSuffix: true });
};
