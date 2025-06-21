"use client";

import { FormField } from "@/components/shared/FormFields";
// import { Button } from "@/components/ui/button";
import {
  departmentOptions,
  employmentTypeOptions,
  genderOptions,
  roleOptions,
  workModeOptions,
} from "@/lib/tools/constants";
import { employeeSchema } from "@/schemas"; // You'll need to create this schema
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "sonner";

export const EmployeeForm = () => {
  const router = useRouter();
  const methods = useForm({
    resolver: zodResolver(employeeSchema), // Make sure to create this schema
    defaultValues: {
      firstName: "Adura",
      lastName: "Shobowale",
      dob: "2005-08-07", // YYYY-MM-DD format for date inputs
      gender: "male",
      email: "adurashobzz@techstudio.com",
      phone: "08156893421",
      startDate: "2024-02-28",
      employmentType: "full-time",
    },
  });

  const {
    handleSubmit,
    // formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async () => {
    try {
      // Add your API call here
      // const response = await employeeService.create(data);
      toast.success("Employee created successfully");
      router.push("/admin/employees");
    } catch {
      toast.error("Failed to create employee");
    }
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb and Title */}
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl font-bold">Add Employee</h1>
        <div className="flex items-center gap-1 text-sm">
          <Link href="/admin/employees" className="text-primary">
            All Employee
          </Link>
          <p className="text-muted-foreground">&gt; Add New Employee</p>
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-10">
            {/* Personal Information Section */}
            <section className="">
              <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="firstName"
                  label="First Name"
                  type="text"
                  placeholder="Adura"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="lastName"
                  label="Last Name"
                  type="text"
                  className="!h-14 w-full"
                  placeholder="Shobowale"
                  required
                />
                <FormField name="dob" label="Date of Birth" className="!h-14 w-full" type="date" required />
                <FormField
                  name="gender"
                  label="Gender"
                  type="select"
                  className="bg-background !h-14 w-full"
                  options={genderOptions}
                  required
                />
                <FormField
                  name="email"
                  label="Work Email"
                  type="email"
                  placeholder="adurashobzz@techstudio.com"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="phone"
                  label="Phone Number"
                  className="!h-14 w-full"
                  type="text"
                  placeholder="08156893421"
                  required
                />
              </div>
            </section>

            {/* Employment Details Section */}
            <section>
              <h2 className="mb-4 text-lg font-semibold">Employment Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField name="startDate" className="!h-14 w-full" label="Start Date" type="date" required />
                <FormField
                  name="employmentType"
                  className="bg-background !h-14 w-full"
                  label="Employment Type"
                  type="select"
                  options={employmentTypeOptions}
                />
                <FormField
                  name="workMode"
                  label="Work Mode"
                  type="select"
                  className="bg-background !h-14 w-full"
                  options={workModeOptions}
                  required
                />
                <FormField
                  name="department"
                  label="Department"
                  type="select"
                  className="bg-background !h-14 w-full"
                  options={departmentOptions}
                  required
                />
                <FormField
                  name="role"
                  label="Role"
                  type="select"
                  className="bg-background !h-14 w-full"
                  options={roleOptions}
                  required
                />
              </div>
            </section>
            <section>
              <h2 className="mb-4 text-lg font-semibold">Salary Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <FormField
                  name="monthlyGrossSalary"
                  label="Monthly Gross Salary"
                  type="text"
                  placeholder="₦750,000.00"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="tax"
                  label="Tax"
                  type="text"
                  placeholder="10% of salary"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="pension"
                  label="Pension"
                  type="text"
                  placeholder="5% of salary"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="healthInsurance"
                  label="Health Insurance"
                  type="text"
                  placeholder="3% of salary"
                  className="!h-14 w-full"
                  required
                />

                <FormField
                  name="otherDeductions"
                  label="Other Deductions"
                  type="text"
                  placeholder="% of salary"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="bankName"
                  label="Bank Name"
                  type="text"
                  placeholder="Wema Bank"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="accountName"
                  label="Account Name"
                  type="text"
                  placeholder="Adura Shobowale"
                  className="!h-14 w-full"
                  required
                />
                <FormField
                  name="accountNumber"
                  label="Account Number"
                  type="text"
                  placeholder="0067514267"
                  className="!h-14 w-full"
                  required
                />
              </div>
            </section>
            <section>
              <h2 className="mb-4 text-lg font-semibold">Employee Documents</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8"></div>
            </section>
          </div>

          {/* Form Actions */}
          {/* <div className="mt-6 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/admin/employees")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !isValid}>
              {isSubmitting ? "Saving..." : "Save Employee"}
            </Button>
          </div> */}
        </form>
      </FormProvider>
    </div>
  );
};
