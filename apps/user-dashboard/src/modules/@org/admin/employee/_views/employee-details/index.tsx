"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { Card } from "@workspace/ui/components/card";
import { DropdownMenuItem } from "@workspace/ui/components/dropdown-menu";
import { BreadCrumb, DashboardHeader, ErrorEmptyState, GenericDropdown } from "@workspace/ui/lib";
import { MainButton } from "@workspace/ui/lib/button";
import { Call, More, Sms } from "iconsax-reactjs";
import { Edit } from "lucide-react";
import Image from "next/image";

import { useEmployeeService } from "../../services/use-service";
import { EmployeeDetailsSkeleton } from "./loader";
import { formatDate } from "@/lib/formatters";

// Employee Header Component
const EmployeeDetailsHeader = ({ employeeId }: { employeeId: string }) => {
  const { useGetEmployeeById } = useEmployeeService();
  const { data: employeeData } = useGetEmployeeById(employeeId);

  return (
    <DashboardHeader
      title="Employee Details"
      subtitle={
        <BreadCrumb
          items={[
            { label: "Employee", href: `/admin/employees` },
            { label: employeeData?.firstName || "", href: `/admin/employees/${employeeData?.id}` },
          ]}
          showHome={true}
        />
      }
      actionComponent={
        <div className="flex items-center gap-5">
          <MainButton
            isLeftIconVisible
            icon={<Edit />}
            href={`/admin/employees/edit-employee?employeeid=${employeeData?.id}`}
            variant="primary"
          >
            Edit Employee
          </MainButton>
          <GenericDropdown
            align={`end`}
            trigger={
              <div className={`bg-background border-border flex size-10 items-center justify-center rounded-md shadow`}>
                <More className="size-5" />
              </div>
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
};

// Employee Content Component
const EmployeeDetailsContent = ({ employeeId }: { employeeId: string }) => {
  const { useGetEmployeeById } = useEmployeeService();
  const {
    data: employeeData,
    isLoading: isLoadingEmployee,
    isError: isErrorEmployee,
    refetch,
  } = useGetEmployeeById(employeeId);

  if (isLoadingEmployee) {
    return <EmployeeDetailsSkeleton />;
  }

  if (isErrorEmployee) {
    return <ErrorEmptyState onRetry={refetch} />;
  }

  return (
    <section className="grid min-h-[70dvh] grid-cols-1 gap-5 py-5 lg:grid-cols-3">
      {/* Employee summary */}
      <Card className="bg-background p-6 shadow lg:p-8">
        <div className="flex flex-col items-center justify-between text-center">
          <Avatar className="border-primary bg-primary size-[8rem]">
            <AvatarImage src={employeeData?.avatar || ""} />
            <AvatarFallback className="rounded-lg bg-transparent text-2xl text-white">
              {`${employeeData?.firstName} ${employeeData?.lastName}`.slice(0, 2).toUpperCase() || "CN"}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-semibold">{employeeData?.firstName}</h2>
          <p className="text-muted-foreground">{employeeData?.employmentDetails?.role?.name}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            {employeeData?.status}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 gap-5 border-t border-b py-5">
            <div className="flex items-center gap-4">
              <span>
                <Call className="text-muted-foreground size-5" />
              </span>
              <p className="font-medium">{employeeData?.phoneNumber || ``}</p>
            </div>
            <div className="flex items-start gap-4">
              <span>
                <Sms className="text-muted-foreground mt-1 size-5" />
              </span>
              <p className="w-[85%] text-base font-medium break-words">{employeeData?.email}</p>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Department</p>
            <p className="font-medium">{employeeData?.employmentDetails?.team?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Team Manager</p>
            <p className="font-medium">{employeeData?.employmentDetails?.team?.name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Work Mode</p>
            <p className="font-medium">{employeeData?.employmentDetails?.workMode || `N/A`}</p>
          </div>
          <div className="w-full">
            <MainButton
              href={`/admin/employees/edit-employee?employeeid=${employeeData?.id}`}
              variant="primary"
              size="lg"
              className="w-full"
              isLeftIconVisible
              icon={<Edit />}
            >
              Edit Employee
            </MainButton>
          </div>
        </div>
      </Card>

      <section className="col-span-2 space-y-6">
        {/* Personal Information Section */}
        <Card className="bg-background min-h-[277px] p-8 shadow">
          <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Full Name</p>
              <p className="font-medium">{`${employeeData?.firstName} ${employeeData?.lastName}`}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p className="font-medium">{formatDate(employeeData?.dateOfBirth || "")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Gender</p>
              <p className="font-medium">{employeeData?.gender}</p>
            </div>
            <div className={`col-span-2 w-fit`}>
              <p className="text-muted-foreground">Work Email</p>
              <p className="font-medium">{employeeData?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone Number</p>
              <p className="font-medium">{employeeData?.phoneNumber}</p>
            </div>
          </div>
        </Card>

        {/* Employment Details Section */}
        <Card className="bg-background min-h-[277px p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Employment Details</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{formatDate(employeeData?.employmentDetails?.startDate || "")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Employment Type</p>
              <p className="font-medium">{employeeData?.employmentDetails?.employmentType || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Work Mode</p>
              <p className="font-medium">{employeeData?.employmentDetails?.workMode || "N/A"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-medium">{employeeData?.employmentDetails?.team?.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Role</p>
              <p className="font-medium">{employeeData?.employmentDetails?.role?.name}</p>
            </div>
          </div>
        </Card>

        {/* Salary & Payroll Details */}
        <Card className="bg-background min-h-[277px] p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Salary & Payroll Details</h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Monthly Gross Salary</p>
              <p className="font-medium">{employeeData?.payProfile?.grossSalary}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Bank Name</p>
              <p className="font-medium">{employeeData?.payProfile?.bankName || `N/A`}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Account Number</p>
              <p className="font-medium">{employeeData?.payProfile?.accountNumber || `N/A`}</p>
            </div>
            <div className="md:col-span-3">
              <p className="text-muted-foreground">Account Name</p>
              <p className="font-medium">{employeeData?.payProfile?.accountName || `N/A`}</p>
            </div>
          </div>
        </Card>

        {employeeData?.document && (
          <div className="bg-white p-6 dark:bg-black">
            <h2 className="mb-4 text-lg font-semibold">Employee Documents</h2>
            <div className="border-gray-75 flex w-1/2 items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Image src="/images/pdf-icon.svg" width="32" height="44" alt="PDF Icon" />
                <div>
                  <p className="font-medium">Employment Letter</p>
                  <p className="text-muted-foreground text-sm">Uploaded on Jan 12, 2024 - 245 KB</p>
                </div>
              </div>
              <More className="rotate-90" />
            </div>
          </div>
        )}
      </section>
    </section>
  );
};

export const EmployeeDetails = ({ params }: { params: { id: string } }) => {
  return (
    <section className="space-y-6">
      <EmployeeDetailsHeader employeeId={params.id} />
      <EmployeeDetailsContent employeeId={params.id} />
    </section>
  );
};
