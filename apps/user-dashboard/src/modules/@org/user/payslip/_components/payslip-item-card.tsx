import { formatCurrency, formatDate } from '@/lib/formatters';
import { Badge } from '@workspace/ui/components/badge';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { Card } from '@workspace/ui/components/card';
import type { PayslipItemCardProps } from '../types';

export const PayslipItemCard = ({
  payslip,
  onViewPayslip,
}: PayslipItemCardProps) => {
  return (
    <Card className="space-y-4 rounded-xl  p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-13 w-13 items-center justify-center rounded-md bg-primary/10">
            <Icon name="FileText" size={20} className="text-primary" />
          </div>

          <div>
            <p className="text-sm font-medium ">{payslip.monthLabel}</p>
            <p className="text-lg font-semibold">
              {formatCurrency(payslip.amount)}
            </p>
            <p className="text-sm text-gray">
              Processed:{' '}
              {formatDate(payslip.processedAt, {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>

        <Badge
          className="min-w-fit capitalize"
          variant={payslip.status === 'paid' ? 'success' : 'warning'}
        >
          {payslip.status === 'paid' ? 'Paid' : payslip.status}
        </Badge>
      </div>

      <MainButton
        variant={`primary`}
        className="w-full"
        onClick={() => onViewPayslip(payslip)}
      >
        View Payslip
      </MainButton>
    </Card>
  );
};
