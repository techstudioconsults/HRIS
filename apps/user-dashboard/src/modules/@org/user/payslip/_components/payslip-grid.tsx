import { PayslipItemCard } from './payslip-item-card';
import type { PayslipGridProps } from '../types';
import { Wrapper } from '@workspace/ui/components/core/layout/wrapper';

export const PayslipGrid = ({ payslips, onViewPayslip }: PayslipGridProps) => {
  return (
    <Wrapper className={`max-w-300 my-0! p-0`}>
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {payslips.map((payslip) => (
          <PayslipItemCard
            key={payslip.id}
            payslip={payslip}
            onViewPayslip={onViewPayslip}
          />
        ))}
      </section>
    </Wrapper>
  );
};
