'use client';

import ExportAction from '@/components/shared/export-action';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { ComboBox } from '@workspace/ui/lib/select-dropdown/combo-box';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import { useSession } from '@/lib/session';
import Link from 'next/link';
import { routes } from '@/lib/routes/routes';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

export const DashboardHeader = () => {
  const { data: session, status } = useSession();

  return (
    <div
      className={cn(
        'flex lg:items-center flex-col lg:flex-row lg:justify-between xl:pb-6 '
      )}
    >
      <div className="min-h-22 py-3">
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
      <div className="flex justify-between items-center gap-4">
        <ComboBox
          options={[]}
          value={undefined}
          onValueChange={() => {}}
          placeholder="Select overview period"
          triggerClassName="lg:w-[20rem] w-full"
        />

        {/* Desktop CTAs — hidden on mobile */}
        <ExportAction className="hidden lg:flex" />
        <MainButton
          variant="primary"
          isLeftIconVisible={true}
          icon={<Icon variant="Bold" name="Add" />}
          href={routes.admin.employees.add()}
          className="hidden lg:flex w-full"
        >
          Add Employee
        </MainButton>

        {/* Mobile CTA dropdown — hidden on desktop */}
        <div className="flex lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={`icon`}
                className={`shadow rounded-md p-2.5`}
                variant="default"
              >
                <Icon
                  name="More"
                  size={20}
                  variant={`Outline`}
                  className={`text-primary rotate-90`}
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-background text-primary shadow-none flex flex-col gap-2 p-3 w-52"
            >
              {/*<DropdownMenuItem asChild>*/}
              {/*  <ExportAction className={`w-fit`}/>*/}
              {/*</DropdownMenuItem>*/}
              {/*<DropdownMenuSeparator />*/}
              <DropdownMenuItem asChild>
                <Link href="/admin/employees/add-employee">
                  <Icon
                    name={'Add'}
                    variant={`Bold`}
                    className={`text-primary`}
                  />
                  Add Employee
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
