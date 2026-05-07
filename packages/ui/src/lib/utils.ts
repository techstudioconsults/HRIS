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

export const calculateDaysBetween = (
  startDate: string,
  endDate: string
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffMs = end.getTime() - start.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

export function formatInitials(name: string, maxChars = 2): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  const first = parts[0].charAt(0).toUpperCase();
  const last = parts[parts.length - 1].charAt(0).toUpperCase();
  const initials = first + last;
  return initials.slice(0, maxChars);
}

export function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return true;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object')
    return Object.keys(value as Record<string, unknown>).length === 0;
  return false;
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function truncate(
  str: string,
  maxLength: number,
  suffix = '...'
): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + suffix;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function maskEmail(email: string): string {
  if (!email) return email;
  const atIndex = email.indexOf('@');
  if (atIndex <= 0) return email;
  const localPart = email.slice(0, atIndex);
  const domain = email.slice(atIndex);
  if (localPart.length <= 1) return email;
  return (
    localPart[0] +
    '*'.repeat(localPart.length - 2) +
    localPart[localPart.length - 1] +
    domain
  );
}

export function formatFileSize(bytes: number): string {
  if (bytes <= 0 || Number.isNaN(bytes)) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  );
  const value = bytes / Math.pow(k, i);
  return `${Math.round(value * 100) / 100} ${sizes[i]}`;
}

export function formatCompactNumber(number: number): string {
  if (Number.isNaN(number)) return '0';
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
}
