'use client';

import ExportAction from '@/components/shared/export-action';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { ComboBox } from '@workspace/ui/lib';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useSession } from 'next-auth/react';

export const DashboardHeader = () => {
  const { data: session, status } = useSession();

  return (
    <div className="flex flex-col xl:items-center justify-between xl:pb-6 xl:flex-row">
      <div className="min-h-[88px] py-3">
        {status === 'loading' ? (
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
      <div className="lg:items-center gap-4 flex flex-col lg:flex-row">
        <ComboBox
          options={[]}
          value={undefined}
          onValueChange={() => {}}
          placeholder="Select overview period"
          className="border-border h-10 w-[20rem] border hidden lg:flex"
        />
        <ExportAction className={`hidden lg:flex`} />
        <MainButton
          variant="primary"
          isLeftIconVisible={true}
          icon={<Icon name="Add" />}
          href="/admin/employees/add-employee"
          className={`w-full`}
        >
          Add Employee
        </MainButton>
      </div>
    </div>
  );
};
