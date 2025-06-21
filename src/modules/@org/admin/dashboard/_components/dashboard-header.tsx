import MainButton from "@/components/shared/button";
import { Add, Calendar, Export } from "iconsax-reactjs";
import Link from "next/link";

export const DashboardHeader = () => {
  return (
    <div className="flex flex-col items-center justify-between pb-6 lg:flex-row">
      <div className="py-3">
        <h4 className="">Hi Tosin,</h4>
        <p className="">Manage your team with confidence today.</p>
      </div>
      <div className="hidden flex-col items-center gap-4 lg:flex lg:flex-row">
        <MainButton
          className="border-gray-75 text-black dark:text-white"
          variant="outline"
          isLeftIconVisible={true}
          icon={<Calendar />}
        >
          May 17 2025
        </MainButton>
        <MainButton
          className="border-gray-75 text-black dark:text-white"
          variant="outline"
          isLeftIconVisible={true}
          icon={<Export />}
        >
          Export
        </MainButton>
        <Link href="/admin/employees/add-employee">
          <MainButton variant="primary" isLeftIconVisible={true} icon={<Add />}>
            Add Employee
          </MainButton>
        </Link>
      </div>
    </div>
  );
};
