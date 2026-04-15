import type { UserPayslip } from '../types';
import { PayslipItemCard } from './payslip-item-card';

interface PayslipGridProps {
  payslips: UserPayslip[];
  onViewPayslip: (payslip: UserPayslip) => void;
}

export const PayslipGrid = ({ payslips, onViewPayslip }: PayslipGridProps) => {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {payslips.map((payslip) => (
        <PayslipItemCard
          key={payslip.id}
          payslip={payslip}
          onViewPayslip={onViewPayslip}
        />
      ))}
    </section>
  );
};
