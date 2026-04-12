'use client';

import { formatCurrency } from '@/lib/formatters';
import EmployeeInformation from '@/modules/@org/admin/payroll/_components/tab-content/employee-information';
import { SalaryDetails } from '@/modules/@org/admin/payroll/_components/tab-content/salary-details';
import { usePayrollService } from '@/modules/@org/admin/payroll/services/use-service';
import { usePayrollStore } from '@/modules/@org/admin/payroll/stores/payroll-store';
import type {
  Payslip,
  PayslipStatus,
} from '@/modules/@org/admin/payroll/types';
import { Badge } from '@workspace/ui/components/badge';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@workspace/ui/components/tabs';
import {
  AdvancedDataTable,
  AlertModal,
  EmptyState,
  TableSkeleton,
  type IColumnDefinition,
  type IRowAction,
} from '@workspace/ui/lib';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { AxiosError } from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import Loading from '../../../../../../../note/loading';
import { PayslipDetailsDialog } from '../payslip-details-dialog';

interface EmployeeInformationDrawerProperties {
  payrollId?: string | null;
}

type PayslipRow = Payslip & {
  payrollId?: string;
};

const HISTORY_PAGE_SIZE = 10;

const statusVariantMap: Record<
  PayslipStatus,
  'success' | 'destructive' | 'secondary' | 'warning'
> = {
  paid: 'success',
  failed: 'destructive',
  cancelled: 'destructive',
  pending: 'warning',
  draft: 'secondary',
};

const formatHistoryMonth = (value: unknown) => {
  if (!value) return 'N/A';

  return new Date(String(value)).toLocaleDateString(undefined, {
    month: 'short',
    year: 'numeric',
  });
};

const formatHistoryDate = (value: unknown) => {
  if (!value) return 'N/A';

  return new Date(String(value)).toLocaleDateString('en-GB');
};

const formatStatusLabel = (status: PayslipStatus) => {
  if (status === 'paid') {
    return 'Confirmed';
  }

  return `${status.charAt(0).toUpperCase()}${status.slice(1)}`;
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(', ');
    }

    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return fallback;
};

