"use client";

import ExportAction from "@/components/shared/export-action";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { ComboBox } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { Add } from "iconsax-reactjs";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const DashboardHeader = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col items-center justify-between pb-6 lg:flex-row">
      <div className="min-h-[88px] py-3">
        {status === "loading" ? (
          <>
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-5 w-64" />
          </>
        ) : session ? (
          <>
            <h4 className="">Hi {`${session?.user.employee.fullName}`},</h4>
            <p className="">Manage your team with confidence today.</p>
          </>
        ) : null}
      </div>
      <div className="hidden flex-col items-center gap-4 lg:flex lg:flex-row">
        <ComboBox
          options={[]}
          value={undefined}
          onValueChange={() => {}}
          placeholder="Select overview period"
          className="border-border h-10 w-[20rem] border"
        />

        <ExportAction />
        <Link href="/admin/employees/add-employee">
          <MainButton variant="primary" isLeftIconVisible={true} icon={<Add />}>
            Add Employee
          </MainButton>
        </Link>
      </div>
    </div>
  );
};
