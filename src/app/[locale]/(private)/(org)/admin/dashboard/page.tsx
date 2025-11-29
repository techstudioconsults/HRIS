import { SuspenseLoading } from "@/components/shared/loading";
import { DashboardHomePage } from "@/modules/@org/admin/dashboard";
import { Suspense } from "react";

const AdminDashboardPage = () => {
  return (
    <Suspense fallback={<SuspenseLoading />}>
      <DashboardHomePage />
    </Suspense>
  );
};

export default AdminDashboardPage;
