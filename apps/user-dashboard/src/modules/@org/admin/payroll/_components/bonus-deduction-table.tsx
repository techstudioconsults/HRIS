'use client';

import { formatCurrency } from '@/lib/formatters';
import {
  AdvancedDataTable,
  type IColumnDefinition,
  type IRowAction,
} from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { cn } from '@workspace/ui/lib/utils';

import { BonusDeduction, BonusDeductionTableProperties } from '../types';

type BonusDeductionRow = BonusDeduction & Record<string, unknown>;

const formatValue = (value: number, valueType: 'percentage' | 'fixed') => {
  if (valueType === 'percentage') {
    return `${value}%`;
  }
  return formatCurrency(value);
};

export function BonusDeductionTable({
  items,
  type,
  onAdd,
  onEdit,
  onDelete,
  onToggleStatus,
}: BonusDeductionTableProperties) {
  const tableItems = items as BonusDeductionRow[];

  const getStatusBadge = (status: 'active' | 'inactive') => (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        {
          'bg-green-100 text-green-800': status === 'active',
          'bg-red-100 text-red-800': status === 'inactive',
        }
      )}
    >
      {status === 'active' ? 'Active' : 'Inactive'}
    </span>
  );

  const columns: IColumnDefinition<BonusDeductionRow>[] = [
    {
      header: `${type} Name`,
      accessorKey: 'name',
      render: (value) => (
        <span className="font-medium">{String(value ?? 'N/A')}</span>
      ),
    },
    {
      header: 'Value Type',
      accessorKey: 'valueType',
      render: (value) => (
        <span className="capitalize">{String(value ?? 'fixed')}</span>
      ),
    },
    {
      header: 'Value',
      accessorKey: 'value',
      render: (_, row) => formatValue(row.value, row.valueType ?? 'fixed'),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      render: (value) =>
        getStatusBadge((value as 'active' | 'inactive') ?? 'inactive'),
    },
  ];

  const rowActions = (
    row: BonusDeductionRow
  ): IRowAction<BonusDeductionRow>[] => [
    {
      label: 'Edit',
      onClick: () =>
        onEdit(row.id, {
          name: row.name,
          valueType: row.valueType ?? 'fixed',
          value: row.value,
          status: row.status === 'active',
          type: row.type,
        }),
    },
    {
      label: row.status === 'active' ? 'Deactivate' : 'Activate',
      onClick: () => onToggleStatus(row.id),
    },
    {
      label: 'Delete',
      variant: 'destructive',
      onClick: () => onDelete(row.id),
    },
  ];

  return (
    <div className="space-y-4">
      {/*<h3 className="text-lg font-semibold capitalize">{type}</h3>*/}
      <AdvancedDataTable<BonusDeductionRow>
        data={tableItems}
        columns={columns}
        rowActions={rowActions}
        enableRowSelection={false}
        enableColumnVisibility={false}
        enableSorting={false}
        enableFiltering={false}
        enablePagination={false}
        showPagination={false}
        showColumnCustomization={false}
        showAddButton={false}
        mobileCardView={true}
        emptyState={
          <span className="text-muted-foreground">No {type}s added yet</span>
        }
        className="min-h-0"
      />
      <MainButton
        icon={<Icon name="Plus" size={16} />}
        isLeftIconVisible
        variant="link"
        size="sm"
        type="button"
        className="w-full justify-start sm:w-fit"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          onAdd();
        }}
      >
        Add {type}
      </MainButton>
    </div>
  );
}
