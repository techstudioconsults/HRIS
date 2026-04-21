import type { PayslipStatus } from '@/modules/@org/admin/payroll/types';

export type { PayslipStatus };

export interface PayslipLineItem {
  id: string;
  label: string;
  amount: number;
}

export interface UserPayslip {
  id: string;
  monthLabel: string;
  amount: number;
  processedAt: string;
  status: PayslipStatus;
  grossPay: number;
  netPay: number;
  totalDeductions: number;
  earnings: PayslipLineItem[];
  deductions: PayslipLineItem[];
}

export interface PayslipSummaryCardProps {
  netPay: number;
}

export interface PayslipItemCardProps {
  payslip: UserPayslip;
  onViewPayslip: (payslip: UserPayslip) => void;
}

export interface PayslipGridProps {
  payslips: UserPayslip[];
  onViewPayslip: (payslip: UserPayslip) => void;
}

export interface PayslipDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payslip: UserPayslip | null;
  onDownload?: (payslip: UserPayslip) => void;
}

export interface PayslipBreakdownProps {
  title: string;
  items: PayslipLineItem[];
}

export interface SummaryCardProps {
  label: string;
  value: number;
  highlighted?: boolean;
}
