import { LeaveDistributionPieChart } from "./leave-piechart";
import { PayrollLineChart } from "./payrool-linechart";

export function LeaveAndPayroll() {
  return (
    <section className="grid grid-cols-1 gap-5 py-5 md:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
      <LeaveDistributionPieChart />
      <PayrollLineChart />
    </section>
  );
}
