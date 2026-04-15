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
  status: 'paid';
  grossPay: number;
  netPay: number;
  totalDeductions: number;
  earnings: PayslipLineItem[];
  deductions: PayslipLineItem[];
}
