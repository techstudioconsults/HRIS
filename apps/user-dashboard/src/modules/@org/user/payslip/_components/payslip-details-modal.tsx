'use client';

import { formatCurrency, formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { MainButton } from '@workspace/ui/lib/button';
import { ReusableDialog } from '@workspace/ui/lib/dialog';
import type {
  PayslipBreakdownProps,
  PayslipDetailsModalProps,
  SummaryCardProps,
} from '../types';

const PayslipBreakdown = ({ title, items }: PayslipBreakdownProps) => {
  return (
    <section className="space-y-3">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded border px-4 py-5"
          >
            <p className="text-sm text-foreground">{item.label}</p>
            <p className="text-sm font-semibold text-foreground">
              {formatCurrency(item.amount)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const SummaryCard = ({ label, value, highlighted }: SummaryCardProps) => {
  return (
    <div
      className={
        highlighted
          ? 'space-y-1 rounded border border-primary  px-3 py-2'
          : 'space-y-1 rounded border px-3 py-2'
      }
    >
      <p
        className={
          highlighted ? 'text-sm text-primary' : 'text-sm text-muted-foreground'
        }
      >
        {label}
      </p>
      <p
        className={
          highlighted
            ? 'text-xl font-semibold text-primary'
            : 'text-xl font-semibold '
        }
      >
        {formatCurrency(value)}
      </p>
    </div>
  );
};

export const PayslipDetailsModal = ({
  open,
  onOpenChange,
  payslip,
  onDownload,
}: PayslipDetailsModalProps) => {
  return (
    <ReusableDialog
      trigger={null}
      open={open}
      onOpenChange={onOpenChange}
      title=""
      description=""
      className="gap-0 overflow-hidden p-0"
      wrapperClassName="hidden"
    >
      {!payslip ? (
        <section className="px-4 py-6 text-center text-sm text-muted-foreground sm:px-6">
          No payslip data available.
        </section>
      ) : (
        <section className="flex max-h-[90vh] min-h-0 flex-col">
          <header className="shrink-0 border-b border-border/60 px-4 py-4 sm:px-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl lg:text-2xl font-semibold text-foreground">
                    {payslip.monthLabel} Payslip
                  </h2>
                  <Badge className="bg-success/10 text-success rounded-full px-4 py-1 text-xs font-medium">
                    Paid
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Date Processed:{' '}
                {formatDate(payslip.processedAt, {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </header>

          <section className="min-h-0 flex-1 space-y-6 overflow-y-auto px-4 py-5 sm:px-6">
            <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <SummaryCard label="Net Pay" value={payslip.netPay} highlighted />
              <SummaryCard label="Gross Pay" value={payslip.grossPay} />
              <SummaryCard
                label="Total Deductions"
                value={payslip.totalDeductions}
              />
            </section>

            <section className="space-y-8">
              <PayslipBreakdown title="Earnings" items={payslip.earnings} />
              <PayslipBreakdown title="Deductions" items={payslip.deductions} />
            </section>
          </section>

          <footer className="shrink-0 border-t border-border/60 px-4 py-4 sm:px-6">
            <MainButton
              className="w-full"
              onClick={() => {
                onDownload?.(payslip);
              }}
            >
              Download Payslip
            </MainButton>
          </footer>
        </section>
      )}
    </ReusableDialog>
  );
};
