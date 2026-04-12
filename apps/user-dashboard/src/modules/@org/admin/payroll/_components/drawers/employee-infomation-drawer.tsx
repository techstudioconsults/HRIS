'use client';

import { formatCurrency } from '@/lib/formatters';
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
  EmptyState,
  TableSkeleton,
  type IColumnDefinition,
} from '@workspace/ui/lib';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useState } from 'react';

import Loading from '../../../../../../../note/loading';
import { usePayrollService } from '../../services/use-service';
import { usePayrollStore } from '../../stores/payroll-store';
import type { Payslip, PayslipStatus } from '../../types';
import EmployeeInformation from '../tab-content/employee-information';
import { SalaryDetails } from '../tab-content/salary-details';

interface EmployeeInformationDrawerProperties {
  payrollId?: string | null;
}

type PayslipRow = Payslip;

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

const historyColumns: IColumnDefinition<PayslipRow>[] = [
  {
    header: 'Period',
    accessorKey: 'paymentDate',
    render: (value) => {
      if (!value) return 'N/A';
      return new Date(String(value)).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      });
    },
  },
  {
    header: 'Payment Date',
    accessorKey: 'id',
    render: (_, row) => {
      if (!row.paymentDate) return 'N/A';
      return new Date(String(row.paymentDate)).toLocaleDateString();
    },
  },
  {
    header: 'Status',
    accessorKey: 'status',
    render: (value) => {
      const s = (value as PayslipStatus) ?? 'pending';
      return (
        <Badge
          variant={statusVariantMap[s] ?? 'secondary'}
          className="capitalize"
        >
          {s}
        </Badge>
      );
    },
  },
  {
    header: 'Gross Pay',
    accessorKey: 'grossPay',
    render: (value) => (
      <span className="font-medium">{formatCurrency(Number(value ?? 0))}</span>
    ),
  },
  {
    header: 'Net Pay',
    accessorKey: 'netPay',
    render: (value) => (
      <span className="text-success font-medium">
        {formatCurrency(Number(value ?? 0))}
      </span>
    ),
  },
];

export const EmployeeInformationDrawer = ({
  payrollId,
}: EmployeeInformationDrawerProperties) => {
  const {
    showEmployeeInformationDrawer,
    setShowEmployeeInformationDrawer,
    selectedPayslipId,
    employeeInformationActiveTab,
    setEmployeeInformationActiveTab,
  } = usePayrollStore();
  const { useGetPayslipById, useGetPayslips } = usePayrollService();

  const [historyPage, setHistoryPage] = useState(1);

  const { data: payslipResponse, isLoading } = useGetPayslipById(
    payrollId ?? '',
    selectedPayslipId || '',
    {
      enabled: !!payrollId && !!selectedPayslipId,
    }
  );

  const payslip = payslipResponse?.data ?? null;

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const historyMeta = (historyResponse?.data as any)?.meta;
  const historyItems: PayslipRow[] =
    (historyResponse?.data as { items?: PayslipRow[] })?.items ?? [];
  const totalHistoryPages: number = historyMeta?.totalPages ?? 1;

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
        <DrawerContent className="h-full w-full! sm:max-w-xl! md:max-w-3xl!">
          <DrawerHeader className="border-b pb-4">
            <div className="flex items-center justify-between gap-10">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                  <Icon name="User" size={20} className="text-blue-600" />
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
    </>
  );
};
