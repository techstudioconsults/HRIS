"use client";

// app/employees/[id]/page.tsx
import MainButton from "@/components/shared/button";
import { GenericDropdown } from "@/components/shared/drop-down";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/tools/format";
import { Call, More, Sms } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";

import { useEmployeeService } from "../../services/use-service";
import { EmployeeDetailsSkeleton } from "./skeleton";

export const EmployeeDetails = ({ params }: { params: { id: string } }) => {
  const { useGetEmployeeById } = useEmployeeService();
  // In a real app, you would fetch this data from your API
  const { data: employeeData, isLoading } = useGetEmployeeById(params.id);

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">Employee Details</h1>
          <div className="flex items-center gap-1 text-sm">
            <Link href="/admin/employees" className="text-primary">
              All Employee
            </Link>
            <p className="text-muted-foreground"> &gt; {employeeData?.firstName}</p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <MainButton href={`/admin/employees/add-employee?employeeid=${employeeData?.id}`} variant="primary" size="lg">
            Edit Employee
          </MainButton>
          <GenericDropdown
            align={`end`}
            trigger={
              <div className={`bg-background border-border flex size-10 items-center justify-center rounded-md border`}>
                <More className="size-5" />
              </div>
            }
          >
            <DropdownMenuItem disabled>Download Profile PDF</DropdownMenuItem>
            <DropdownMenuItem disabled>Reset Password</DropdownMenuItem>
            <DropdownMenuItem disabled>Suspend Employee</DropdownMenuItem>
            <DropdownMenuItem disabled>Terminate Employee</DropdownMenuItem>
          </GenericDropdown>
          {/* <MainButton
            variant="outline"
            size="default"
            isIconOnly={true}
            icon={<More className="text-black" />}
            className="border-gray-200"
          /> */}
        </div>
      </div>
      {isLoading ? (
        <EmployeeDetailsSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-5 py-5 lg:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
          {/* Employee summary */}
          <div className="bg-white p-6 lg:p-8 dark:bg-black">
            <div className="flex flex-col items-center justify-between text-center">
              <Avatar className="border-primary bg-gray size-[8rem]">
                <AvatarImage src={employeeData?.thumbnail || "https://github.com/shadcn.png"} />
              </Avatar>
              <h2 className="text-xl font-semibold">{employeeData?.firstName}</h2>
              <p className="text-muted-foreground">{employeeData?.role.name}</p>
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
                <p className="font-medium">{employeeData?.role.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Team Manager</p>
                <p className="font-medium">{employeeData?.team.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Work Mode</p>
                <p className="font-medium">{employeeData?.workMode || `N/A`}</p>
              </div>
              <div className="w-full">
                <MainButton
                  href={`/admin/employees/add-employee?employeeid=${employeeData?.id}`}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Edit Employee
                </MainButton>
              </div>
            </div>
          </div>

          <div>
            {/* Personal Information Section */}
            <div className="bg-white p-8 dark:bg-black">
              <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-medium">{employeeData?.firstName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{formatDate(employeeData?.dateOfBirth || "")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  <p className="font-medium">{employeeData?.lastName}</p>
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
            </div>

            {/* Employment Details Section */}
            <div className="bg-white p-6 dark:bg-black">
              <h2 className="mb-4 text-lg font-semibold">Employment Details</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{formatDate(employeeData?.createdAt || "")}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Employment Type</p>
                  <p className="font-medium">Full-time</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Work Mode</p>
                  <p className="font-medium">{employeeData?.workMode || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Department</p>
                  <p className="font-medium">{employeeData?.team.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Role</p>
                  <p className="font-medium">{employeeData?.role.name}</p>
                </div>
              </div>
            </div>

            {/* Salary & Payroll Details */}
            <div className="bg-white p-6 dark:bg-black">
              <h2 className="mb-4 text-lg font-semibold">Salary & Payroll Details</h2>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">Monthly Gross Salary</p>
                  <p className="font-medium">{employeeData?.monthlySalary}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Bank Name</p>
                  <p className="font-medium">{employeeData?.bankName || `N/A`}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Account Number</p>
                  <p className="font-medium">{employeeData?.accountNumber || `N/A`}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-muted-foreground">Account Name</p>
                  <p className="font-medium">{employeeData?.accountName || `N/A`}</p>
                </div>
              </div>
            </div>

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
          </div>
        </div>
      )}
    </div>
  );
};
