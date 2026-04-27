'use client';

import { formatCurrency } from '@/lib/formatters';
import { usePayrollService } from '@/modules/@org/admin/payroll/services/use-service';
import type {
  Payslip,
  PayslipDetailsDialogProperties,
  PayslipLineItemsProperties,
} from '@/modules/@org/admin/payroll/types';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Logo } from '@workspace/ui/lib/logo';
import { ReusableDialog } from '@workspace/ui/lib/dialog';

import Loading from '../../../../../../note/loading';
import { useTheme } from 'next-themes';

const formatPayslipMonth = (value?: string | null) => {
  if (!value) return 'Payslip';

  return `${new Date(value).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  })} Payslip`;
};

const getToneClassName = (
  tone: PayslipLineItemsProperties['items'][number]['tone']
) => {
  if (tone === 'positive') return 'text-success';
  if (tone === 'negative') return 'text-destructive';

  return 'text-foreground';
};

const getCompanyName = (payslip: Payslip | null) => {
  const companyName = payslip?.companyName;

  return typeof companyName === 'string' && companyName.trim()
    ? companyName
    : 'TechstudioHR';
};

const PayslipLineItems = ({
  title,
  items,
  totalLabel,
  totalAmount,
}: PayslipLineItemsProperties) => {
  return (
    <section className="space-y-4">
      <h3 className="text-foreground text-lg font-medium">{title}</h3>

      <div className="overflow-hidden rounded-xl border">
        <div className="grid grid-cols-[minmax(0,1fr)_140px] border-b  px-6 py-4 text-sm font-medium text-foreground">
          <span>Description</span>
          <span className="text-right">Amount (₦)</span>
        </div>

        {items.length === 0 ? (
          <div className="px-6 py-5 text-sm text-muted-foreground">
            No {title.toLowerCase()} available.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[minmax(0,1fr)_140px] border-b  px-6 py-4 text-sm last:border-b-0"
            >
              <span className="text-foreground">{item.label}</span>
              <span
                className={`text-right font-medium ${getToneClassName(item.tone)}`}
              >
                {formatCurrency(item.amount)}
              </span>
            </div>
          ))
        )}

        <div className="grid grid-cols-[minmax(0,1fr)_140px] bg-primary/10 px-6 py-4 text-sm font-semibold text-foreground">
          <span>{totalLabel}</span>
          <span className="text-right">{formatCurrency(totalAmount)}</span>
        </div>
      </div>
    </section>
  );
};

export const PayslipDetailsDialog = ({
  payrollId,
  payslipId,
  open,
  onOpenChange,
}: PayslipDetailsDialogProperties) => {
  const { resolvedTheme } = useTheme();
  const logoPath =
    resolvedTheme === 'dark' ? '/images/logo-white.svg' : '/images/logo.svg';

  const { useGetPayslipById } = usePayrollService();

  const { data, isLoading } = useGetPayslipById(
    payrollId ?? '',
    payslipId ?? '',
    {
      enabled: open && !!payslipId,
    }
  );

  const payslip = data?.data ?? null;
  const salaryBreakdown = [
    {
      id: 'base-salary',
      label: 'Base Salary',
      amount: Number(payslip?.baseSalary ?? 0),
      tone: 'default' as const,
    },
    ...((payslip?.bonuses ?? []).map((bonus) => ({
      id: bonus.id,
      label: bonus.name,
      amount: Number(bonus.amount ?? 0),
      tone: 'positive' as const,
    })) ?? []),
  ];

  const deductions =
    payslip?.deductions?.map((deduction) => ({
      id: deduction.id,
      label: deduction.name,
      amount: Number(deduction.amount ?? 0),
      tone: 'negative' as const,
    })) ?? [];

  return (
    <ReusableDialog
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      hideClose={false}
      className="gap-0 md:min-w-140! overflow-hidden border-0 p-0"
      wrapperClassName="hidden"
    >
      <div className="flex max-h-screen flex-col">
        <header className="shrink-0 border-b border-border/60 px-6 py-6 text-center sm:px-7">
          {payslip ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <Logo className={`w-50`} logo={logoPath} />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                {formatPayslipMonth(payslip.paymentDate)}
              </h2>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <Logo className={`w-50`} logo={logoPath} />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                Payslip
              </h2>
            </div>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 sm:px-7">
          {isLoading ? (
            <div className="py-12">
              <Loading text="Loading payslip details..." />
            </div>
          ) : !payslip ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Unable to load payslip details.
            </div>
          ) : (
            <div className="space-y-8">
              <Card className="border-0 shadow-none">
                <CardContent className="space-y-4 px-5 py-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Company Name</span>
                    <span className="text-right font-semibold text-foreground">
                      {getCompanyName(payslip)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Employee Name</span>
                    <span className="text-right font-semibold text-foreground">
                      {payslip.employee?.name ?? '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted-foreground">Employee ID</span>
                    <span className="text-right font-semibold text-foreground">
                      {payslip.employee?.id ?? '—'}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <PayslipLineItems
                  title="Salary Breakdown"
                  items={salaryBreakdown}
                  totalLabel="Gross Pay"
                  totalAmount={Number(payslip.grossPay ?? 0)}
                />

                <PayslipLineItems
                  title="Deductions"
                  items={deductions}
                  totalLabel="Total Deductions"
                  totalAmount={Number(payslip.totalDeductions ?? 0)}
                />
              </div>
            </div>
          )}
        </div>

        <footer className="shrink-0 border-t border-border/60 px-6 py-5 sm:px-7">
          <section className="rounded-xl bg-primary px-6 py-5 text-center">
            <p className="text-sm font-medium text-white">Net Pay</p>
            <p className="mt-2 text-2xl text-white font-bold">
              {formatCurrency(Number(payslip?.netPay ?? 0))}
            </p>
          </section>
        </footer>
      </div>
    </ReusableDialog>
  );
};
