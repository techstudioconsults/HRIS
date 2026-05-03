'use client';

import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { EmptyState } from '@workspace/ui/lib/empty-state';
import { AdvancedDataTable, TableSkeleton } from '@workspace/ui/lib/table';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { Button } from '@workspace/ui/components/button';

import empty1 from '~/images/empty-state.svg';

import type { IRowAction } from '@workspace/ui/lib/table';
import type { Payslip } from '../types';
import { getPayrollColumns } from './table-data';

export interface PayrollTableSectionProps {
  /** Whether payslips are currently loading */
  loading: boolean;
  /** Payslips data (items array + pagination) */
  payslipsData: { data?: { items?: Payslip[]; total?: number } } | undefined;
  /** Table columns definition */
  columns: ReturnType<typeof getPayrollColumns>;
  /** Row actions factory */
  rowActions: (payslip: Payslip) => IRowAction<Payslip>[];
  /** Number of selected rows for the bulk footer */
  selectedCount: number;
  /** Selection change callback */
  onSelectionChange: (selected: Payslip[]) => void;

  /** Whether there are failed payslips for retry */
  hasFailedPayslips: boolean;
  /** Whether retry is currently in progress */
  isRetrying: boolean;
  /** Retry all failed payslips handler */
  onRetryAllFailed: () => void;

  /** Whether Add Employee button should show */
  showAddEmployee: boolean;
  /** Add Employee click handler */
  onAddEmployee: () => void;

  /** Bulk export handler */
  onBulkExport: () => void;
  /** Bulk delete modal open handler */
  onOpenBulkDelete: () => void;
}

export const PayrollTableSection = ({
  loading,
  payslipsData,
  columns,
  rowActions,
  selectedCount,
  onSelectionChange,
  hasFailedPayslips,
  isRetrying,
  onRetryAllFailed,
  showAddEmployee,
  onAddEmployee,
  onBulkExport,
  onOpenBulkDelete,
}: PayrollTableSectionProps) => {
  const isEmpty =
    !payslipsData?.data?.items || payslipsData.data.items.length === 0;

  return (
    <section>
      <section className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold">Employee Payroll Summary</h1>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          {hasFailedPayslips && (
            <MainButton
              variant="primaryOutline"
              isLoading={isRetrying}
              onClick={onRetryAllFailed}
            >
              Retry All Failed Payslips
            </MainButton>
          )}
          {showAddEmployee && (
            <MainButton
              variant="primary"
              isLeftIconVisible
              onClick={onAddEmployee}
              icon={<Icon name="Add" variant="Bold" />}
            >
              Add Employee
            </MainButton>
          )}
        </div>

        {/* Mobile actions */}
        <div className="flex lg:hidden">
          <GenericDropdown
            align="end"
            trigger={
              <Button
                size="icon"
                className="shadow rounded-md p-2.5"
                variant="default"
              >
                <Icon
                  name="More"
                  size={20}
                  variant="Outline"
                  className="text-primary rotate-90"
                />
              </Button>
            }
          >
            {hasFailedPayslips && (
              <DropdownMenuItem onClick={onRetryAllFailed}>
                {isRetrying
                  ? 'Retrying Failed Payslips...'
                  : 'Retry All Failed Payslips'}
              </DropdownMenuItem>
            )}
            {showAddEmployee && (
              <DropdownMenuItem onClick={onAddEmployee}>
                <Icon name="Add" variant="Bold" />
                Add Employee
              </DropdownMenuItem>
            )}
          </GenericDropdown>
        </div>
      </section>

      {loading ? (
        <TableSkeleton />
      ) : isEmpty ? (
        <EmptyState
          className="bg-background shadow"
          images={[
            { src: empty1.src, alt: 'No payslips', width: 50, height: 50 },
          ]}
          title="No payslips generated yet."
          description="Select a payroll from the dropdown above and click 'Generate Payslip' to view employee payroll details."
        />
      ) : (
        <AdvancedDataTable
          data={payslipsData!.data!.items!}
          columns={columns}
          rowActions={rowActions}
          onPageChange={() => {}}
          showPagination={true}
          enableRowSelection={true}
          enableColumnVisibility={false}
          enableSorting={false}
          enableFiltering={false}
          mobileCardView={true}
          showColumnCustomization={false}
          desktopTableClassname="xl:block!"
          mobileTableClassname="xl:hidden!"
          onSelectionChange={onSelectionChange}
          customFooterRenderer={() =>
            selectedCount > 0 ? (
              <div className="flex flex-col gap-3 rounded-b-lg border-t bg-primary/5 px-4 py-3 sm:flex-row sm:items-center">
                <span className="text-sm font-medium text-primary">
                  {selectedCount} row{selectedCount > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2 sm:ml-auto">
                  <MainButton
                    variant="primaryOutline"
                    onClick={onBulkExport}
                    isLeftIconVisible
                    icon={<Icon name="DocumentDownload" variant="Outline" />}
                  >
                    Export CSV
                  </MainButton>
                  <MainButton
                    variant="destructive"
                    onClick={onOpenBulkDelete}
                    isLeftIconVisible
                    icon={<Icon name="Trash" variant="Outline" />}
                  >
                    Remove Selected
                  </MainButton>
                </div>
              </div>
            ) : null
          }
        />
      )}
    </section>
  );
};
