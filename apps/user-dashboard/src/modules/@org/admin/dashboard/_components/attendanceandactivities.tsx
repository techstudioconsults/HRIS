import { AttendanceBarChart } from '../../../_components/attendance-barchart';
import { RecentActivities } from './recent-activities';

export function AttendanceAndRecentActivities() {
  return (
    <section className="grid grid-cols-1 gap-5 pb-5 lg:grid-cols-[minmax(0,60%)_minmax(0,40%)]">
      <AttendanceBarChart />
      <RecentActivities />
    </section>
  );
}
