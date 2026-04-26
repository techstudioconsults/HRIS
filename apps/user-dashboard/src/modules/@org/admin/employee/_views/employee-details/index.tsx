'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar';
import { Card } from '@workspace/ui/components/card';
import { DropdownMenuItem } from '@workspace/ui/components/dropdown-menu';
import { BreadCrumb } from '@workspace/ui/lib/breadcrumb';
import { DashboardHeader } from '@workspace/ui/lib/dashboard';
import { ErrorEmptyState } from '@workspace/ui/lib/empty-state';
import { GenericDropdown } from '@workspace/ui/lib/drop-down';
import { MainButton } from '@workspace/ui/lib/button';
import { Icon } from '@workspace/ui/lib/icons/icon';
import Image from 'next/image';

import { useEmployeeService } from '../../services/use-service';
import { EmployeeDetailsSkeleton } from './loader';
import { formatDate } from '@/lib/formatters';
import { GradientMask } from '@workspace/ui/lib/gradient-mask';
import { AnyIconName } from '@workspace/ui/lib/icons/types';
import { Button } from '@workspace/ui/components/button';

const getInitials = (firstName?: string, lastName?: string) => {
  const fullName = `${firstName ?? ''} ${lastName ?? ''}`.trim();
  if (!fullName) return 'NA';
  return fullName
    .split(' ')
    .slice(0, 2)
    .map((name) => name.charAt(0))
    .join('')
    .toUpperCase();
};

