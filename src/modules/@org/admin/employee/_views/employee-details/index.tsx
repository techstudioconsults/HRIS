// app/employees/[id]/page.tsx
import MainButton from "@/components/shared/button";
import { Button } from "@/components/ui/button";
import { Call, More, Sms } from "iconsax-reactjs";
import Image from "next/image";
import Link from "next/link";

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  phone: string;
  workMode: string;
  manager: string;
  dob: string;
  gender: string;
  workEmail: string;
  salary: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export const EmployeeDetails = ({ params }: { params: { id: string } }) => {
  // In a real app, you would fetch this data from your API
  const employee: Employee = {
    id: params.id,
    name: "Kayode James",
    email: "kayodeyu@techstudio.com",
    role: "Front-end Developer",
    department: "Engineering",
    status: "Active",
    phone: "09085673241",
    workMode: "Hybrid",
    manager: "Kekerekun Oyeola",
    dob: "09/07/2005",
    gender: "Male",
    workEmail: "kayodeyu@techstudio.com",
    salary: "₦450,000",
    bankName: "Fidelity Bank",
    accountNumber: "324589000321",
    accountName: "Kayode James",
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-2xl font-bold">Employee Details</h1>
          <div className="flex items-center gap-1 text-sm">
            <Link href="/admin/employees" className="text-primary">
              {" "}
              All Employee{" "}
            </Link>
            <p className="text-muted-foreground"> &gt; {employee.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MainButton variant="primary" size="lg">
            Edit Employee
          </MainButton>
          <MainButton
            variant="outline"
            size="default"
            isIconOnly={true}
            icon={<More className="text-black" />}
            className="border-gray-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 py-5 lg:grid-cols-[minmax(0,30%)_minmax(0,70%)]">
        {/* Employee summary */}
        <div className="bg-white p-6 lg:p-8 dark:bg-black">
          <div className="flex flex-col items-center justify-between text-center">
            <Image src="/images/Ellipse 2245.svg" width="100" height="100" alt="" />
            <h2 className="text-xl font-semibold">{employee.name}</h2>
            <p className="text-muted-foreground">{employee.role}</p>
            <span className="mt-2 inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
              {employee.status}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-8">
            <div className="grid grid-cols-1 gap-5 border-t border-b py-5">
              <div className="flex gap-4">
                <Call className="text-muted-foreground h-5 w-5" />
                <p className="font-medium">{employee.phone}</p>
              </div>
              <div className="flex gap-4">
                <Sms className="text-muted-foreground h-5 w-5" />
                <p className="font-medium">{employee.email}</p>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground">Department</p>
              <p className="font-medium">{employee.department} Department</p>
            </div>
            <div>
              <p className="text-muted-foreground">Team Manager</p>
              <p className="font-medium">{employee.manager}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Work Mode</p>
              <p className="font-medium">{employee.workMode}</p>
            </div>
            <div className="w-full">
              <MainButton variant="primary" size="lg" className="w-full">
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
                <p className="font-medium">{employee.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{employee.dob}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Gender</p>
                <p className="font-medium">{employee.gender}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Work Email</p>
                <p className="font-medium">{employee.workEmail}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone Number</p>
                <p className="font-medium">{employee.phone}</p>
              </div>
            </div>
          </div>

          {/* Employment Details Section */}
          <div className="bg-white p-6 dark:bg-black">
            <h2 className="mb-4 text-lg font-semibold">Employment Details</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Start Date</p>
                <p className="font-medium">{employee.dob}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Employment Type</p>
                <p className="font-medium">Full-time</p>
              </div>
              <div>
                <p className="text-muted-foreground">Work Mode</p>
                <p className="font-medium">{employee.workMode}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Department</p>
                <p className="font-medium">{employee.department}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Role</p>
                <p className="font-medium">{employee.role}</p>
              </div>
            </div>
          </div>

          {/* Salary & Payroll Details */}
          <div className="bg-white p-6 dark:bg-black">
            <h2 className="mb-4 text-lg font-semibold">Salary & Payroll Details</h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Monthly Gross Salary</p>
                <p className="font-medium">{employee.salary}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Bank Name</p>
                <p className="font-medium">{employee.bankName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Account Number</p>
                <p className="font-medium">{employee.accountNumber}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-muted-foreground">Account Name</p>
                <p className="font-medium">{employee.accountName}</p>
              </div>
            </div>
          </div>

          {/* Employee Documents Section */}
          <div className="bg-white p-6 dark:bg-black">
            <h2 className="mb-4 text-lg font-semibold">Employee Documents</h2>
            <div className="border-gray-75 flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">Employment Letter</p>
                <p className="text-muted-foreground">Uploaded on Jan 12, 2024 - 245 KB</p>
              </div>
              <Button variant="outline">View</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
