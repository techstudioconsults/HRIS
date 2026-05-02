'use client';

import { Badge } from '@workspace/ui/components/badge';
import type { IColumnDefinition } from '@workspace/ui/lib/table';
import { cn } from '@workspace/ui/lib/utils';
import Image from 'next/image';
import { useMemo } from 'react';

// ── Response-shape type guards ────────────────────────────────────────────────
export function isEmployeeArray(value: unknown): value is Employee[] {
  return Array.isArray(value);
}
export function hasItems(value: unknown): value is { items: unknown[] } {
  return (
    typeof value === 'object' &&
    value !== null &&
    Array.isArray((value as { items?: unknown[] }).items)
  );
}
export function hasDataItems(
  value: unknown
): value is { data: { items: unknown[] } } {
  if (typeof value !== 'object' || value === null) return false;
  const data = (value as { data?: unknown }).data;
  if (typeof data !== 'object' || data === null) return false;
  return Array.isArray((data as { items?: unknown[] }).items);
}

// ── Hook: members column definitions ─────────────────────────────────────────
export function useMembersColumns(
  teamId: string,
  setActiveEmployee: (emp: Employee) => void
): IColumnDefinition<Employee>[] {
  return useMemo<IColumnDefinition<Employee>[]>(
    () => [
      {
        header: 'Team Members',
        accessorKey: 'firstName',
        render: (_, employee: Employee) => (
          <div
            className="flex w-fit items-center gap-2"
            onMouseEnter={() => setActiveEmployee(employee)}
            onFocus={() => setActiveEmployee(employee)}
            tabIndex={0}
          >
            <Image
              src={
                typeof employee.avatar === 'string' &&
                employee.avatar.length > 0
                  ? employee.avatar
                  : ``
              }
              alt={`${employee.firstName} ${employee.lastName}`}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">
              {`${employee.firstName} ${employee.lastName}`}
            </span>
          </div>
        ),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        render: (_, employee: Employee) => (
          <span className="text-sm">{employee?.email ?? 'N/A'}</span>
        ),
      },
      {
        header: 'Role',
        accessorKey: 'role',
        render: (_, employee: Employee) => (
          <span className="text-sm">
            {employee?.employmentDetails?.role?.name ?? 'N/A'}
          </span>
        ),
      },
      {
        header: 'Work Mode',
        accessorKey: 'workMode',
        render: (_, employee: Employee) => (
          <span className="text-sm capitalize">
            {employee?.employmentDetails?.workMode ?? 'N/A'}
          </span>
        ),
      },
      {
        header: 'Sub Team',
        accessorKey: 'subTeam',
        render: (_, employee: Employee) => {
          const isDirectMember =
            employee?.employmentDetails?.team?.id === teamId;
          const subTeamName = isDirectMember
            ? null
            : employee?.employmentDetails?.team?.name;
          return (
            <span className={cn('text-sm', !subTeamName && 'text-destructive')}>
              {subTeamName ?? 'Unassigned'}
            </span>
          );
        },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        render: (_, employee: Employee) => (
          <Badge
            className="min-w-fit"
            variant={employee.status === 'active' ? 'success' : 'warning'}
          >
            {employee.status === 'active' ? 'Active' : 'On Leave'}
          </Badge>
        ),
      },
    ],
    [setActiveEmployee, teamId]
  );
}