const getStatusClassName = (status?: string) => {
  switch ((status ?? '').toLowerCase()) {
    case 'active':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
    case 'inactive':
      return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    case 'suspended':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const DetailsItem = ({
  label,
  value,
  icon,
}: {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    {icon && <span className="text-muted-foreground shrink-0">{icon}</span>}
    <div className="min-w-0 flex-1">
      <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className="text-foreground capitalize truncate text-sm font-medium">
        {value || 'N/A'}
      </p>
    </div>
  </div>
);

const DetailsFieldset = ({
  legend,
  children,
  className = '',
  icon,
}: {
  legend: string;
  children: React.ReactNode;
  className?: string;
  icon?: AnyIconName;
}) => (
  <fieldset className={`space-y-4 ${className}`}>
    <legend className="text-base mb-10 flex text-muted-foreground items-center gap-2 font-semibold">
      {icon ? (
        <span
          className={`size-8 flex items-center justify-center bg-primary-50 rounded-md`}
        >
          <Icon name={icon} className="text-primary" />
        </span>
      ) : null}
      {legend}
    </legend>
    <div className="space-y-3">{children}</div>
  </fieldset>
);

const EmployeeDetailsHeader = ({
  employeeId,
  employeeName,
}: {
  employeeId?: string;
  employeeName?: string;
}) => (
  <DashboardHeader
    title="Employee Details"
    subtitle={
      <BreadCrumb
        items={[
          { label: 'Employees', href: '/admin/employees' },
          {
            label: employeeName || 'Employee Profile',
            href: employeeId
              ? `/admin/employees/${employeeId}`
              : '/admin/employees',
          },
        ]}
        showHome={true}
      />
    }
    actionComponent={
      <div className="flex gap-2 justify-between items-center sm:gap-3">
        <div className={`w-full`}>
          <MainButton
            isLeftIconVisible
            icon={<Icon name="Edit" variant={`Bold`} />}
            href={
              employeeId
                ? `/admin/employees/edit-employee?employeeid=${employeeId}`
                : '/admin/employees/edit-employee'
            }
            variant="primary"
            className="w-full sm:w-auto"
          >
            Edit Employee
          </MainButton>
        </div>
        <GenericDropdown
          align="end"
          trigger={
            <Button
              size={`icon`}
              className={`bg-primary/10 rounded-md size-10.5`}
            >
              <Icon
                name="More"
                size={20}
                variant={`Outline`}
                className={`text-primary rotate-90`}
              />
            </Button>
          }
        >
          <DropdownMenuItem disabled>Download Profile PDF</DropdownMenuItem>
          <DropdownMenuItem disabled>Reset Password</DropdownMenuItem>
          <DropdownMenuItem disabled>Suspend Employee</DropdownMenuItem>
          <DropdownMenuItem disabled>Terminate Employee</DropdownMenuItem>
        </GenericDropdown>
      </div>
    }
  />
);

const EmployeeDetailsContent = ({ employeeData }: { employeeData: any }) => {
  const fullName =
    `${employeeData?.firstName ?? ''} ${employeeData?.lastName ?? ''}`.trim();
  const employeeStatus = employeeData?.status || 'Unknown';

  return (
    <section className="space-y-6 py-5">
      {/* Sticky Sidebar + Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Employee Profile Card - Sticky on Desktop */}
        <Card
          className="border-border space-y-6 bg-linear-to-b from-background to-muted/20 p-6
        shadow-sm lg:col-span-4 lg:sticky lg:top-20 lg:h-fit md:p-8"
        >
          <div className="flex flex-col items-center text-center">
            <Avatar className="border-primary/20 bg-muted size-32 border shadow-lg">
              <AvatarImage src={employeeData?.avatar || ''} />
              <AvatarFallback className=" bg-primary-50 text-2xl font-bold text-primary-75">
                {getInitials(employeeData?.firstName, employeeData?.lastName)}
              </AvatarFallback>
            </Avatar>

            <h2 className="mt-6 text-2xl font-bold">{fullName || 'N/A'}</h2>
            <p className="text-muted-foreground mt-2 text-base">
              {employeeData?.employmentDetails?.role?.name ||
                'No role assigned'}
            </p>
            <span
              className={`mt-4 inline-flex items-center rounded-full px-4 py-1 text-xs font-bold ${getStatusClassName(employeeStatus)}`}
            >
              {employeeStatus.toUpperCase()}
            </span>
          </div>

          <div className={`relative`}>
            <hr className=" bg-primary/50" />
            <GradientMask className={`absolute`} direction={`left`} />
            <GradientMask className={`absolute`} direction={`right`} />
          </div>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">
              Quick Contact
            </legend>
            <DetailsItem
              icon={<Icon className={`text-primary`} name="Sms" />}
              label="Email"
              value={employeeData?.email}
            />
            <DetailsItem
              icon={<Icon className={`text-primary`} name="Call" />}
              label="Phone"
              value={employeeData?.phoneNumber}
            />
          </fieldset>

          <div className={`relative`}>
            <hr className=" bg-primary/50" />
            <GradientMask className={`absolute`} direction={`left`} />
            <GradientMask className={`absolute`} direction={`right`} />
          </div>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground">
              Employment Summary
            </legend>
            <DetailsItem
              label="Department"
              value={employeeData?.employmentDetails?.team?.name}
            />
            <DetailsItem
              label="Work Mode"
              value={employeeData?.employmentDetails?.workMode}
            />
            <DetailsItem
              label="Employment Type"
              value={employeeData?.employmentDetails?.employmentType}
            />
          </fieldset>
        </Card>

        {/* Main Content - Scrollable */}
        <div className="space-y-6 lg:col-span-8">
          {/* Personal Information */}
          <Card className="border-border p-6 shadow-sm md:p-8">
            <DetailsFieldset icon={`Profile`} legend="Personal Information">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <DetailsItem label="Full Name" value={fullName} />
                <DetailsItem
                  label="Date of Birth"
                  value={
                    employeeData?.dateOfBirth
                      ? formatDate(employeeData.dateOfBirth)
                      : 'N/A'
                  }
                />
                <DetailsItem label="Gender" value={employeeData?.gender} />
                <DetailsItem label="Work Email" value={employeeData?.email} />
                <DetailsItem
                  label="Phone Number"
                  value={employeeData?.phoneNumber}
                />
              </div>
            </DetailsFieldset>
          </Card>

          {/* Employment Details */}
          <Card className="border-border p-6 shadow-sm md:p-8">
            <DetailsFieldset icon={`Buildings`} legend="Employment Details">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <DetailsItem
                  label="Start Date"
                  value={
                    employeeData?.startDate
                      ? formatDate(employeeData.startDate)
                      : 'N/A'
                  }
                />
                <DetailsItem
                  label="Employment Type"
                  value={employeeData?.employmentType}
                />
                <DetailsItem label="Work Mode" value={employeeData?.workMode} />
                <DetailsItem
                  label="Department"
                  value={employeeData?.team?.name}
                />
                <DetailsItem label="Role" value={employeeData?.role?.name} />
              </div>
            </DetailsFieldset>
          </Card>

          {/* Salary and Payroll */}
          <Card className="border-border p-6 shadow-sm md:p-8">
            <DetailsFieldset
              icon={`WalletMoney`}
              legend="Salary and Payroll Details"
            >
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                <DetailsItem
                  label="Monthly Salary"
                  value={employeeData?.monthlySalary?.toString()}
                />
                <DetailsItem label="Bank Name" value={employeeData?.bankName} />
                <DetailsItem
                  label="Account Number"
                  value={employeeData?.accountNumber?.toString()}
                />
                <DetailsItem
                  label="Account Name"
                  value={employeeData?.accountName}
                />
              </div>
            </DetailsFieldset>
          </Card>

          {/* Employee Documents */}
          {employeeData?.document && (
            <Card className="border-border bg-background p-6 shadow-sm md:p-8">
              <fieldset className="space-y-4">
                <legend className="text-base font-semibold text-foreground">
                  Employee Documents
                </legend>
                <div className="border-border flex w-full flex-col gap-4 rounded-lg border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/images/pdf-icon.svg"
                      width={32}
                      height={44}
                      alt="PDF Icon"
                    />
                    <div>
                      <p className="text-sm font-semibold">Employment Letter</p>
                      <p className="text-muted-foreground text-xs">
                        Uploaded on Jan 12, 2024 - 245 KB
                      </p>
                    </div>
                  </div>
                  <Icon name="More" className="rotate-90" />
                </div>
              </fieldset>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
};

export const EmployeeDetails = ({ params }: { params: { id: string } }) => {
  const { useGetEmployeeById } = useEmployeeService();
  const {
    data: employeeData,
    isLoading: isLoadingEmployee,
    isError: isErrorEmployee,
    refetch,
  } = useGetEmployeeById(params.id);

  if (isLoadingEmployee) {
    return <EmployeeDetailsSkeleton />;
  }

  if (isErrorEmployee) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  const employeeName =
    `${employeeData?.firstName ?? ''} ${employeeData?.lastName ?? ''}`.trim();

  return (
    <section className="space-y-6">
      <EmployeeDetailsHeader
        employeeId={employeeData?.id}
        employeeName={employeeName}
      />
      <EmployeeDetailsContent employeeData={employeeData} />
    </section>
  );
};
