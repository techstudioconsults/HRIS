/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatCurrency } from "@/lib/formatters";

import { BonusDeduction, Payslip, PayslipBonus, PayslipDeduction } from "../../types";
import { BonusDeductionManager } from "../bonus-deduction-manager";
import { Card, CardContent } from "@workspace/ui/components/card";

const mapAdjustmentsToBonusDeduction = (
  adjustments: (PayslipBonus | PayslipDeduction)[] = [],
  kind: "bonus" | "deduction",
): BonusDeduction[] =>
  adjustments.map((adjustment) => ({
    id: adjustment.id,
    name: adjustment.name,
    valueType: adjustment.type,
    value: adjustment.amount,
    status: adjustment.status,
    type: kind,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

export const SalaryDetails = ({ payslip }: { payslip: Payslip | null }) => {
  const profileId = payslip
    ? (payslip as any)?.payProfileId || (payslip as any)?.payrollProfileId || undefined
    : undefined;

  const bonusItems = payslip ? mapAdjustmentsToBonusDeduction(payslip.bonuses, "bonus") : [];
  const deductionItems = payslip ? mapAdjustmentsToBonusDeduction(payslip.deductions, "deduction") : [];

  const isSalaryPaid = payslip?.status === `paid`;

  return (
    <section className="space-y-10">
      <section className="space-y-3">
        <h3 className="text-muted-foreground text-sm font-medium">Base Salary</h3>
        <div className="bg-muted text-foreground rounded-lg px-4 py-3 text-base font-semibold">
          {payslip ? formatCurrency(payslip.baseSalary) : "—"}
        </div>
      </section>

      {/* Bonuses Manager (employee-level) */}
      <section hidden={isSalaryPaid} className="space-y-4">
        <BonusDeductionManager type="bonus" profileId={profileId} initialItems={bonusItems} />
      </section>

      {/* Deductions Manager (employee-level) */}
      <section hidden={isSalaryPaid} className="space-y-4">
        <BonusDeductionManager type="deduction" profileId={profileId} initialItems={deductionItems} />
      </section>

      {/* Deductions Manager (employee-level) */}
      <section className="space-y-4">
        <Card className="bg-muted rounded-2xl shadow-none">
          <CardContent className="space-y-4">
            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground text-base font-medium">Total Bonuses</dt>
                <dd className="text-foreground text-base font-medium">{formatCurrency(payslip?.totalBonuses || 0)}</dd>
              </div>
            </dl>
            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted-foreground text-base font-medium">Total Deductions</dt>
                <dd className="text-foreground text-base font-medium">
                  {formatCurrency(payslip?.totalDeductions || 0)}
                </dd>
              </div>
            </dl>
            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-success text-base font-semibold">Net Salary</dt>
                <dd className="text-success text-base font-semibold">{formatCurrency(payslip?.netPay || 0)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </section>
    </section>
  );
};