export const EmployeeInformationDrawer = ({
  payrollId,
}: EmployeeInformationDrawerProperties) => {
  const {
    showEmployeeInformationDrawer,
    setShowEmployeeInformationDrawer,
    selectedPayslipId,
    setSelectedPayslipId,
    employeeInformationActiveTab,
    setEmployeeInformationActiveTab,
  } = usePayrollStore();
  const { useDeletePayslip, useGetPayslipById, useGetPayslips } =
    usePayrollService();

  const [historyPage, setHistoryPage] = useState(1);
  const [viewPayslipId, setViewPayslipId] = useState<string | null>(null);
  const [payslipToDelete, setPayslipToDelete] = useState<PayslipRow | null>(
    null
  );

  const { data: payslipResponse, isLoading } = useGetPayslipById(
    payrollId ?? '',
    selectedPayslipId || '',
    {
      enabled: !!payrollId && !!selectedPayslipId,
    }
  );

  const payslip = payslipResponse?.data ?? null;

  const { mutateAsync: deletePayslip, isPending: isDeletingPayslip } =
    useDeletePayslip();

  useEffect(() => {
    setHistoryPage(1);
  }, [payslip?.employee?.id]);

  const { data: historyResponse, isLoading: isHistoryLoading } = useGetPayslips(
    '',
    {
      employeeId: payslip?.employee?.id,
    },
    {
      enabled:
        employeeInformationActiveTab === 'payroll-history' &&
        !!payslip?.employee?.id,
    }
  );

  const historyPayload = historyResponse?.data as
    | {
        items?: PayslipRow[];
        meta?: { totalPages?: number };
        metadata?: { totalPages?: number };
      }
    | undefined;
  const historyMeta = historyPayload?.meta ?? historyPayload?.metadata;
  const historyItems: PayslipRow[] = historyPayload?.items ?? [];
  const totalHistoryPages = historyMeta?.totalPages ?? 1;

  const resolvePayrollId = (row?: PayslipRow | null) =>
    row?.payrollId ?? payrollId ?? null;

  const handleDeletePayslip = async () => {
    if (!payslipToDelete) {
      return;
    }

    const targetPayrollId = resolvePayrollId(payslipToDelete);

    if (!targetPayrollId) {
      toast.error('Unable to delete this payslip right now.');
      return;
    }

    await deletePayslip(
      {
        payrollId: targetPayrollId,
        payslipId: payslipToDelete.id,
      },
      {
        onSuccess: () => {
          const isActivePayslip = payslipToDelete.id === selectedPayslipId;

          toast.success('Payslip deleted successfully.');
          setPayslipToDelete(null);

          if (isActivePayslip) {
            setShowEmployeeInformationDrawer(false);
            setSelectedPayslipId(null);
          }
        },
        onError: (error) => {
          toast.error(
            getErrorMessage(
              error,
              'Failed to delete payslip. Please try again.'
            )
          );
        },
      }
    );
  };

  const historyColumns = useMemo<IColumnDefinition<PayslipRow>[]>(
    () => [
      {
        header: 'Month',
        accessorKey: 'paymentDate',
        render: (value) => (
          <span className={`text-sm`}>{formatHistoryMonth(value)}</span>
        ),
      },
      {
        header: 'Payment Date',
        accessorKey: 'paymentDate',
        render: (value) => (
          <span className={`text-sm`}>{formatHistoryDate(value)}</span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        render: (value) => {
          const status = (value as PayslipStatus) ?? 'pending';

          return (
            <Badge
              variant={statusVariantMap[status] ?? 'secondary'}
              className="rounded-full px-3 py-1 text-xs font-medium"
            >
              {formatStatusLabel(status)}
            </Badge>
          );
        },
      },
      {
        header: 'Net Paid',
        accessorKey: 'netPay',
        render: (value) => (
          <span className="text-success text-sm font-medium">
            {formatCurrency(Number(value ?? 0))}
          </span>
        ),
      },
    ],
    []
  );

  const historyRowActions = useMemo(
    () =>
      (row: PayslipRow): IRowAction<PayslipRow>[] => [
        {
          label: 'View Payslip',
          onClick: () => {
            setViewPayslipId(row.id);
          },
          icon: <Icon name="Eye" size={16} variant="Outline" />,
        },
        { type: 'separator' },
        {
          label:
            isDeletingPayslip && payslipToDelete?.id === row.id
              ? 'Deleting Payslip...'
              : 'Delete Payslip',
          variant: 'destructive',
          onClick: () => {
            setPayslipToDelete(row);
          },
          icon: (
            <Icon
              name="Trash"
              size={16}
              variant="Outline"
              className="text-destructive"
            />
          ),
        },
      ],
    [isDeletingPayslip, payslipToDelete?.id]
  );

  const titleText =
    payslip?.employee?.name && payslip?.paymentDate
      ? `Payroll Review (${new Date(payslip.paymentDate).toLocaleDateString(
          undefined,
          { month: 'long', year: 'numeric' }
        )}) - ${payslip.employee.name}`
      : 'Payroll Review';

  return (
    <>
      <Drawer
        open={showEmployeeInformationDrawer}
        onOpenChange={setShowEmployeeInformationDrawer}
        direction="right"
      >
        <DrawerContent className="h-full w-full! sm:max-w-xl! md:max-w-2xl!">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                  <Icon name="User" size={20} className="text-primary" />
                </div>
                <div>
                  <DrawerTitle className="text-lg font-semibold">
                    {titleText}
                  </DrawerTitle>
                </div>
              </div>
              <DrawerClose className={`text-primary`} asChild>
                <Icon name={`CloseCircle`} />
              </DrawerClose>
            </div>
          </DrawerHeader>

          <section className="flex-1 space-y-6 overflow-y-auto p-4 lg:p-10">
            <div className="space-y-6">
              <Tabs
                value={employeeInformationActiveTab}
                onValueChange={(value) =>
                  setEmployeeInformationActiveTab(
                    value as
                      | 'employee-information'
                      | 'salary-details'
                      | 'payroll-history'
                  )
                }
                className="w-full"
              >
                <TabsList className="w-full bg-transparent">
                  <TabsTrigger value="employee-information">
                    Employee Information
                  </TabsTrigger>
                  <TabsTrigger value="salary-details">
                    Salary Details
                  </TabsTrigger>
                  <TabsTrigger value="payroll-history">
                    Payroll History
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="employee-information"
                  className="mt-6 space-y-6"
                >
                  {isLoading || !payslip ? (
                    <div className="py-10">
                      <Loading text="Loading employee information..." />
                    </div>
                  ) : (
                    <EmployeeInformation payslip={payslip} />
                  )}
                </TabsContent>

                <TabsContent value="salary-details" className="mt-6 space-y-8">
                  <SalaryDetails payslip={payslip} />
                </TabsContent>

                <TabsContent value="payroll-history" className="mt-6 space-y-6">
                  {isHistoryLoading ? (
                    <TableSkeleton />
                  ) : historyItems.length === 0 ? (
                    <EmptyState
                      className="bg-background shadow"
                      images={[]}
                      title="No payroll history found."
                      description="This employee has no previous payslips on record."
                    />
                  ) : (
                    <AdvancedDataTable
                      data={historyItems}
                      columns={historyColumns}
                      rowActions={historyRowActions}
                      enableRowSelection={false}
                      enableColumnVisibility={false}
                      enableSorting={false}
                      enableFiltering={false}
                      enablePagination={false}
                      showColumnCustomization={false}
                      showPagination={true}
                      currentPage={historyPage}
                      totalPages={totalHistoryPages}
                      itemsPerPage={HISTORY_PAGE_SIZE}
                      hasNextPage={historyPage < totalHistoryPages}
                      hasPreviousPage={historyPage > 1}
                      onPageChange={(page) => setHistoryPage(page)}
                      mobileCardView={true}
                      desktopTableClassname="lg:block!"
                      mobileTableClassname="lg:hidden!"
                      className="min-h-0"
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </section>
          <div className="border-t p-6"></div>
        </DrawerContent>
      </Drawer>

      <AlertModal
        isOpen={!!payslipToDelete}
        onClose={() => {
          if (!isDeletingPayslip) {
            setPayslipToDelete(null);
          }
        }}
        onConfirm={() => {
          void handleDeletePayslip();
        }}
        loading={isDeletingPayslip}
        type="warning"
        title="Delete payslip"
        description={`Are you sure you want to delete the payslip for ${formatHistoryMonth(
          payslipToDelete?.paymentDate
        )}? This action cannot be undone.`}
        confirmText={isDeletingPayslip ? 'Deleting...' : 'Delete Payslip'}
        cancelText="Cancel"
      />

      <PayslipDetailsDialog
        payrollId={payrollId}
        payslipId={viewPayslipId}
        open={!!viewPayslipId}
        onOpenChange={(open) => {
          if (!open) {
            setViewPayslipId(null);
          }
        }}
      />
    </>
  );
};
